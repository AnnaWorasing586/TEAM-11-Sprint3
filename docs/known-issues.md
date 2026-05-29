# Known Issues & Limitations

## Prototype Limitations

### 1. Web Browser Only
ปัจจุบัน Prototype v1 รองรับการใช้งานผ่าน Web Browser เท่านั้น
ยังไม่มี Mobile Application Version

### 2. OCR Accuracy
ระบบ OCR อาจอ่านข้อมูลผิดพลาดในกรณีที่

- ภาพไม่ชัด
- แสงน้อย
- มีแสงสะท้อนบนฉลาก
- ตัวอักษรมีขนาดเล็กเกินไป

### 3. AI Recommendation
AI Recommendation บางส่วนยังใช้ Mock Data และ Rule-based Logic
เพื่อใช้ในการทดสอบ Prototype

### 4. Limited Dataset
ระบบยังไม่ได้ทดสอบกับฉลากอาหารหลากหลายประเภท
จึงอาจมีข้อจำกัดด้านความแม่นยำ

### 5. User Testing Not Completed
Prototype v1 ยังไม่ได้ผ่านการทดสอบกับผู้ใช้จริง
ซึ่งจะดำเนินการใน Sprint 4

## Workarounds

- ผู้ใช้สามารถตรวจสอบผล OCR ก่อนยืนยัน
- สามารถแก้ไขข้อมูลสารอาหารด้วยตนเองหาก OCR อ่านผิด
- ใช้ภาพฉลากที่ชัดเจนเพื่อเพิ่มความแม่นยำในการวิเคราะห์
