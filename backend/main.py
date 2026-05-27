from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
from PIL import Image
import io

app = FastAPI(title="NutriScan AI API")

# รองรับการเชื่อมต่อจาก Mobile App (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def analyze_text(text: str):
    """Logic ประเมินคะแนนจากข้อความที่ได้จาก OCR (Mock อย่างง่าย)"""
    text_lower = text.lower()
    
    # จำลองการเช็คคำว่าน้ำตาล/Sugar
    if "sugar" in text_lower or "น้ำตาล" in text_lower:
        # สมมติว่าถ้าเจอคำว่า high หรือ ปริมาณเยอะ ให้เป็นสีแดง
        if "high" in text_lower or "20g" in text_lower:
            return {"color": "red", "score": 35, "recommendation": "น้ำตาลสูงมาก! ควรหลีกเลี่ยง เสี่ยงต่อสุขภาพ"}
        else:
            return {"color": "yellow", "score": 65, "recommendation": "น้ำตาลปานกลาง ทานได้แต่พอดีนะ"}
    
    # หากไม่เจอคำเตือน หรือเป็นอาหารคลีน
    return {"color": "green", "score": 90, "recommendation": "ยอดเยี่ยม! น้ำตาลต่ำ ดีต่อสุขภาพ ทานได้เลย"}

@post_route := app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # อ่านไฟล์ภาพ
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # ทำ OCR (หมายเหตุ: หากรันบนเครื่อง ต้องติดตั้งโปรแกรม Tesseract OCR ในเครื่องด้วย)
        try:
            extracted_text = pytesseract.image_to_string(image, lang='eng+tha')
        except Exception:
            # Fallback หากเครื่องผู้พัฒนาไม่ได้ติดตั้ง Tesseract OCR ไว้ จะได้ไม่บึ้ม
            extracted_text = "Mock text: Sugar 20g" 

        # วิเคราะห์ผล
        result = analyze_text(extracted_text)
        result["ocr_text"] = extracted_text.strip()
        
        return result
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)