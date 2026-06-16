# Backend Prototype — Vision API

FastAPI backend ที่ frontend prototype เรียกตอนกดสแกน

รองรับ 2 vision provider — เลือกตาม env var ที่ตั้ง:
- **Gemini** (default · **ฟรี 1,500 รูป/วัน**) — `GEMINI_API_KEY`
- **Claude** (paid) — `ANTHROPIC_API_KEY`

+ OpenFoodFacts สำหรับบาร์โค้ด (ฟรี ไม่ต้องคีย์)

## ไฟล์

| ไฟล์ | หน้าที่ |
|---|---|
| `server.py` | FastAPI app · 3 endpoints |
| `requirements.txt` | dependencies (FastAPI, anthropic, httpx ฯลฯ) |
| `foods.json` | mock 20 รายการอาหาร (สำหรับทดสอบ frontend แบบไม่มี backend) |

## Endpoints

| URL | Input | Output |
|---|---|---|
| `GET /` | — | สถานะ service + รุ่น Claude ที่ใช้ |
| `GET /health` | — | `{ "ok": true }` |
| `POST /api/scan/photo` | `image` (multipart, JPEG/PNG ≤6MB) | `Food` JSON |
| `POST /api/scan/label` | `image` (multipart) | `Food` JSON · อ่านค่าตามฉลาก |
| `POST /api/scan/barcode` | `{"barcode": "8851234567890"}` | `Food` JSON · ดึงจาก OpenFoodFacts |

## Food schema

```json
{
  "name":       "ข้าวผัดกะเพราไก่ไข่ดาว",
  "tag":        "จานเดียว · 1 จาน",
  "kcal":       620,
  "protein":    28,
  "carbs":      68,
  "fat":        26,
  "sugar":      6,
  "sodium":     980,
  "confidence": 94
}
```

## ขั้นตอน Deploy บน Render

### 1. รับ API key

**ตัวเลือก A: Gemini (ฟรี — แนะนำ)**

1. ไป https://aistudio.google.com → login ด้วย Google account
2. มุมซ้ายบน คลิก **Get API Key** → **Create API key**
3. เลือก project (หรือ "Create new project") → **Copy** key (เริ่มด้วย `AIza...`)
4. ✅ ใช้ได้เลย ไม่ต้องเติมเงิน — free tier 1,500 requests/day, 15 RPM

**ตัวเลือก B: Claude (เสียเงิน — ถ้าไม่อยากใช้ Gemini)**

1. https://console.anthropic.com → Sign up
2. **Billing** → เติม $5 (~1,000 รูป)
3. **API Keys** → Create Key → copy (เริ่มด้วย `sk-ant-...`)

### 2. สร้าง Render Web Service

ที่ https://dashboard.render.com:

1. **+ New** → **Web Service**
2. เลือก repo `AnnaWorasing586/TEAM-11-Sprint3`
3. กรอกค่าตามตาราง:

| ช่อง | ค่า |
|---|---|
| **Name** | `nutriscan-api` |
| **Branch** | `feature/web-prototype-scan-result` |
| **Root Directory** | `backend/prototype` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn server:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` |

4. ในส่วน **Environment Variables** เพิ่ม **อย่างใดอย่างหนึ่ง**:

**ถ้าใช้ Gemini (แนะนำ):**

| Key | Value |
|---|---|
| `GEMINI_API_KEY` | (คีย์จากขั้นตอน 1A — เริ่มด้วย `AIza`) |
| `GEMINI_MODEL` | `gemini-2.0-flash` (default · ข้ามได้) |

**หรือถ้าใช้ Claude:**

| Key | Value |
|---|---|
| `ANTHROPIC_API_KEY` | (คีย์จากขั้นตอน 1B — เริ่มด้วย `sk-ant-`) |
| `CLAUDE_MODEL` | `claude-sonnet-4-6` (default · ข้ามได้) |

5. กด **Create Web Service** → รอ ~3-5 นาที deploy
6. เสร็จแล้วได้ URL เช่น `https://nutriscan-api.onrender.com`
7. ลองเปิด `https://nutriscan-api.onrender.com/` ในเบราว์เซอร์ — ควรเห็น JSON บอก `"provider": "gemini"` หรือ `"anthropic"` (ถ้าเห็น `"none ..."` แสดงว่ายังไม่ได้ตั้ง env var)

### 3. ต่อ frontend เข้ากับ backend

แก้ไฟล์ `frontend/prototype/index.html` บรรทัด:

```html
window.NS_API_URL = '';
```

เปลี่ยนเป็น:

```html
window.NS_API_URL = 'https://nutriscan-api.onrender.com';
```

commit + push → Render frontend จะ redeploy เอง → กดสแกน → ได้ผลจาก Claude จริง

## ค่าใช้จ่าย

- **Render Web Service Free tier:** ฟรี 750 ชม./เดือน · cold start ~30s หลัง idle 15 นาที (กดสแกนครั้งแรกหลังพักจะช้าหน่อย)
- **Gemini 2.0 Flash (free tier):** **ฟรี** 1,500 รูป/วัน · 15 req/นาที — เหลือเฟือสำหรับ demo
- **Anthropic Claude Sonnet 4.6:** ~$0.005 ต่อรูป — เติม $5 ใช้ได้ ~1,000 รูป
- **OpenFoodFacts:** ฟรี ไม่มีโควต้า

## โหมดที่ตัดออกจาก scope

- **โหมดแกลเลอรี (chip):** ตัดออกเพราะซ้ำกับปุ่มอัปโหลดรูปภาพข้างปุ่มถ่าย ทั้งสองทำสิ่งเดียวกัน

## รัน local (สำหรับ dev)

```bash
cd backend/prototype
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
export GEMINI_API_KEY=AIza...        # หรือ ANTHROPIC_API_KEY=sk-ant-...
uvicorn server:app --reload --port 8000
```

เปิด http://localhost:8000 ดูสถานะ
