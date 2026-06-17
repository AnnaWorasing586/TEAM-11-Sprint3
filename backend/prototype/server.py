"""NutriScan AI prototype backend.

3 endpoints that frontend calls:
  POST /api/scan/photo    — image upload, returns Food JSON
  POST /api/scan/label    — image upload (nutrition label), returns Food JSON
  POST /api/scan/barcode  — JSON {barcode}, returns Food JSON via OpenFoodFacts

Auto-picks the vision provider based on which env var is set:
  - GEMINI_API_KEY        → Gemini (default · free tier 1500 req/day)
  - ANTHROPIC_API_KEY     → Claude (paid)
  - neither               → photo/label endpoints 503; barcode still works
"""

from __future__ import annotations

import base64
import json
import os
import re
from typing import Any

import httpx
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    import google.generativeai as genai
except ImportError:
    genai = None
try:
    import anthropic
except ImportError:
    anthropic = None

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-sonnet-4-6")
MAX_IMAGE_BYTES = 6 * 1024 * 1024


def active_provider() -> str:
    if os.getenv("GEMINI_API_KEY"):
        return "gemini"
    if os.getenv("ANTHROPIC_API_KEY"):
        return "anthropic"
    return ""

app = FastAPI(title="NutriScan AI Prototype Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


SCHEMA = """ตอบเป็น JSON เท่านั้น (ไม่มี markdown / ข้อความอื่น) ตาม schema นี้:
{
  "name": "ชื่ออาหารเป็นภาษาไทย",
  "tag": "ประเภท · ปริมาณ เช่น 'จานเดียว · 1 จาน'",
  "kcal": int (พลังงานรวมต่อ 1 หน่วยบริโภค),
  "protein": int (กรัม),
  "carbs": int (กรัม),
  "fat": int (กรัม),
  "sugar": int (กรัม),
  "sodium": int (มิลลิกรัม),
  "confidence": int (ความมั่นใจ 0-100)
}
ถ้าระบุชื่อเมนูไม่ได้ ตั้งเป็น "ผลิตภัณฑ์ที่สแกน" """


def extract_json(text: str) -> dict[str, Any]:
    """Pull a JSON object out of an LLM response that may include extra text."""
    text = re.sub(r"```(?:json)?\s*", "", text).replace("```", "")
    start = text.find("{")
    end = text.rfind("}") + 1
    if start < 0 or end <= start:
        raise ValueError(f"no JSON object in model response: {text[:200]}")
    return json.loads(text[start:end])


def normalize_food(raw: dict[str, Any]) -> dict[str, Any]:
    def as_int(v, default=0):
        try:
            return int(round(float(v)))
        except (TypeError, ValueError):
            return default

    return {
        "name": str(raw.get("name") or "ผลิตภัณฑ์ที่สแกน")[:80],
        "tag": str(raw.get("tag") or "1 หน่วยบริโภค")[:60],
        "kcal": max(0, as_int(raw.get("kcal"))),
        "protein": max(0, as_int(raw.get("protein"))),
        "carbs": max(0, as_int(raw.get("carbs"))),
        "fat": max(0, as_int(raw.get("fat"))),
        "sugar": max(0, as_int(raw.get("sugar"))),
        "sodium": max(0, as_int(raw.get("sodium"))),
        "confidence": min(100, max(0, as_int(raw.get("confidence"), 80))),
    }


def _claude_call(image_bytes: bytes, prompt: str) -> str:
    if anthropic is None:
        raise HTTPException(status_code=503, detail="anthropic SDK not installed")
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    img_b64 = base64.b64encode(image_bytes).decode("ascii")
    try:
        msg = client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": img_b64,
                            },
                        },
                        {"type": "text", "text": prompt},
                    ],
                }
            ],
        )
    except anthropic.APIError as exc:
        raise HTTPException(status_code=502, detail=f"Claude API error: {exc}")
    return msg.content[0].text if msg.content else ""


