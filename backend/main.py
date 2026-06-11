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

    full_text = " ".join(text_list).lower()

    print("\n========== OCR RESULT ==========")
    for t in text_list:
        print(t)
    print("================================\n")

    def get_number(text):
        match = re.search(r'(\d+(?:\.\d+)?)', text)
        if match:
            return float(match.group(1))
        return None

    for text in text_list:

        text_clean = text.lower().replace(" ", "")

        # -------------------------
        # Calories
        # -------------------------
        if any(keyword in text_clean for keyword in [
            "พลังงาน",
            "energy",
            "กิโลแคลอรี",
            "kilocalories",
            "kcal"
        ]):
            value = get_number(text)
            if value is not None and value < 3000:
                calories_val = int(value)

        # -------------------------
        # Protein
        # -------------------------
        if any(keyword in text_clean for keyword in [
            "โปรตีน",
            "โปรติน",
            "protein"
        ]):
            value = get_number(text)
            if value is not None:
                protein_val = value

        # -------------------------
        # Carbs
        # -------------------------
        if any(keyword in text_clean for keyword in [
            "คาร์โบไฮเดรต",
            "คาร์โบไฮเดรท",
            "carbohydrate",
            "carb"
        ]):
            value = get_number(text)
            if value is not None:
                carbs_val = value

        # -------------------------
        # Fat
        # -------------------------
        if any(keyword in text_clean for keyword in [
            "ไขมันทั้งหมด",
            "ไขมัน",
            "fat",
            "totalfat"
        ]):
            value = get_number(text)
            if value is not None:
                fat_val = value

        # -------------------------
        # Sugar
        # -------------------------
        if any(keyword in text_clean for keyword in [
            "น้ำตาล",
            "น้าตาล",
            "นำตาล",
            "sugar"
        ]):
            value = get_number(text)
            if value is not None and value <= 100:
                sugar_val = value

        # -------------------------
        # Sodium
        # -------------------------
        if any(keyword in text_clean for keyword in [
            "โซเดียม",
            "เซเดียม",
            "โซเดย",
            "เดียม",
            "sodium",
            "sod"
        ]):
            value = get_number(text)
            if value is not None:
                sodium_val = int(value)

    # ==================================
    # Fallback Logic
    # ==================================

    if calories_val == 0:
        match = re.search(r'พลังงาน\s*(\d+)', full_text)
        if match:
            calories_val = int(match.group(1))

    # ==================================
    # Nutrition Score
    # ==================================

    if sugar_val > 15 or sodium_val > 400:
        color = "red"
        score = 35
        recommendation = (
            f"น้ำตาล {sugar_val}g และโซเดียม {sodium_val}mg "
            f"อยู่ในเกณฑ์สูง ควรจำกัดปริมาณการบริโภค"
        )

    elif sugar_val > 6 or sodium_val > 150:
        color = "yellow"
        score = 65
        recommendation = (
            f"น้ำตาล {sugar_val}g และโซเดียม {sodium_val}mg "
            f"อยู่ในระดับปานกลาง ควรบริโภคอย่างเหมาะสม"
        )

    else:
        color = "green"
        score = 95
        recommendation = (
            f"น้ำตาล {sugar_val}g และโซเดียม {sodium_val}mg "
            f"อยู่ในเกณฑ์ต่ำ เหมาะสำหรับการบริโภค"
        )

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

        extracted_results = reader.readtext(
            image_bytes,
            detail=0
        )

        analysis_result = extract_nutrition_values(
            extracted_results
        )

        analysis_result["ocr_text"] = " | ".join(
            extracted_results
        )

        return analysis_result

    except Exception as e:
        return {
            "error": str(e)
        }


@app.get("/")
def root():
    return {
        "message": "NutriScan AI API Running"
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8080
    )
