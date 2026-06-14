from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import easyocr
import re

app = FastAPI(title="NutriScan AI Production API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# โหลด OCR
reader = easyocr.Reader(
    ['th', 'en'],
    model_storage_directory='.'
)


def extract_nutrition_values(text_list):

    calories_val = 0
    protein_val = 0.0
    carbs_val = 0.0
    fat_val = 0.0
    sugar_val = 0.0
    sodium_val = 0

    # รวมข้อความทั้งหมดเป็นก้อนเดียว ลบช่องว่างออกเพื่อป้องกันคำแตกบรรทัด
    full_text = " ".join(text_list).lower()
    full_text_clean = full_text.replace(" ", "")
    
    print("\n========== OCR RESULT ==========")
    for t in text_list:
        print(t)
    print("================================\n")

    # --------------------------------------------------
    # 🎯 1. ดักจับ พลังงาน (Calories)
    # --------------------------------------------------
    cal_match = re.search(r'(?:พลังงานทั้งหมด|พลังงาน|energy)\s*(\d+)', full_text)
    if cal_match:
        calories_val = int(cal_match.group(1))
    else:
        # วิธีสำรอง ดึงตัวเลขที่อยู่ใกล้คำว่ากิโลแคลอรี
        cal_backup = re.search(r'(\d+)\s*(?:กิโลแคลอรี|kcal)', full_text)
        if cal_backup:
            calories_val = int(cal_backup.group(1))

    # --------------------------------------------------
    # 🎯 2. เจาะจงหา โปรตีน (Protein) - ดึงเลขหลังคีย์เวิร์ดโดยตรงเพื่อหลบสระอึเพี้ยน
    # --------------------------------------------------
    protein_match = re.search(r'(?:โปรตีน|โปรติน|โปรตึน|โปรติ|เปรตีน|protein)[^\d]*(\d+(?:\.\d+)?)', full_text_clean)
    if protein_match:
        protein_val = float(protein_match.group(1))

    # --------------------------------------------------
    # 🎯 3. เจาะจงหา คาร์โบไฮเดรต (Carbs)
    # --------------------------------------------------
    carbs_match = re.search(r'(?:คาร์โบไฮเดรต|คาร์โบไฮเดรท|คาร์โบ|carbohydrate|carb)[^\d]*(\d+(?:\.\d+)?)', full_text_clean)
    if carbs_match:
        carbs_val = float(carbs_match.group(1))

    # --------------------------------------------------
    # 🎯 4. เจาะจงหา ไขมันทั้งหมด (Fat) - หลบพลังงานจากไขมัน
    # --------------------------------------------------
    # ลบคำว่า พลังงานจากไขมัน ออกไปจากข้อความตรวจไขมันก่อนเพื่อป้องกัน AI สับสน
    text_for_fat = full_text_clean.replace("พลังงานจากไขมัน", "")
    fat_match = re.search(r'(?:ไขมันทั้งหมด|ไขมัน|totalfat)[^\d]*(\d+(?:\.\d+)?)', text_for_fat)
    if fat_match:
        fat_val = float(fat_match.group(1))

    # --------------------------------------------------
    # 🎯 5. เจาะจงหา น้ำตาล (Sugar)
    # --------------------------------------------------
    sugar_match = re.search(r'(?:น้ำตาล|น้าตาล|นำตาล|sugar)[^\d]*(\d+(?:\.\d+)?)', full_text_clean)
    if sugar_match:
        sugar_val = float(sugar_match.group(1))

    # --------------------------------------------------
    # 🎯 6. เจาะจงหา โซเดียม (Sodium) - แก้เคสอ่านเลข 0 เป็น ตัว o หรือ O
    # --------------------------------------------------
    sodium_text_fixed = full_text_clean.replace("o", "0").replace("O", "0")
    sodium_match = re.search(r'(?:โซเดียม|เซเดียม|โซเดย|เดียม|sodium)[^\d]*(\d+)', sodium_text_fixed)
    if sodium_match:
        sodium_val = int(sodium_match.group(1))

    # ==================================
    # 🧠 ลอจิกการให้คำแนะนำสไตล์คุณน้า
    # ==================================
    if sugar_val > 15 or sodium_val > 400:
        color = "red"
        score = 35
        if sugar_val > 15 and sodium_val > 400:
            recommendation = "น้ำตาลและโซเดียมอยู่ในเกณฑ์สูงจัด! เป็นกลุ่มอาหารและเครื่องดื่มที่เสี่ยงกระทบต่อสุขภาพระยะยาว ควรหลีกเลี่ยงหรือแบ่งทานทีละน้อยนะคะ"
        elif sugar_val > 15:
            recommendation = "น้ำตาลอยู่ในเกณฑ์สูง! ควรจำกัดปริมาณการบริโภคเพื่อลดความเสี่ยงโรคเบาหวาน แนะนำให้เลือกรับประทานอาหารหรือเครื่องดื่มสูตรน้ำตาลน้อย (Low Sugar) แทนนะคะ"
        else:
            recommendation = "โซเดียมอยู่ในเกณฑ์สูง! ควรหลีกเลี่ยงหรือทานแต่น้อยเพื่อป้องกันภาวะความดันโลหิตสูง และช่วยลดการทำงานหนักของไตค่ะ"

    elif sugar_val > 6 or sodium_val > 150:
        color = "yellow"
        score = 65
        if sugar_val > 6 and sodium_val > 150:
            recommendation = "สารอาหารอยู่ในระดับปานกลาง ถือเป็นตัวเลือกที่ทานได้ทั่วไปอย่างเหมาะสม แต่อย่าลืมทานอาหารให้ครบ 5 หมู่ในมื้อหลักด้วยนะ"
        elif sugar_val > 6:
            recommendation = "ปริมาณน้ำตาลเริ่มไต่ระดับปานกลาง ทานได้แต่ควรควบคุมปริมาณในมื้ออื่น ๆ ของวันเพิ่มเติม และอย่าลืมออกกำลังกายเพื่อสุขภาพด้วยนะคะ"
        else:
            recommendation = "โซเดียมอยู่ในระดับปานกลาง ทานได้ขำ ๆ แต่แนะนำให้ดื่มน้ำเปล่าตามมาก ๆ ระหว่างวันเพื่อช่วยขับโซเดียมส่วนเกินออกค่ะ"

    else:
        color = "green"
        score = 95
        recommendation = "เยี่ยมยอด! สารอาหารอยู่ในเกณฑ์ต่ำและปลอดภัยมาก เหมาะสำหรับผู้ที่กำลังดูแลสุขภาพหรือควบคุมน้ำหนัก ทานได้อย่างสบายใจเลยค่ะ"

    return {
        "color": color,
        "score": score,
        "recommendation": recommendation,
        "calories": calories_val,
        "protein": protein_val,
        "carbs": carbs_val,
        "fat": fat_val,
        "sugar": sugar_val,
        "sodium": sodium_val
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