def _gemini_call(image_bytes: bytes, prompt: str) -> str:
    if genai is None:
        raise HTTPException(status_code=503, detail="google-generativeai SDK not installed")
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel(GEMINI_MODEL)
    try:
        resp = model.generate_content(
            [
                {"mime_type": "image/jpeg", "data": image_bytes},
                prompt,
            ]
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {exc}")
    return resp.text or ""


async def vision_scan(image_bytes: bytes, instruction: str) -> dict[str, Any]:
    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="image too large")
    provider = active_provider()
    if not provider:
        raise HTTPException(
            status_code=503,
            detail="ตั้ง GEMINI_API_KEY หรือ ANTHROPIC_API_KEY ใน env ก่อน — ดู README",
        )
    prompt = f"{instruction}\n\n{SCHEMA}"
    text = _gemini_call(image_bytes, prompt) if provider == "gemini" else _claude_call(image_bytes, prompt)
    try:
        raw = extract_json(text)
    except (ValueError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=502, detail=f"failed to parse model output: {exc}")
    return normalize_food(raw)


@app.get("/")
def root():
    provider = active_provider()
    return {
        "service": "NutriScan AI Prototype Backend",
        "provider": provider or "none (set GEMINI_API_KEY or ANTHROPIC_API_KEY)",
        "model": GEMINI_MODEL if provider == "gemini" else CLAUDE_MODEL if provider == "anthropic" else None,
        "endpoints": ["/api/scan/photo", "/api/scan/label", "/api/scan/barcode", "/api/recommend", "/api/weekly-summary", "/api/health-advice"],
    }


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/api/scan/photo")
async def scan_photo(image: UploadFile = File(...)):
    data = await image.read()
    return await vision_scan(
        data,
        "วิเคราะห์อาหารในรูปนี้ ระบุชื่อเมนูภาษาไทย และประมาณการค่าโภชนาการต่อ 1 หน่วยบริโภค",
    )


@app.post("/api/scan/label")
async def scan_label(image: UploadFile = File(...)):
    data = await image.read()
    return await vision_scan(
        data,
        "อ่านข้อมูลโภชนาการจากฉลากในรูปนี้ ใช้ค่าตามที่ระบุในฉลากต่อ 1 หน่วยบริโภค "
        "ถ้ามีชื่อผลิตภัณฑ์/แบรนด์ในรูป ใส่เป็น name ถ้าไม่มี ใส่ 'ผลิตภัณฑ์ที่สแกน'",
    )


class BarcodeIn(BaseModel):
    barcode: str


class RecommendIn(BaseModel):
    remaining_kcal: int = 0
    remaining_protein: int = 0
    remaining_carbs: int = 0
    remaining_fat: int = 0
    hour: int = 12


class HealthAdviceIn(BaseModel):
    food_name: str = ""
    kcal: int = 0
    sugar_g: int = 0
    sodium_mg: int = 0
    rule_verdict: str = "yellow"
    user_name: str = ""
    bmi: float = 0
    weight: float = 0
    height: float = 0
    body_goal: str = ""
    consumed_today: int = 0
    daily_goal: int = 0


class WeeklySummaryIn(BaseModel):
    history: list[dict] = []
    avg_kcal: int = 0
    goal_kcal: int = 0
    streak: int = 0


def _text_via_provider(prompt: str) -> str:
    provider = active_provider()
    if not provider:
        raise HTTPException(503, "ตั้ง GEMINI_API_KEY หรือ ANTHROPIC_API_KEY ใน env ก่อน")
    if provider == "gemini":
        if genai is None:
            raise HTTPException(503, "google-generativeai SDK not installed")
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel(GEMINI_MODEL)
        try:
            resp = model.generate_content(prompt)
        except Exception as exc:
            raise HTTPException(502, f"Gemini API error: {exc}")
        return resp.text or ""
    if anthropic is None:
        raise HTTPException(503, "anthropic SDK not installed")
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    try:
        msg = client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=1024,
            messages=[{"role": "user", "content": [{"type": "text", "text": prompt}]}],
        )
    except anthropic.APIError as exc:
        raise HTTPException(502, f"Claude API error: {exc}")
    return msg.content[0].text if msg.content else ""


