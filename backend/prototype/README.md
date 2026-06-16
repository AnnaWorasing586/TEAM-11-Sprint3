# Backend Prototype — Mock Data

ยังไม่มี server จริงสำหรับ prototype — มีแค่ **mock data** ให้ backend dev ใช้เป็นจุดเริ่ม schema และทดสอบ frontend

## ไฟล์

| ไฟล์ | หน้าที่ |
|---|---|
| `foods.json` | ฐานข้อมูล mock 20 รายการอาหาร — schema เดียวกับที่ frontend prototype ใช้ |

## Schema

```json
{
  "name":       "ข้าวผัดกะเพราไก่ไข่ดาว",
  "tag":        "จานเดียว · 1 จาน",
  "kcal":       620,
  "protein":    28,      // g
  "carbs":      68,      // g
  "fat":        26,      // g
  "sugar":      6,       // g
  "sodium":     980,     // mg
  "confidence": 94       // % AI confidence (0-100)
}
```

## ที่ backend จริงต้องทำต่อ

3 เส้นทาง endpoint ที่ frontend จะเรียก (ตอนนี้ prototype สุ่มจาก mock data แทน):

| Endpoint | Input | Output |
|---|---|---|
| `POST /api/scan/photo` | รูปภาพอาหาร (multipart — จากกล้องหรือแกลเลอรี) | `Food` object ตาม schema ด้านบน |
| `POST /api/scan/barcode` | `{ "barcode": "8851234567890" }` | `Food` object |
| `POST /api/scan/label` | รูปฉลากโภชนาการ (multipart) | `Food` object — `name` อาจเป็น `"ผลิตภัณฑ์ที่สแกน"` ถ้า OCR ไม่เจอชื่อแบรนด์ |

ที่ backend จริง ๆ จะต่อ external API:

| งาน | บริการแนะนำ |
|---|---|
| รูปอาหาร | LogMeal Food AI / Nutritionix Image API / Claude Vision |
| บาร์โค้ด | Open Food Facts (ฟรี ไม่ต้อง key) — `https://world.openfoodfacts.org/api/v2/product/{barcode}.json` |
| ฉลาก OCR | CRAFT (text detection — มีโมเดลแล้วใน `backend/craft_mlt_25k.pth`) + Google Cloud Vision / AWS Textract สำหรับ OCR / หรือใช้ Claude Vision ส่งรูปฉลากแล้ว parse ค่าโภชนาการเป็น JSON ตรง ๆ |

## หมายเหตุเรื่องโหมดฉลาก

ฉลากโภชนาการบอก **ค่าสารอาหาร** แต่ไม่ได้บอกชื่อเมนู ดังนั้นในทาง implementation มี 2 ทางเลือก:

1. **OCR เฉพาะตาราง** → คืนค่าโภชนาการ + ตั้งชื่อเป็น `"ผลิตภัณฑ์ที่สแกน"` หรือให้ user พิมพ์ชื่อเอง
2. **OCR ทั้งบรรจุภัณฑ์** → อ่านทั้งชื่อแบรนด์ + ตารางโภชนาการ → แม่นกว่าแต่ซับซ้อนกว่า

ใน prototype สุ่ม mock data ทุกโหมด ดังนั้นชื่อจะไม่ตรงกับฉลากจริง — เป็นข้อจำกัดที่จะหายไปเมื่อต่อ backend จริง

## โหมดที่ตัดออกจาก scope

- **โหมดแกลเลอรี (chip):** ตัดออกเพราะซ้ำกับปุ่มอัปโหลดรูปภาพข้างปุ่มถ่าย ทั้งสองทำสิ่งเดียวกัน

## คำเตือน

- อย่าใส่ API key ใน frontend — wrap ไว้ใน backend เสมอ
- Cache ผล AI ตาม hash ของรูปเพื่อประหยัด quota
- ถ้า confidence < 70% ให้ส่ง flag กลับ frontend ให้ user ยืนยันก่อนบันทึก
