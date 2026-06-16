# NutriScan AI — Web Prototype

Prototype หน้าจอ 3 หน้า (Home / Scan / Result) สำหรับใช้เป็น **reference การออกแบบ** ก่อน implement จริงใน Flutter app ที่ `frontend/`

ไม่ใช่โค้ดที่จะ ship — เป็น HTML/CSS/JS ล้วน เปิดในเบราว์เซอร์เพื่อเดิน flow และตรวจสไตล์ visual

## โครงสร้าง

- `index.html` — ทั้งหมดในไฟล์เดียว (CSS + JS inline)

## วิธีรัน

ดับเบิลคลิก `index.html` หรือเปิดผ่าน local server:

```powershell
cd ux-ui/prototype/web
python -m http.server 5500
```

แล้วเปิด http://localhost:5500

## ฟีเจอร์

- **Home** — วงแหวนแคลอรี, มาโคร 3 ตัว, กราฟ 7 วัน, รายการมื้อ, การ์ดเป้าหมาย/TDEE/BMI
- **Scan** — viewfinder + เส้นสแกน, 4 โหมด (อาหาร/บาร์โค้ด/ฉลาก/แกลเลอรี), AI loading 1.9s
- **Result** — แคลอรีรวม, 5 สารอาหารเทียบ %/วัน, ปรับ serving 0.5–3, badge AI confidence
- **Settings** — แก้ชื่อ, เป้าหมายแคลอรี/วัน, สีธีม (เขียว/ฟ้า/คอรัล) — persist ใน `localStorage`

## State + Flow

State management แบบ vanilla (single store + `setState` + re-render) ไม่พึ่ง framework

`Home → Scan → กดถ่าย → AI 1.9s → Result → บันทึก → Home (วงแหวน+กราฟ+มื้ออาหารอัปเดต)`

## ที่มา

สร้างจาก design handoff bundle ของ Claude Design (`NutriScan AI.dc.html`) — แปลงจาก DC template engine เป็น vanilla HTML/CSS/JS