@app.post("/api/recommend")
async def recommend(payload: RecommendIn):
    """AI suggests a Thai meal that fits the user's remaining daily macros."""
    hour = payload.hour
    if   hour < 11: meal_type = "มื้อเช้า"
    elif hour < 15: meal_type = "มื้อกลางวัน"
    elif hour < 18: meal_type = "ของว่าง"
    else:           meal_type = "มื้อเย็น"

    prompt = (
        f"ผู้ใช้แอปติดตามแคลอรี เหลือพลังงานวันนี้: {payload.remaining_kcal} kcal "
        f"(โปรตีน {payload.remaining_protein}g · คาร์บ {payload.remaining_carbs}g · ไขมัน {payload.remaining_fat}g) · "
        f"เวลาตอนนี้คือ{meal_type}\n"
        "แนะนำเมนูอาหารไทย 1 จาน ที่เหมาะกับช่วงเวลาและพอดีกับมาโครที่เหลือ "
        "ตอบเป็น JSON เท่านั้น (ไม่มี markdown):\n"
        '{"name": "ชื่อเมนูภาษาไทย", "kcal": int, "reason": "เหตุผลสั้นๆ 1 บรรทัด ทำไมเหมาะ"}'
    )
    text = _text_via_provider(prompt)
    try:
        raw = extract_json(text)
    except (ValueError, json.JSONDecodeError):
        raise HTTPException(502, "failed to parse recommendation")
    return {
        "name": str(raw.get("name") or "อกไก่ย่างกับสลัด")[:60],
        "kcal": max(0, min(2000, int(raw.get("kcal") or 0))),
        "reason": str(raw.get("reason") or "เป็นตัวเลือกสุขภาพ")[:120],
        "meal_type": meal_type,
    }


@app.post("/api/health-advice")
async def health_advice(payload: HealthAdviceIn):
    """AI gives personalized health context on top of the rule-based traffic light."""
    verdict_label = {"green": "ทานได้ตามปกติ", "yellow": "ทานพอประมาณ", "red": "ควรหลีกเลี่ยง"}.get(payload.rule_verdict, "พอประมาณ")
    bmi_note = ""
    if payload.bmi > 0:
        if payload.bmi < 18.5:
            bmi_note = f"ผู้ใช้น้ำหนักต่ำกว่าเกณฑ์ (BMI {payload.bmi})"
        elif payload.bmi >= 25:
            bmi_note = f"ผู้ใช้น้ำหนักเกินเกณฑ์ (BMI {payload.bmi})"
        else:
            bmi_note = f"ผู้ใช้น้ำหนักปกติ (BMI {payload.bmi})"
    goal_note = f"เป้าหมาย: {payload.body_goal}" if payload.body_goal else ""
    daily_note = ""
    if payload.daily_goal > 0:
        remaining = payload.daily_goal - payload.consumed_today
        daily_note = f"วันนี้กินไปแล้ว {payload.consumed_today}/{payload.daily_goal} kcal (เหลือ {remaining} kcal)"

    prompt = (
        f"อาหารที่สแกน: {payload.food_name}\n"
        f"ค่าโภชนาการต่อหน่วยบริโภค: {payload.kcal} kcal · น้ำตาล {payload.sugar_g}g · โซเดียม {payload.sodium_mg}mg\n"
        f"คำตัดสินจากเกณฑ์ทางการ (UK FSA / WHO): {verdict_label}\n"
        f"{bmi_note}\n{goal_note}\n{daily_note}\n\n"
        "ในฐานะนักโภชนาการ ให้คำแนะนำเฉพาะผู้ใช้คนนี้ — ตอบเป็น JSON เท่านั้น (ไม่ markdown):\n"
        '{"headline": "ประโยคเดียวสรุปว่าควรกินอาหารนี้หรือไม่ + อ้างเหตุผลส่วนตัว",'
        ' "reasons": ["เหตุผลข้อ 1 สั้น (อ้างอิงค่าโภชนาการหรือสภาพร่างกาย)", "เหตุผลข้อ 2"],'
        ' "alternatives": ["ทางเลือกที่ดีกว่า 1", "ทางเลือกที่ดีกว่า 2"]}'
    )
    text = _text_via_provider(prompt)
    try:
        raw = extract_json(text)
    except (ValueError, json.JSONDecodeError):
        raise HTTPException(502, "failed to parse advice")
    return {
        "headline": str(raw.get("headline") or "")[:250],
        "reasons": [str(r)[:200] for r in (raw.get("reasons") or [])][:4],
        "alternatives": [str(a)[:120] for a in (raw.get("alternatives") or [])][:3],
    }


