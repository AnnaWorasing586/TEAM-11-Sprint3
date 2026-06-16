"""NutriScan AI prototype backend.

3 endpoints that frontend calls:
  POST /api/scan/photo    — image upload, returns Food JSON
  POST /api/scan/label    — image upload (nutrition label), returns Food JSON
  POST /api/scan/barcode  — JSON {barcode}, returns Food JSON via OpenFoodFacts

Set ANTHROPIC_API_KEY env var on Render before first request, otherwise
photo/label endpoints will 503. Barcode works without a key (uses
OpenFoodFacts public API).
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
    import anthropic
except ImportError:
    anthropic = None

MODEL = os.getenv("CLAUDE_MODEL", "claude-sonnet-4-6")
MAX_IMAGE_BYTES = 6 * 1024 * 1024

app = FastAPI(title="NutriScan AI Prototype Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_client() -> "anthropic.Anthropic":
    key = os.getenv("ANTHROPIC_API_KEY")
    if not key:
        raise HTTPException(
            status_code=503,
            detail="ANTHROPIC_API_KEY env var ยังไม่ได้ตั้งค่าบน Render — ดู README",
        )
    if anthropic is None:
        raise HTTPException(status_code=503, detail="anthropic SDK not installed")
    return anthropic.Anthropic(api_key=key)


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


async def claude_vision(image_bytes: bytes, instruction: str) -> dict[str, Any]:
    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="image too large")
    client = get_client()
    img_b64 = base64.b64encode(image_bytes).decode("ascii")
    try:
        msg = client.messages.create(
            model=MODEL,
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
                        {"type": "text", "text": f"{instruction}\n\n{SCHEMA}"},
                    ],
                }
            ],
        )
    except anthropic.APIError as exc:
        raise HTTPException(status_code=502, detail=f"Claude API error: {exc}")
    text = msg.content[0].text if msg.content else ""
    try:
        raw = extract_json(text)
    except (ValueError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=502, detail=f"failed to parse model output: {exc}")
    return normalize_food(raw)


@app.get("/")
def root():
    return {
        "service": "NutriScan AI Prototype Backend",
        "model": MODEL,
        "endpoints": ["/api/scan/photo", "/api/scan/label", "/api/scan/barcode"],
        "has_api_key": bool(os.getenv("ANTHROPIC_API_KEY")),
    }


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/api/scan/photo")
async def scan_photo(image: UploadFile = File(...)):
    data = await image.read()
    return await claude_vision(
        data,
        "วิเคราะห์อาหารในรูปนี้ ระบุชื่อเมนูภาษาไทย และประมาณการค่าโภชนาการต่อ 1 หน่วยบริโภค",
    )


@app.post("/api/scan/label")
async def scan_label(image: UploadFile = File(...)):
    data = await image.read()
    return await claude_vision(
        data,
        "อ่านข้อมูลโภชนาการจากฉลากในรูปนี้ ใช้ค่าตามที่ระบุในฉลากต่อ 1 หน่วยบริโภค "
        "ถ้ามีชื่อผลิตภัณฑ์/แบรนด์ในรูป ใส่เป็น name ถ้าไม่มี ใส่ 'ผลิตภัณฑ์ที่สแกน'",
    )


class BarcodeIn(BaseModel):
    barcode: str


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
