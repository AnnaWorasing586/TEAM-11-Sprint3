## 🍜 NutriScan AI

NutriScan AI คือระบบ AI สำหรับสแกนฉลากโภชนาการอาหารจากภาพ เพื่อช่วยให้ผู้ใช้เข้าใจข้อมูลโภชนาการได้ง่ายและรวดเร็วมากขึ้น โดยระบบจะใช้ OCR และ AI ในการอ่าน วิเคราะห์ และสรุปข้อมูลสุขภาพอาหารอัตโนมัติ

---

## 📌 Overview

ผู้ใช้สามารถอัปโหลดหรือถ่ายรูปฉลากโภชนาการอาหาร จากนั้นระบบจะทำการ:

- อ่านข้อความจากภาพด้วย OCR
- แปลงข้อมูลให้อยู่ในรูปแบบโภชนาการ
- วิเคราะห์คุณค่าทางอาหาร
- สรุปผลให้อ่านง่าย เช่น น้ำตาลสูง โซเดียมสูง หรือเหมาะกับสุขภาพหรือไม่

เป้าหมายของโปรเจคคือช่วยให้การอ่านฉลากโภชนาการเป็นเรื่องง่าย เข้าถึงได้ และใช้เวลาเพียงไม่กี่วินาที

---

## 👤 User Flow

1. ผู้ใช้อัปโหลดหรือถ่ายรูปฉลากโภชนาการ
2. ระบบ OCR อ่านข้อมูลจากภาพ
3. ระบบ AI วิเคราะห์ข้อมูลโภชนาการ
4. ระบบสรุปผลด้านสุขภาพ
5. ผู้ใช้ดูผลลัพธ์และคำแนะนำ

---

## ✨ Features

- 📷 อัปโหลดหรือถ่ายภาพฉลากโภชนาการ
- 🔍 OCR อ่านข้อความจากภาพ
- 🤖 AI วิเคราะห์ข้อมูลโภชนาการ
- 🧠 สรุปผลสุขภาพอาหารอัตโนมัติ
- 📊 แสดงข้อมูล Sodium, Sugar
- ⚡ ประมวลผลแบบเรียลไทม์
- 💻 รองรับการใช้งานผ่านเว็บเบราว์เซอร์
- 📱 อยู่ระหว่างพัฒนาเพื่อรองรับอุปกรณ์มือถือ

---

## 🧰 Tech Stack

### Frontend
- React / Next.js
- Tailwind CSS
- Axios

### Backend
- FastAPI (Python)
- Pydantic
- Python-dotenv

### AI / OCR
- Tesseract OCR / EasyOCR
- GPT-based AI Model

### Database (Optional)
- MongoDB / PostgreSQL

### Deployment
- Frontend: Vercel / Netlify
- Backend: Render

---

## 🏗️ Architecture

```text
User
  ↓
Web Application
  ↓
Upload Nutrition Label Image
  ↓
Backend Processing
  ↓
OCR Processing
  ↓
Nutrition Analysis
  ↓
Result Display
```


---

## 📁 Project Structure

```text
TEAM-11-Sprint3/
│
├── frontend/
├── backend/
├── ux-ui/
├── docs/
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone Repository

```bash
git clone https://github.com/AnnaWorasing586/TEAM-11-Sprint3.git
cd TEAM-11-Sprint3
```

---

### 2. Backend Setup

```bash
cd backend

python -m venv venv

# Activate virtual environment

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend running at:

```text
http://localhost:8080
```

---

### 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend running at:

```text
http://localhost:3000
```

---

## 🌐 Deployment (Render)

### Backend Deployment

#### Build Command

```bash
pip install -r requirements.txt
```

#### Start Command

```bash
uvicorn app.main:app --host 0.0.0.0 --port 10000
```

#### Environment Variables

```env
OPENAI_API_KEY=your_api_key
```

---

## 🔌 API Endpoints

### Health Check

```http
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

---

### Scan Nutrition Label

```http
POST /api/scan
```

Request:

```json
{
  "image": "file"
}
```

Response:

```json
{
  "product_name": "Chocolate Milk",
  "calories": 250,
  "sugar": "30g",
  "fat": "12g",
  "protein": "5g",
  "analysis": "High sugar content. Consume moderately."
}
```

---

## 🎨 Design Highlights

- UI ใช้งานง่าย เน้นการสแกนและดูผลลัพธ์ทันที
- รองรับ Drag & Drop Upload
- แสดงผลข้อมูลแบบ Card Layout
- ใช้สีช่วยแสดงระดับความเสี่ยงด้านสุขภาพ
- Responsive Design รองรับมือถือ
- ใช้เวลาแสดงผลรวดเร็ว

---

## 🎯 UX Design Goals

- ลดขั้นตอนการใช้งานให้เหลือน้อยที่สุด
- ผู้ใช้สามารถสแกนและดูผลลัพธ์ได้ภายในไม่กี่วินาที
- แสดงข้อมูลโภชนาการในรูปแบบที่เข้าใจง่าย
- รองรับผู้ใช้ทุกช่วงวัย
- รองรับการใช้งานบนมือถือและเดสก์ท็อป

---

## 📊 Integration Flow

```text
Frontend
   ↓
Upload Image
   ↓
Backend API
   ↓
OCR Processing
   ↓
AI Analysis
   ↓
Nutrition Result
   ↓
Frontend Display
```

---

## 📄 License

MIT License

สามารถใช้งาน แก้ไข และพัฒนาต่อยอดได้อย่างอิสระ

---

## 🖥️ Main Screens

#### Home Page
- แนะนำระบบ NutriScan AI
- ปุ่มเริ่มต้นสแกนฉลาก

#### Upload Page
- อัปโหลดหรือถ่ายรูปฉลากอาหาร

#### Analysis Result Page
- แสดง Calories
- แสดง Sugar
- แสดง Fat
- แสดง Protein
- แสดงผลการวิเคราะห์สุขภาพ
