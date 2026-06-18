# 🎤 Demo Script — NutriScan AI Web Prototype

Script สำหรับสาธิตให้อาจารย์ (~5-7 นาที)

---

## 🎯 ก่อนเริ่ม Demo (เตรียม 5 นาที)

### อุปกรณ์ที่ต้องเตรียม
- 💻 **Notebook** เปิดเบราว์เซอร์ (Chrome/Edge/Safari)
- 📱 **มือถือจริง** ที่ติดตั้ง PWA แล้ว (iPhone/Android)
- 📦 **ฉลากอาหาร 2-3 ชิ้น** (นมกล่อง, ขนม Lay's, ขวดน้ำผลไม้) สำหรับสแกนสด
- 🍱 รูปอาหาร 1-2 รูปในแกลเลอรีมือถือ (สำรอง)
- 🌐 **เน็ตเสถียร** (4G/Wi-Fi)

### Warm-up backend (สำคัญ!)
- เปิด https://nutriscan-api-lpmx.onrender.com ใน tab พื้นหลัง
- ทำ 1 scan ก่อน demo เพื่อให้ server ตื่นจาก cold start
- ถ้า cold start = สแกนครั้งแรกจะใช้เวลา ~30 วินาที

---

## 📝 Demo Flow (5-7 นาที)

### 1️⃣ **Intro — เปิดตัว** (30 วินาที)

> "สวัสดีค่ะ/ครับ ทีม 11 จะนำเสนอ Web Prototype ของ **NutriScan AI** —
> แอปสแกนฉลากโภชนาการที่ใช้ AI วิเคราะห์ + ให้คำแนะนำสุขภาพเฉพาะตัว"

**แสดง:** URL: https://nutriscan-prototype.onrender.com

---

### 2️⃣ **Sign up / Login** (1 นาที)

> "ก่อนใช้งาน เรามีระบบ **Cloud Sync** ผ่าน Supabase — เปลี่ยนเครื่องก็ได้ข้อมูลเดิม"

**ทำ:**
1. กด avatar "ต" มุมขวาบน → modal login เด้งขึ้น
2. tab "สมัครสมาชิก" → กรอก `demo@example.com` / `123456` → กด สมัคร
3. modal สลับเป็น tab "เข้าสู่ระบบ" อัตโนมัติ
4. พิมพ์รหัส → กด เข้าสู่ระบบ
5. ✅ Toast "เข้าสู่ระบบสำเร็จ" + modal ปิด

**Talking point:**
> "ใช้ Supabase Auth + Row Level Security — user คนหนึ่งเห็นข้อมูลของตัวเองเท่านั้น"

---

### 3️⃣ **Settings — กรอกข้อมูลส่วนตัว** (1 นาที)

**ทำ:**
1. กดฟันเฟือง ⚙️ → Settings
2. กรอก:
   - ชื่อ: ตัวเอง
   - น้ำหนัก: 60 กก., ส่วนสูง: 165 ซม. (หรือจริง)
   - เป้าหมาย: "ลดน้ำหนัก"
   - เป้าหมายแคลอรี: 1500 (พิมพ์เป๊ะ ๆ ได้ ไม่บังคับเป็นทวีคูณ 50)
3. กดบันทึก → Toast "บันทึกแล้ว"

**Talking point:**
> "ระบบคำนวณ BMI อัตโนมัติ + เตือนถ้า underweight/overweight + แนะนำพบแพทย์"

---

### 4️⃣ **Scan ฉลากจริง** (1.5 นาที) — **HIGHLIGHT**

**ทำ:**
1. กดปุ่ม "สแกน" (วงกลมเขียวกลาง)
2. เลือกโหมด **"ฉลากโภชนาการ"**
3. ส่องฉลากนมจริงให้เห็น Nutrition Facts
4. กดปุ่มถ่าย → AI วิเคราะห์ ~5-10 วินาที
5. หน้า Result โผล่ขึ้น:
   - ชื่อผลิตภัณฑ์ + รูปที่ถ่าย
   - แคลอรี + AI confidence %
   - **🚦 Traffic light:** สีเขียว/เหลือง/แดง พร้อมคำอธิบาย
   - สารอาหาร 5 ตัวเทียบ % ต่อวัน

**Talking point:**
> "AI อ่านค่าจากตารางในฉลากจริง — ค่าที่ได้ต้องตรงกับฉลากเป๊ะ"
> "สี traffic light อิงเกณฑ์ **UK FSA + WHO** เป็นมาตรฐานสากล"

---

### 5️⃣ **AI วิเคราะห์เฉพาะคุณ** (1 นาที) — **🌟 WOW MOMENT**

**ทำ:**
1. ใน Result page → กดปุ่ม **"✨ ขอ AI วิเคราะห์เฉพาะคุณ"**
2. รอ ~5-10 วินาที
3. AI ตอบเป็นข้อความส่วนตัว เช่น:
   > "ไม่ควรกินอาหารนี้ เพราะมีโซเดียมสูง + คุณมีเป้าลดน้ำหนัก
   > • เกินงบแคลอรี่วันนี้ที่เหลือ 520 kcal
   > • BMI 17.9 ผอม — ควรปรึกษาแพทย์ก่อนตั้งเป้าลดน้ำหนัก
   > 💡 แนะนำ: ข้าวกล้องอกไก่ผัดพริกสด (~400 kcal)"

**Talking point:**
> "เป็น **Hybrid System** — กฎ (Rule-based) ตัดสินสีตามมาตรฐาน UK FSA
>  + AI (Gemini) อธิบายเหตุผลส่วนตัวจาก BMI + เป้าหมาย + มื้อที่กินไปแล้ว
>  เหมือนหมอใช้ guidelines + clinical judgment"

---

### 6️⃣ **บันทึก + Dashboard** (1 นาที)

**ทำ:**
1. กด **"บันทึกลงไดอารี่"**
2. กลับ Home — วงแหวนแคลอรี + macros อัปเดต
3. กราฟ 7 วันแสดงวันนี้
4. มื้ออาหารใหม่โผล่ขึ้น
5. **กด +250 ml น้ำดื่ม** → progress bar ขยับ

**Talking point:**
> "ข้อมูลทั้งหมด sync ไป cloud อัตโนมัติ — เปลี่ยนเครื่องก็ได้ข้อมูลเดิม"
> "เก็บ streak + badges → gamification ให้ใช้งานต่อเนื่อง"

---

### 7️⃣ **Report + AI Weekly Summary** (45 วินาที)

**ทำ:**
1. กดเมนู "รายงาน"
2. ดูกราฟ 7 วัน + adherence %
3. กด **"✨ ขอ AI สรุป"**
4. AI สรุปสัปดาห์ + tips + warnings

**Talking point:**
> "AI ดูประวัติ 7 วัน → ให้คำแนะนำเชิง pattern"

---

### 8️⃣ **PWA + Mobile Demo** (45 วินาที)

**สลับมาที่มือถือ:**
1. แสดงไอคอน NutriScan บน Home Screen iPhone
2. กดเปิด → full-screen native-like
3. โชว์ว่าใช้งานได้ทุกฟีเจอร์เหมือนเดสก์ท็อป
4. **(Optional)** Toggle Dark mode → ทั้งแอปเปลี่ยนเป็นโหมดมืด

**Talking point:**
> "PWA = ติดตั้งบนมือถือเป็นแอปได้ ไม่ต้องลง Play Store / App Store
>  + Responsive รองรับทุกอุปกรณ์ + safe-area iOS"

---

### 9️⃣ **Closing** (30 วินาที)

> "Web Prototype นี้ทำให้เห็นภาพจริงของ NutriScan AI:
> - 🤖 AI วิเคราะห์ฉลาก/อาหาร/บาร์โค้ดได้จริง
> - 🚦 Traffic light + AI hybrid system
> - ☁️ Cloud sync ข้ามอุปกรณ์
> - 📱 ติดตั้งเป็นแอปได้ทั้ง iPhone/Android
>
> ขั้นต่อไป — port เป็น Flutter native app ตาม base ที่ทีม `frontend/` วางไว้
> เพื่อ publish ขึ้น App Store / Play Store"

---

## 🎯 Talking Points สำคัญ — ใช้ดึงคะแนน

| Talking Point | คะแนนที่ดึงได้ |
|---|---|
| "ใช้ Gemini 2.5 Flash Vision API — เรียก backend ที่ deploy บน Render" | Backend Integration |
| "Supabase + RLS — multi-tenant ปลอดภัย" | Database Design |
| "Hybrid System: Rule-based + AI" | System Architecture |
| "UK FSA + WHO เกณฑ์ทางการ + AI personalized" | Medical/Health Knowledge |
| "PWA installable + Service Worker offline" | Modern Web Tech |
| "Responsive design + safe-area iOS" | UX/UI |
| "feedback จาก 5 testers + ปรับตามคำแนะนำ" | UX Research |

---

## ⚠️ ถ้าเจอปัญหาตอน Demo

### Gemini quota หมด (429)
- บอก: "AI vision ติด quota วันนี้ — สาธิตด้วย mock data จะให้ผลใกล้เคียงกัน"
- ระบบจะ fallback เป็น mock food (ดูเป็นปกติ ไม่พัง)

### Cold start backend (รอนาน)
- บอกไว้ก่อนใน intro: "ระบบรันบน Render Free tier — sleep หลัง 15 นาที idle ครั้งแรกหลังพักจะใช้เวลา ~30 วินาที"
- เตรียม warm-up ก่อน 5 นาที

### Network ขัดข้อง
- มี mock fallback ทุกจุด — สแกนจะคืน random food แทน

### iPad/มือถือ มี issue
- มี desktop version พร้อมใช้งาน (preview mode)

---

## 📚 อ้างอิงเพิ่มเติม

- [Live demo](https://nutriscan-prototype.onrender.com)
- [Backend API status](https://nutriscan-api-lpmx.onrender.com)
- [GitHub branch](https://github.com/AnnaWorasing586/TEAM-11-Sprint3/tree/feature/web-prototype-scan-result)
- [Backend README + API docs](../backend/prototype/README.md)
- [Frontend README + state model](../frontend/prototype/README.md)
- [UX/UI design tokens](../ux-ui/prototype/README.md)

---

## 🎓 Q&A เตรียมรับคำถามอาจารย์

**Q: AI ใช้ของใคร?**
> A: Google Gemini 2.5 Flash Vision API — เลือกเพราะมี free tier + รองรับภาษาไทยดี + เร็ว

**Q: ถ้า AI quota หมด ทำยังไง?**
> A: ระบบมี fallback เป็น mock data + รองรับ Anthropic Claude สลับได้ผ่าน env var

**Q: ข้อมูลผู้ใช้เก็บที่ไหน? ปลอดภัยไหม?**
> A: Supabase PostgreSQL ที่ Singapore region + Row-Level Security → user คนหนึ่งเห็นข้อมูลของตัวเองเท่านั้น

**Q: ทำไมเป็น Web ไม่เป็น Native?**
> A: ทีม `frontend/` มี Flutter base อยู่แล้ว — Web Prototype นี้คือ visual + flow reference สำหรับ port เป็น native ใน Sprint ต่อไป

**Q: Demo ใช้กล้องไม่ขึ้น?**
> A: Web ต้องเปิดผ่าน Safari/Chrome จริง (ไม่ใช่ Instagram in-app) + HTTPS — เราใช้ Render HTTPS แล้ว

**Q: คุณภาพการอ่านฉลาก?**
> A: Gemini 2.5 Flash ~95% accuracy บนฉลากชัด ๆ. Confidence จะลดเมื่อเบลอ/แสงน้อย — มี "แก้ไขค่า" ให้ user override

**Q: รองรับอาหารต่างประเทศไหม?**
> A: รองรับทุกภาษา — Gemini ตอบเป็นภาษาไทยถ้าเป็นอาหารไทย, ตอบ name ตามฉลากถ้าเป็นต่างประเทศ
