import os
import re
import easyocr
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

app = FastAPI(title="NutriScan AI Ultimate Coverage API")

# 🔓 CORS ปลดล็อกให้ทุกอุปกรณ์เข้าถึงได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 โหลดขุมพลังสมองกล OCR
reader = easyocr.Reader(['th', 'en'], model_storage_directory='.')

# 🔬 ฟังก์ชันแกะรอยระดับ Elite (ดักจับคำเพี้ยนและล้างขยะของคุณน้า)
def extract_nutrition_values(text_list):
    calories_val = "ไม่พบข้อมูล"
    protein_val = "ไม่พบข้อมูล"
    carbs_val = "ไม่พบข้อมูล"
    fat_val = "ไม่พบข้อมูล"
    sugar_val = "ไม่พบข้อมูล"
    sodium_val = "ไม่พบข้อมูล"

    full_text = " ".join(text_list).lower()
    full_text_clean = full_text.replace("(", "").replace(")", "").replace("[", "").replace("]", "")
    full_text_no_space = full_text_clean.replace(" ", "")

    # 1. พลังงาน (Calories)
    cal_match = re.search(r'(?:พลังงานทั้งหมด|energy|พลังงาน)\s*(\d+)', full_text_clean)
    if cal_match:
        calories_val = int(cal_match.group(1))
    else:
        cal_backup = re.search(r'(\d+)\s*(?:กิโลแคลอรี|kcal|กิโลแคล)', full_text_clean)
        if cal_backup:
            calories_val = int(cal_backup.group(1))

    # 2. โปรตีน (Protein)
    protein_match = re.search(r'(?:โปรตีน|โปรติน|โปรตึน|โปรติ|เปรตีน|โปรดึน|โปรดีน|protein)[^\d]{0,15}(\d+(?:\.\d+)?)', full_text_clean)
    if protein_match:
        protein_val = float(protein_match.group(1))

    # 3. คาร์โบไฮเดรต (Carbs)
    carbs_match = re.search(r'(?:คาร์โบไฮเดรตทั้งหมด|คาร์โบไฮเดรต|คาร์โบไฮเดรท|คาร์โบ|carbohydrate|carb)[^\d]{0,15}(\d+(?:\.\d+)?)', full_text_clean)
    if carbs_match:
        carbs_val = float(carbs_match.group(1))

    # 4. ไขมันทั้งหมด (Fat)
    text_for_fat = re.sub(r'พลังงานจากไขมัน\s*\d+\s*(?:กิโลแคลอรี|kcal|กิโลแคล)?', '', full_text_clean)
    text_for_fat_no_space = re.sub(r'พลังงานจากไขมัน\d+(?:กิโลแคลอรี|kcal|กิโลแคล)?', '', full_text_no_space)
    
    fat_match = re.search(r'(?:ไขมันทั้งหมด|ไขมัน|totalfat)[^\d]{0,15}(\d+(?:\.\d+)?)', text_for_fat)
    if fat_match:
        fat_val = float(fat_match.group(1))
    else:
        fat_backup = re.search(r'(?:ไขมันทั้งหมด|ไขมัน|totalfat)[^\d]{0,15}(\d+(?:\.\d+)?)', text_for_fat_no_space)
        if fat_backup:
            fat_val = float(fat_backup.group(1))

    # 5. น้ำตาล (Sugar)
    sugar_match = re.search(r'(?:น้ำตาล|น้าตาล|นำตาล|sugar)[^\d]{0,15}(\d+(?:\.\d+)?)', full_text_clean)
    if sugar_match:
        sugar_val = float(sugar_match.group(1))
    else:
        sugar_backup = re.search(r'(?:น้ำตาล|น้าตาล|นำตาล|sugar)[^\d]{0,15}(\d+(?:\.\d+)?)', full_text_no_space)
        if sugar_backup:
            sugar_val = float(sugar_backup.group(1))

    # 6. โซเดียม (Sodium)
    sodium_text_fixed = full_text_no_space.replace("o", "0").replace("O", "0")
    sodium_match = re.search(r'(?:โซเดียม|เซเดียม|โซเดย|เดียม|sodium)[^\d]*(\d+)', sodium_text_fixed)
    if sodium_match:
        sodium_val = int(sodium_match.group(1))

    # 🚦 ลอจิกไฟจราจร
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

# ========================================================
# 🟢 ประตูบานสำคัญรับรูปภาพจากหน้าแอป Flutter (ห้ามหายเด็ดขาด!)
# ========================================================
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

# ========================================================
# 📦 ระบบจ่ายไฟล์หน้าเว็บ Flutter Web (เสิร์ฟจากโฟลเดอร์เดียวกัน)
# ========================================================

# ลำดับที่ 1: หน้าแรกสุดส่งไฟล์ index.html ออกไปรัน
@app.get("/")
async def serve_index():
    if os.path.exists("index.html"):
        return FileResponse("index.html")
    return {"message": "กำลังเตรียมระบบหน้าเว็บ กรุณารอสักครู่แล้วรีเฟรชครับ"}

# ลำดับที่ 2: ดักจับไฟล์ย่อยและ Assets ทุกตัวของ Flutter Web
@app.get("/{file_name:path}")
async def serve_root_files(file_name: str):
    # ป้องกันไม่ให้ชนกับระบบอัปโหลดรูปภาพ และหน้าเปิดคู่มือ API
    if file_name.startswith("upload") or file_name in ["docs", "redoc", "openapi.json"]:
        # ปล่อยให้ระบบของ FastAPI ไปจัดการตามปกติ ไม่ต้องดักแทรกแซง
        raise HTTPException(status_code=405, detail="Method Not Allowed")
        
    # ค้นหาไฟล์ที่โฟลเดอร์หน้าบ้านตรง ๆ
    if os.path.exists(file_name) and os.path.isfile(file_name):
        # บังคับประเภทไฟล์สำหรับ JavaScript ป้องกันปัญหา Unexpected token '<'
        if file_name.endswith(".js"):
            return FileResponse(file_name, media_type="application/javascript")
        return FileResponse(file_name)
        
    # เผื่อกรณี Routing ภายในหน้าเว็บแอป ให้โยนกลับไปตั้งหลักที่ index.html
    if os.path.exists("index.html"):
        return FileResponse("index.html")
    raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
