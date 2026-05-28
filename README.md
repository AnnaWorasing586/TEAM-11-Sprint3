# 🥗 NutriScan AI

ระบบ AI สำหรับสแกนฉลากโภชนาการอาหารจากภาพ เพื่อแปลงข้อมูลให้เข้าใจง่ายและวิเคราะห์สุขภาพอาหารแบบอัตโนมัติ

---

# 📌 Overview

**NutriScan AI** คือเว็บแอปที่ช่วยให้ผู้ใช้สามารถอัปโหลดหรือถ่ายรูปฉลากโภชนาการอาหาร แล้วระบบจะใช้ AI ในการ:

- อ่านข้อมูลจากภาพ (OCR)
- แปลงข้อมูลโภชนาการให้อยู่ในรูปแบบโครงสร้าง
- วิเคราะห์ความเหมาะสมต่อสุขภาพ
- สรุปผลให้อ่านง่ายในภาษาคนทั่วไป

🎯 เป้าหมาย: ทำให้ข้อมูลโภชนาการที่ซับซ้อน กลายเป็นข้อมูลที่เข้าใจได้ในไม่กี่วินาที

---

# ✨ Features

- 📷 อัปโหลดหรือถ่ายภาพฉลากโภชนาการ
- 🔍 OCR อ่านข้อความจากภาพ
- 🤖 AI แปลงข้อมูลให้อยู่ในรูปแบบโภชนาการ
- 🧠 วิเคราะห์สุขภาพอาหาร (น้ำตาลสูง / ไขมันสูง / โปรตีนต่ำ ฯลฯ)
- 📊 แสดงผลโภชนาการแบบแยกหมวด
- ⚡ ประมวลผลแบบเรียลไทม์
- 📱 รองรับมือถือและเดสก์ท็อป

---

# 🧰 Tech Stack

## Frontend
- React / Next.js
- Tailwind CSS
- Axios

## Backend
- FastAPI (Python)
- Pydantic
- Python-dotenv

## AI / OCR
- Tesseract OCR / EasyOCR
- GPT-based LLM สำหรับวิเคราะห์ข้อมูล

## Database (optional)
- MongoDB / PostgreSQL

## Deployment
- Frontend: Vercel / Netlify
- Backend: Render

---

# 🏗️ Architecture

User (Frontend)
↓
Upload Image
↓
Backend (FastAPI)
↓
OCR Engine → ดึงข้อความจากภาพ
↓
AI Parser → แปลงข้อมูลโภชนาการ
↓
Nutrition Analyzer → วิเคราะห์สุขภาพ
↓
JSON Response
↓
Frontend แสดงผล

---

# 📁 Project Structure
