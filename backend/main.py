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

    # 1. พลังงาน (Calories)
    cal_match = re.search(r'(?:พลังงานทั้งหมด|พลังงาน|energy)\s*(\d+)', full_text)
    if cal_match:
        calories_val = int(cal_match.group(1))
    else:
        cal_backup = re.search(r'(\d+)\s*(?:กิโลแคลอรี|kcal|กิโลแคล)', full_text)
        if cal_backup:
            calories_val = int(cal_backup.group(1))

    # 2. โปรตีน (Protein) - ดักอักษรเพี้ยน ด เด็ก / ต เต่า ครบถ้วนตามที่คุณน้าจับสังเกตได้
    protein_match = re.search(r'(?:โปรตีน|โปรติน|โปรตึน|โปรติ|เปรตีน|โปรดึน|โปรดีน|protein)[^\d]*(\d+(?:\.\d+)?)', full_text_clean)
    if protein_match:
        protein_val = float(protein_match.group(1))
    else:
        protein_backup = re.search(r'(\d+(?:\.\d+)?)\s*(?:ก\.|กรัม|g)\b', full_text)
        if protein_backup:
            protein_val = float(protein_backup.group(1))

    # 3. คาร์โบไฮเดรต (Carbs)
    carbs_match = re.search(r'(?:คาร์โบไฮเดรต|คาร์โบไฮเดรท|คาร์โบ|carbohydrate|carb)[^\d]*(\d+(?:\.\d+)?)', full_text_clean)
    if carbs_match:
        carbs_val = float(carbs_match.group(1))

    # 4. ไขมันทั้งหมด (Fat)
    text_for_fat = full_text_clean.replace("พลังงานจากไขมัน", "")
    fat_match = re.search(r'(?:ไขมันทั้งหมด|ไขมัน|totalfat)[^\d]*(\d+(?:\.\d+)?)', text_for_fat)
    if fat_match:
        fat_val = float(fat_match.group(1))

    # 5. น้ำตาล (Sugar)
    sugar_match = re.search(r'(?:น้ำตาล|น้าตาล|นำตาล|sugar)[^\d]*(\d+(?:\.\d+)?)', full_text_clean)
    if sugar_match:
        sugar_val = float(sugar_match.group(1))

    # 6. โซเดียม (Sodium)
    sodium_text_fixed = full_text_clean.replace("o", "0").replace("O", "0")
    sodium_match = re.search(r'(?:โซเดียม|เซเดียม|โซเดย|เดียม|sodium)[^\d]*(\d+)', sodium_text_fixed)
    if sodium_match:
        sodium_val = int(sodium_match.group(1))

    # คำนวณไฟจราจรชั่วคราว (แปลงค่าเฉพาะตอนเช็คเกณฑ์ ไม่ให้ระบบค้างจากข้อความภาษาไทย)
    check_sugar = sugar_val if isinstance(sugar_val, (int, float)) else 0
    check_sodium = sodium_val if isinstance(sodium_val, (int, float)) else 0

    if check_sugar > 15 or check_sodium > 400:
        color = "red"
        score = 35
        recommendation = "น้ำตาลหรือโซเดียมสูงเกินเกณฑ์ ควรระวังนะคะ"
    elif check_sugar > 6 or check_sodium > 150:
        color = "yellow"
        score = 65
        recommendation = "สารอาหารปานกลาง ทานได้เหมาะสมค่ะ"
    else:
        color = "green"
        score = 95
        recommendation = "เยี่ยมมาก! สารอาหารปลอดภัย ดีต่อสุขภาพค่ะ"

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
