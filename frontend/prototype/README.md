# Frontend Prototype — NutriScan AI

Web prototype 3 หน้า (Home / Scan / Result) + Settings — สร้างเป็น reference visual + flow ก่อน implement ในแอป Flutter ที่ `frontend/` ตัวจริง

## ไฟล์

| ไฟล์ | หน้าที่ |
|---|---|
| `index.html` | โครง HTML + viewport |
| `styles.css` | CSS animations (scanline, ring, spinner, etc.) |
| `app.js` | State store + render 4 หน้า + flow logic |

## วิธีรัน

ดับเบิลคลิก `index.html` ก็พอ — หรือเปิดผ่าน local server เพื่อให้ animations ลื่นกว่า:

```powershell
cd frontend/prototype
python -m http.server 5500
```

แล้วเปิด http://localhost:5500

## Flow ที่ทำได้

```
Home → กด "สแกน" → เลือกโหมด → ปุ่มถ่าย → AI 1.9s → Result
     ↓                                                     ↓
Settings (เฟืองมุมขวาบน)                          บันทึก → Home (update วงแหวน+กราฟ+มื้อ)
```

## State

Single store ใน `app.js`:
- `page`: home | scan | result | settings
- `scanStage`: idle | analyzing
- `activeMode`: food | barcode | label | gallery
- `servings`: 0.5–3 step 0.5
- `consumed/pConsumed/cConsumed/fConsumed`: ตัวเลขสะสมในวัน
- `meals[]`: รายการมื้อ
- `userName/dailyGoal/accent` → persist ใน `localStorage` (key `nutriscan.prefs.v1`)

## Mock data

20 อาหารไทย/healthy ฝังใน `app.js` (ค่าโภชนาการ + AI confidence) — สำเนา canonical อยู่ที่ `backend/prototype/foods.json`

## ที่จะต้องทำต่อ (เมื่อย้ายเป็น Flutter)

- เปลี่ยน inline styles → Flutter `Theme` / `Container` styling
- ใช้ Flutter `Camera` package แทน viewfinder placeholder
- ต่อ API จริง ตามคำแนะนำใน `backend/prototype/README.md`

## ที่มา

แปลงจาก Claude Design handoff bundle — design source อยู่ที่ `ux-ui/prototype/source/`
