FROM python:3.10-slim

# ติดตั้งแพ็กเกจของระบบที่ EasyOCR จำเป็นต้องใช้
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# คัดลอกไฟล์ requirements และติดตั้งแพ็กเกจ Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# คัดลอกโค้ดทั้งหมดในโฟลเดอร์ backend เข้ามา
COPY . .

# เปิดพอร์ต 7860 (พอร์ตมาตรฐานของ Hugging Face)
EXPOSE 7860

# คำสั่งสั่งรัน FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
