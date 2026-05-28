🥗 NutriScan AI

ระบบ AI สำหรับสแกนฉลากโภชนาการอาหารจากภาพ เพื่อแปลงข้อมูลให้เข้าใจง่ายและวิเคราะห์สุขภาพอาหารแบบอัตโนมัติ

📌 ภาพรวมโปรเจค (Overview)

NutriScan AI คือเว็บแอปที่ช่วยให้ผู้ใช้สามารถอัปโหลดหรือถ่ายรูปฉลากโภชนาการอาหาร แล้วระบบจะใช้ AI ในการ:

อ่านข้อมูลจากภาพ (OCR)
แปลงข้อมูลโภชนาการให้อยู่ในรูปแบบโครงสร้าง
วิเคราะห์ความเหมาะสมต่อสุขภาพ
สรุปผลให้อ่านง่าย (เหมือนมีนักโภชนาการอธิบายให้)

🎯 เป้าหมายของโปรเจค:
ทำให้ “ข้อมูลโภชนาการที่เข้าใจยาก” กลายเป็น “ข้อมูลที่เข้าใจได้ในไม่กี่วินาที”

✨ ฟีเจอร์หลัก (Features)
📷 อัปโหลดรูปฉลากโภชนาการ / ถ่ายภาพจากกล้อง
🔍 ระบบ OCR อ่านตัวหนังสือจากภาพ
🤖 AI ช่วยแปลงข้อมูลให้อยู่ในรูปแบบโภชนาการที่เป็นโครงสร้าง
🧠 วิเคราะห์สุขภาพอาหาร (เช่น น้ำตาลสูง / ไขมันสูง)
📊 แสดงผลโภชนาการแบบแยกหมวด (Calories, Sugar, Fat, Protein)
⚡ ประมวลผลแบบเรียลไทม์
📱 รองรับมือถือและเดสก์ท็อป
🧾 (ถ้ามี) ระบบเก็บประวัติการสแกน
🧰 Tech Stack
Frontend
React / Next.js
Tailwind CSS
Axios (เรียก API)
Backend
FastAPI (Python)
Pydantic (จัดการข้อมูล)
Python dotenv
AI / OCR
Tesseract OCR / EasyOCR
LLM (เช่น GPT) สำหรับช่วยวิเคราะห์ข้อมูลโภชนาการ
Database (ถ้ามี)
MongoDB / PostgreSQL
Deployment
Frontend: Vercel / Netlify
Backend: Render
Storage: Local หรือ Cloud Storage
🏗️ สถาปัตยกรรมระบบ (Architecture)
ผู้ใช้ (Frontend)
      │
      ▼
อัปโหลดภาพฉลากโภชนาการ
      │
      ▼
Frontend ส่ง API ไป Backend
      │
      ▼
Backend (FastAPI)
      │
      ├── OCR ดึงข้อความจากภาพ
      │
      ├── AI วิเคราะห์และจัดโครงสร้างข้อมูล
      │
      ├── วิเคราะห์สุขภาพอาหาร
      │
      ▼
ส่งผลลัพธ์กลับเป็น JSON
      │
      ▼
Frontend แสดงผลในรูปแบบ Dashboard

📁 Project Structure
nutriscan-ai/
│
├── frontend/
│   ├── components/      # UI Components
│   ├── pages/           # หน้าเว็บ
│   ├── services/        # เรียก API
│   ├── styles/          # CSS / Tailwind
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py      # จุดเริ่มต้น API
│   │   ├── routes/
│   │   │   └── scan.py  # API สแกนภาพ
│   │   ├── services/
│   │   │   ├── ocr.py   # OCR logic
│   │   │   ├── ai.py    # AI วิเคราะห์
│   │   │   └── parser.py
│   │   └── models/
│   │
│   ├── requirements.txt
│   └── .env
│
├── docs/
│   ├── integration-map.md
│   ├── api-spec.md
│
└── README.md
