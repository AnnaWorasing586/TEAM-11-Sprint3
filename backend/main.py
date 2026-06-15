from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import easyocr
import re

app = FastAPI(title="NutriScan AI 100Percent Honest API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# โหลด OCR
reader = easyocr.Reader(['th', 'en'], model_storage_directory='.')

def extract_nutrition_values(text_list):
    # ตั้งค่าเริ่มต้นเป็น "ไม่พบข้อมูล" ชัดๆ เผื่อกรณีกล้องสแกนพลาด/หลุดบรรทัด
    calories_val = "ไม่พบข้อมูล"
    protein_val = "ไม่พบข้อมูล"
    carbs_val = "ไม่พบข้อมูล"
    fat_val = "ไม่พบข้อมูล"
    sugar_val = "ไม่พบข้อมูล"
    sodium_val = "ไม่พบข้อมูล"

    full_text = " ".join(text_list).lower()
    full_text_clean = full_text.replace(" ", "")

    # 1. พลังงาน (Calories) - เจาะจงดักเลขที่อยู่หลังคำว่าพลังงานทั้งหมดโดยตรง
    cal_match = re.search(r'(?:พลังงานทั้งหมด|energy)\s*(\d+)', full_text)
    if cal_match:
        calories_val = int(cal_match.group(1))
    else:
        cal_backup = re.search(r'(\d+)\s*(?:กิโลแคลอรี|kcal|กิโลแคล)', full_text)
        if cal_backup:
            calories_val = int(cal_backup.group(1))

    # 2. โปรตีน (Protein) - บังคับหาตัวเลขที่อยู่ติดกับคำว่าโปรตีนทันที ไม่ข้ามบรรทัด
    protein_match = re.search(r'(?:โปรตีน|โปรติน|โปรตึน|โปรติ|เปรตีน|โปรดึน|โปรดีน|protein)\s*(\d+(?:\.\d+)?)', full_text)
    if protein_match:
        protein_val = float(protein_match.group(1))

    # 3. คาร์โบไฮเดรต (Carbs) - หาตัวเลขที่อยู่ติดกับคำหลักทันที
    carbs_match = re.search(r'(?:คาร์โบไฮเดรตทั้งหมด|คาร์โบไฮเดรต|คาร์โบไฮเดรท|คาร์โบ|carbohydrate|carb)\s*(\d+(?:\.\d+)?)', full_text)
    if carbs_match:
        carbs_val = float(carbs_match.group(1))

    # 4. ไขมันทั้งหมด (Fat) - ป้องกันการดักจับ "พลังงานจากไขมัน" โดยห้ามมีคำว่าพลังงานหรือจากนำหน้า
    fat_match = re.search(r'(?<!จาก)(?<!พลังงาน)(?:ไขมันทั้งหมด|ไขมัน|totalfat)\s*(\d+(?:\.\d+)?)', full_text)
    if fat_match:
        fat_val = float(fat_match.group(1))

    # 5. น้ำตาล (Sugar)
    sugar_match = re.search(r'(?:น้ำตาล|น้าตาล|นำตาล|sugar)\s*(\d+(?:\.\d+)?)', full_text)
    if sugar_match:
        sugar_val = float(sugar_match.group(1))

    # 6. โซเดียม (Sodium)
    sodium_text_fixed = full_text_clean.replace("o", "0").replace("O", "0")
    sodium_match = re.search(r'(?:โซเดียม|เซเดียม|โซเดย|เดียม|sodium)[^\d]*(\d+)', sodium_text_fixed)
    if sodium_match:
        sodium_val = int(sodium_match.group(1))

    # --------------------------------------------------
    # 🚦 ลอจิกคำแนะนำไฟจราจร (เวอร์ชัน Elite - คำนวณจากค่าที่ถูกต้อง)
    # --------------------------------------------------
    check_sugar = sugar_val if isinstance(sugar_val, (int, float)) else 0
    check_sodium = sodium_val if isinstance(sodium_val, (int, float)) else 0

    if check_sugar > 15 or check_sodium > 400:
        color = "red"
        score = 35
        recommendation = "ปริมาณน้ำตาลหรือโซเดียมเกินเกณฑ์มาตรฐาน ควรหลีกเลี่ยงหรือแบ่งทาน เพื่อป้องกันภาวะระดับน้ำตาลในเลือดสูงและโซเดียมสะสม"
    elif check_sugar > 6 or check_sodium > 150:
        color = "yellow"
        score = 65
        recommendation = "คุณค่าทางโภชนาการระดับปานกลาง บริโภคได้แต่ควรจำกัดไม่เกิน 1-2 ส่วนต่อวัน และลดสัดส่วนหวาน-เค็มในมื้อหลัก"
    else:
        color = "green"
        score = 95
        recommendation = "คุณค่าทางโภชนาการผ่านเกณฑ์มาตรฐาน พลังงานและสารอาหารเหมาะสม สามารถบริโภคได้เป็นประจำภายใต้พลังงานรวมที่ร่างกายต้องการ"

    return {
        "color": color, "score": score, "recommendation": recommendation,
        "calories": calories_val, "protein": protein_val, "carbs": carbs_val,
        "fat": fat_val, "sugar": sugar_val, "sodium": sodium_val
    }

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        extracted_results = reader.readtext(image_bytes, detail=0)
        analysis_result = extract_nutrition_values(extracted_results)
        analysis_result["ocr_text"] = " | ".join(extracted_results)
        return analysis_result
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def root():
    return {"message": "NutriScan AI API Running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