@app.post("/api/weekly-summary")
async def weekly_summary(payload: WeeklySummaryIn):
    """AI summarizes the user's 7-day eating pattern."""
    if not payload.history:
        return {"summary": "ยังไม่มีข้อมูลเพียงพอ — บันทึกมื้ออาหารเพื่อดูสรุปรายสัปดาห์", "tips": [], "warnings": []}

    history_str = "\n".join(
        f"- {h.get('date', '?')}: {h.get('kcal', 0)} kcal, {h.get('meals', 0)} มื้อ"
        for h in payload.history[-7:]
    )
    prompt = (
        f"ประวัติการกินอาหาร 7 วันล่าสุด:\n{history_str}\n"
        f"เฉลี่ย {payload.avg_kcal} kcal/วัน · เป้าหมาย {payload.goal_kcal} kcal/วัน · streak {payload.streak} วัน\n\n"
        "วิเคราะห์รูปแบบการกินและให้คำแนะนำสั้นๆ ตอบเป็น JSON (ไม่มี markdown):\n"
        '{"summary": "สรุปภาพรวม 1-2 ประโยค", "tips": ["คำแนะนำสั้นๆ ข้อ 1", "คำแนะนำข้อ 2"], "warnings": ["ข้อสังเกตที่ควรระวัง ถ้ามี"]}'
    )
    text = _text_via_provider(prompt)
    try:
        raw = extract_json(text)
    except (ValueError, json.JSONDecodeError):
        raise HTTPException(502, "failed to parse summary")
    return {
        "summary": str(raw.get("summary") or "")[:300],
        "tips": [str(t)[:160] for t in (raw.get("tips") or [])][:4],
        "warnings": [str(w)[:160] for w in (raw.get("warnings") or [])][:3],
    }


@app.post("/api/scan/barcode")
async def scan_barcode(payload: BarcodeIn):
    barcode = payload.barcode.strip()
    if not barcode or not barcode.isdigit():
        raise HTTPException(status_code=400, detail="invalid barcode")
    url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}.json"
    async with httpx.AsyncClient(timeout=8.0) as cli:
        r = await cli.get(url)
    if r.status_code != 200:
        raise HTTPException(status_code=502, detail="OpenFoodFacts unreachable")
    body = r.json()
    if body.get("status") != 1:
        return normalize_food(
            {"name": "ไม่พบในฐานข้อมูล", "tag": f"บาร์โค้ด {barcode}", "confidence": 30}
        )
    p = body["product"]
    n = p.get("nutriments", {})
    serv = (
        n.get("energy-kcal_serving")
        or (n.get("energy-kcal_100g", 0) * float(p.get("serving_quantity") or 100) / 100)
        or 0
    )
    return normalize_food(
        {
            "name": p.get("product_name_th")
            or p.get("product_name")
            or "ผลิตภัณฑ์",
            "tag": (p.get("brands") or "บาร์โค้ด")[:60],
            "kcal": serv,
            "protein": n.get("proteins_serving") or n.get("proteins_100g"),
            "carbs": n.get("carbohydrates_serving") or n.get("carbohydrates_100g"),
            "fat": n.get("fat_serving") or n.get("fat_100g"),
            "sugar": n.get("sugars_serving") or n.get("sugars_100g"),
            "sodium": (n.get("sodium_serving") or n.get("sodium_100g") or 0) * 1000,
            "confidence": 95,
        }
    )
