# 📌 Sprint 3 Evidence — NutriScan AI

---

# 🗓️ Day 1 — Project Setup & Planning (26 May 2026)

| ผู้รับผิดชอบ                                          | สิ่งที่ทำ                                                                             | หลักฐาน                            |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------- |
| Kittiyanee Chaihanit (Project Manager / Scrum Lead)   | วางแผน Sprint 3, กำหนด Sprint Goal, จัด Sprint Board และแบ่งงานตาม Role               | Sprint Planning, Sprint Board      |
| Pharadon Khanthong (Frontend Developer)               | จัดเตรียมโครงสร้าง Frontend Project และวางแผนการพัฒนาหน้า Upload และ Result Dashboard | GitHub Commit                      |
| Wichayada Thinkaew (Backend Support / UX/UI Designer) | ออกแบบ User Flow, Wireframe และ UI Prototype ของ NutriScan AI                         | Figma Design                       |
| Anna Worrasing (Backend Developer)                    | จัดเตรียม Backend Environment, FastAPI และทดลอง OCR สำหรับอ่านข้อมูลจากฉลากโภชนาการ   | GitHub Commit, OCR Test Screenshot |

### Day 1 Output

* กำหนด Sprint Goal และ Scope ของ Sprint 3
* แบ่งหน้าที่สมาชิกตาม Role
* ออกแบบ User Flow และ UI Prototype
* เริ่มต้นพัฒนา Backend และ OCR Module
* สร้างโครงสร้างโปรเจกต์บน GitHub

---

# 🗓️ Day 2 — First Working Component (27 May 2026)

| ผู้รับผิดชอบ         | สิ่งที่ทำ                                                            | หลักฐาน                             |
| -------------------- | -------------------------------------------------------------------- | ----------------------------------- |
| Kittiyanee Chaihanit | ติดตามความคืบหน้า Sprint และอัปเดต Sprint Board                      | Sprint Board Screenshot             |
| Pharadon Khanthong   | พัฒนาหน้า Upload Image และหน้าแสดงผลเบื้องต้น                        | UI Screenshot                       |
| Wichayada Thinkaew   | ปรับปรุง UI Design และสนับสนุนการเชื่อมต่อ Frontend กับ Backend      | Figma Update                        |
| Anna Worrasing       | พัฒนา API สำหรับรับรูปภาพและเชื่อม OCR เพื่อดึงข้อมูลจากฉลากโภชนาการ | API Response, OCR Output Screenshot |

### Day 2 Output

* มี First Working Component สำหรับทดสอบ
* Frontend สามารถอัปโหลดรูปภาพได้
* Backend สามารถรับข้อมูลภาพได้
* OCR เริ่มดึงข้อความจากฉลากโภชนาการได้
* Frontend และ Backend เริ่มเชื่อมต่อกันได้

---

# 🗓️ Day 3 — Integration & Risk Control (28–29 May 2026)

| ผู้รับผิดชอบ         | สิ่งที่ทำ                                                            | หลักฐาน                                          |
| -------------------- | -------------------------------------------------------------------- | ------------------------------------------------ |
| Kittiyanee Chaihanit | ติดตาม Integration Progress และจัดการความเสี่ยงของ Sprint            | Sprint Documentation                             |
| Pharadon Khanthong   | ปรับปรุง Dashboard และเชื่อมต่อข้อมูลจาก Backend เข้าสู่ Frontend    | UI Screenshot                                    |
| Wichayada Thinkaew   | ปรับปรุง UX/UI และตรวจสอบความถูกต้องของ User Flow                    | Figma Prototype                                  |
| Anna Worrasing       | เชื่อม OCR, Firebase และ Backend Logic เข้ากับ Core Flow หลักของระบบ | API Test Result, Firebase Integration Screenshot |

### Day 3 Output

* Frontend และ Backend เชื่อมต่อกันได้
* ระบบสามารถรับรูปภาพและแสดงผลข้อมูลโภชนาการได้
* Firebase ถูกนำมาใช้ในการจัดเก็บข้อมูล
* Core Flow เริ่มทำงานได้แบบ End-to-End
* เตรียมระบบสำหรับการ Demo Prototype

---

# 🗓️ Day 4 — Demo Evidence & CP5 Submission (30 May 2026)

| ผู้รับผิดชอบ         | สิ่งที่ทำ                                                              | หลักฐาน                                 |
| -------------------- | ---------------------------------------------------------------------- | --------------------------------------- |
| Kittiyanee Chaihanit | สรุป Sprint Review, Retrospective และจัดเตรียม CP5 Submission Package  | Sprint Review Document                  |
| Pharadon Khanthong   | ตรวจสอบ Upload Flow และ Result Dashboard สำหรับการ Demo                | UI Screenshot, Demo Video               |
| Wichayada Thinkaew   | ตรวจสอบ User Flow, UI Consistency และจัดทำ Demo Script                 | demo-script.md                          |
| Anna Worrasing       | ทดสอบ OCR, Backend API และ Firebase Integration พร้อมสรุป Known Issues | API Test Result, Integration Screenshot |

### Day 4 Output

* Prototype v1 สามารถ Demo Core Flow ได้
* Upload Image → OCR → Nutrition Analysis → Result Display ทำงานได้
* จัดทำ Demo Evidence และ Documentation ครบถ้วน
* จัดทำ Build Log, Known Issues และ Sprint 4 Test Plan
* สรุป Sprint Review และ Retrospective
* เตรียม CP5 Submission Package สำหรับส่งตรวจ

---

# 📉 Scope Adjustment During Sprint 3

เพื่อให้สามารถส่งมอบ Prototype v1 ที่ทำงานได้จริงภายในระยะเวลาของ Sprint 3 ทีมได้ปรับลดขอบเขตงานบางส่วน

### Original Scope

* Mobile Application
* OCR-based Nutrition Label Scanning
* AI Nutrition Analysis
* Firebase Integration
* Traffic Light Nutrition Indicator

### Adjusted Scope

Mobile Application Version ถูกตัดออกจาก Sprint 3

ทีมมุ่งเน้นการพัฒนา

* Web-based Prototype
* OCR Integration
* Backend API Development
* Firebase Integration
* Nutrition Analysis Workflow
* Traffic Light Result Dashboard

### Reason for Scope Reduction

เพื่อให้ทีมสามารถพัฒนา Core Flow หลักให้เสร็จสมบูรณ์และพร้อมสำหรับการ Demo รวมถึงการทดสอบกับผู้ใช้จริงใน Sprint 4

### Impact

* Prototype v1 รองรับการใช้งานผ่าน Web Browser เท่านั้น
* Mobile Application จะถูกพิจารณาใน Sprint ถัดไป
* ทีมสามารถพัฒนาและเชื่อมต่อ Core Flow ได้สำเร็จ

---

# 🔗 Evidence Links

* GitHub Repository: https://github.com/AnnaWorasing586/TEAM-11-Sprint3
* Demo Video: [Insert Demo Link]
* Core Flow Documentation: docs/core-flow.md
* Demo Script: docs/demo-script.md
* Build Log: docs/build-log.md
* Known Issues: docs/known-issues.md
* Sprint 4 Test Plan: docs/test-plan-sprint4.md

---

# 📸 Evidence Types

* GitHub Commit
* UI Screenshot
* API Response Test
* OCR Output Screenshot
* Firebase Integration Evidence
* Figma Design
* Sprint Board
* Demo Video
* Integration Test
* Project Documentation
