# UX/UI Prototype — NutriScan AI

ส่วน design + source สำหรับ web prototype 3 หน้า — ใช้เป็น **visual reference** ของแอป Flutter ตัวจริง

## โครงสร้าง

```
ux-ui/prototype/
├── README.md          # ไฟล์นี้
└── source/            # ของจาก Claude Design handoff (ไม่แก้ไข — เก็บเป็น snapshot)
    ├── README.md      # README ต้นทางจาก handoff bundle
    ├── NutriScan AI.dc.html   # design ต้นทางใช้ DC template engine
    ├── support.js     # DC framework runtime
    └── screens/       # screenshot อ้างอิง
        ├── home.png
        ├── scan.png
        └── scan2.png
```

## โค้ดที่รันได้ อยู่ที่ไหน

**ไม่ใช่ที่นี่** — โค้ด prototype ที่รันได้อยู่ที่ `frontend/prototype/` (HTML/CSS/JS แยก 3 ไฟล์)

`source/` เก็บไว้เพื่อ:
1. Audit ตามต้นทาง — ถ้าทีมอยากย้อนดูว่า design เดิมตั้งใจให้เป็นยังไง
2. Re-generate prototype ใหม่ในอนาคต — ถ้าต้องการ refactor
3. เป็นหลักฐานว่า prototype มาจากไหน

## Design tokens

| token | ค่า |
|---|---|
| Accent (default) | `#15a06a` (เขียวสด) |
| Accent option 2 | `#2f7df5` (ฟ้า) |
| Accent option 3 | `#ff7a5c` (คอรัล) |
| Background | radial gradient `#fbeede` / `#dff1e6` / `#efe9dc` |
| App frame | `#f4f1ea` border-radius 42px |
| Dark cards | `#1f2b24` → `#2c3a30` |
| Text primary | `#1b2722` |
| Text secondary | `#8a9890` |
| Body font | IBM Plex Sans Thai 400/500/600/700 |
| Display font | Plus Jakarta Sans 500/600/700/800 |

## Animations (CSS keyframes ใน `frontend/prototype/styles.css`)

| ชื่อ | ใช้ที่ |
|---|---|
| `ns-scanline` | เส้นเลเซอร์เลื่อนใน viewfinder หน้า Scan |
| `ns-spin` | spinner AI loading |
| `ns-pulseRing` | วงกลม AI กระพือ |
| `ns-dots` | จุด 3 จุดใต้ "AI กำลังวิเคราะห์" |
| `ns-float` | blob พื้นหลังลอยขึ้นลง |
| `ns-fadeUp` | screen transition เข้า |
| `ns-pop` | element เด้งเข้าครั้งแรก |

## เป้าหมายในขั้นต่อไป

- [ ] รวบ design tokens เข้า Flutter theme
- [ ] แปลง 3 หน้าเป็น Flutter widgets (`HomeScreen`, `ScanScreen`, `ResultScreen`)
- [ ] เพิ่ม dark mode ที่ design ยังไม่ครอบคลุม
- [ ] Accessibility audit ก่อน ship
