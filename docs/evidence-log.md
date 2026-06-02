📌 Sprint 3 Evidence — NutriScan AI (CP5 Submission)
🗓️ Day 1 — Project Setup & Planning (26 May 2026)
ผู้รับผิดชอบ	บทบาท	สิ่งที่ทำ	หลักฐาน
Kittiyanee Chaihanit	Project Manager / Scrum Lead	วางแผน Sprint 3, กำหนด Sprint Goal, จัด Sprint Board และแบ่งงานตาม Role	Sprint Planning, Sprint Board
Pharadon Khanthong	Frontend Developer	จัดเตรียมโครงสร้าง Frontend และวางแผนหน้า Upload และ Result Dashboard	GitHub Commit
Wichayada Thinkaew	Backend Support & UX/UI Designer	ออกแบบ User Flow, Wireframe และ UI Prototype ของระบบ NutriScan AI	Figma Design
Anna Worrasing	Backend Developer	เตรียม Backend Environment (FastAPI) และทดลอง OCR สำหรับอ่านฉลากโภชนาการ	GitHub Commit, OCR Test Screenshot
Day 1 Output
กำหนด Sprint Goal และ Sprint Scope อย่างชัดเจน
แบ่งบทบาททีม (Roles) ครบถ้วน
ออกแบบ User Flow และ UI Prototype เสร็จสมบูรณ์
เริ่มพัฒนา Backend และ OCR Module
สร้างโครงสร้างโปรเจกต์บน GitHub
🗓️ Day 2 — First Working Component (27 May 2026)
ผู้รับผิดชอบ	บทบาท	สิ่งที่ทำ	หลักฐาน
Kittiyanee Chaihanit	Project Manager / Scrum Lead	ติดตามความคืบหน้าและอัปเดต Sprint Board	Sprint Board Screenshot
Pharadon Khanthong	Frontend Developer	พัฒนา Upload Image Page และ Result Dashboard เบื้องต้น	UI Screenshot
Wichayada Thinkaew	Backend Support & UX/UI Designer	ปรับปรุง UI Design และสนับสนุนการเชื่อมต่อ Frontend–Backend	Figma Update
Anna Worrasing	Backend Developer	พัฒนา API สำหรับรับภาพและเชื่อม OCR เพื่อดึงข้อมูลจากฉลากโภชนาการ	API Response, OCR Output Screenshot
Day 2 Output
มี First Working Component สำหรับทดสอบระบบ
Frontend สามารถอัปโหลดภาพได้
Backend สามารถรับและประมวลผลภาพได้
OCR เริ่มดึงข้อความจากฉลากโภชนาการได้
เริ่มการเชื่อมต่อ Frontend และ Backend
🗓️ Day 3 — Integration & Risk Control (28 May 2026)
ผู้รับผิดชอบ	บทบาท	สิ่งที่ทำ	หลักฐาน
Kittiyanee Chaihanit	Project Manager / Scrum Lead	ติดตาม Integration Progress และบริหารความเสี่ยงของระบบ	Sprint Documentation
Pharadon Khanthong	Frontend Developer	ปรับปรุง Dashboard และเชื่อมต่อข้อมูลจาก Backend	UI Screenshot
Wichayada Thinkaew	Backend Support & UX/UI Designer	ปรับปรุง UX/UI และตรวจสอบความถูกต้องของ User Flow	Figma Prototype
Anna Worrasing	Backend Developer	เชื่อม OCR, Firebase และ Backend Logic เข้ากับ Core System	API Test Result, Firebase Integration Screenshot
Day 3 Output
ระบบ Frontend และ Backend เชื่อมต่อกันสมบูรณ์
ระบบสามารถรับภาพและแสดงผลข้อมูลโภชนาการได้
ใช้ Firebase สำหรับการจัดเก็บข้อมูล
Core Flow ทำงานแบบ End-to-End
ระบบพร้อมสำหรับการ Demo Prototype
🗓️ Day 4 — Demo Evidence & CP5 Submission (30 May 2026)
ผู้รับผิดชอบ	บทบาท	สิ่งที่ทำ	หลักฐาน
Kittiyanee Chaihanit	Project Manager / Scrum Lead	สรุป Sprint Review, Retrospective และจัดทำ CP5 Submission Package	Sprint Review Document
Pharadon Khanthong	Frontend Developer	ตรวจสอบ Upload Flow และ Result Dashboard สำหรับ Demo	UI Screenshot, Demo Video
Wichayada Thinkaew	Backend Support & UX/UI Designer	ตรวจสอบ UI Consistency และจัดทำ Demo Script	demo-script.md
Anna Worrasing	Backend Developer	ทดสอบ OCR, Backend API และ Firebase Integration พร้อมสรุป Known Issues	API Test Result, Integration Screenshot
Day 4 Output
Prototype v1 พร้อม Demo ที่ใช้งานได้จริง
Core Flow (Upload → OCR → Nutrition Analysis → Result Display) สมบูรณ์
จัดทำ Sprint Documentation และ Evidence ครบถ้วน
สรุป Known Issues และ Sprint 4 Test Plan
จัดทำ CP5 Submission Package สำหรับการประเมิน
📉 Scope Adjustment During Sprint 3

เพื่อให้สามารถส่งมอบ Prototype v1 ที่มีความเสถียรภายในระยะเวลา Sprint 3 ทีมได้ปรับลดขอบเขตงานบางส่วน เพื่อมุ่งเน้นการพัฒนา Core System หลักให้เสร็จสมบูรณ์

Original Scope
Mobile Application
OCR-based Nutrition Label Scanning
AI Nutrition Analysis
Firebase Integration
Traffic Light Nutrition Indicator
Adjusted Scope
Web-based Prototype (แทน Mobile Application)
OCR Integration
Backend API Development
Firebase Integration
Nutrition Analysis Workflow
Result Dashboard (Traffic Light Indicator)
Reason for Scope Adjustment

การปรับลด scope มีวัตถุประสงค์เพื่อให้ทีมสามารถส่งมอบ Core Flow ที่เสถียรและครบถ้วนภายใน Sprint 3 รวมถึงรองรับการทดสอบใน Sprint ถัดไป

Impact
Prototype v1 ใช้งานผ่าน Web Browser เท่านั้น
Mobile Application จะถูกพิจารณาใน Sprint ถัดไป
ทีมสามารถส่งมอบ End-to-End Core Flow ได้สำเร็จ
🔗 Evidence Links
GitHub Repository: https://github.com/AnnaWorasing586/TEAM-11-Sprint3
Demo Video: To be submitted in CP5 final package
Core Flow Documentation: docs/core-flow.md
Demo Script: docs/demo-script.md
Build Log: docs/build-log.md
Known Issues: docs/known-issues.md
Sprint 4 Test Plan: docs/test-plan-sprint4.md
📸 Evidence Types
GitHub Commit
UI Screenshot
API Response Test
OCR Output Screenshot
Firebase Integration Evidence
Figma Design
Sprint Board
Demo Video
Integration Test
Project Documentation
