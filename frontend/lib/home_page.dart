import 'package:flutter/material.dart';
import 'scan_page.dart';

class HomePage extends StatelessWidget {
const HomePage({super.key});

@override
Widget build(BuildContext context) {
return Scaffold(
backgroundColor: const Color(0xFFF8FAFC),

```
  body: SafeArea(
    child: Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: ConstrainedBox(
          constraints: const BoxConstraints(
            maxWidth: 700,
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [

              // Logo
              Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  color: Colors.green.shade50,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.health_and_safety,
                  size: 70,
                  color: Colors.green,
                ),
              ),

              const SizedBox(height: 30),

              // App Name
              const Text(
                'NutriScan AI',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 38,
                  fontWeight: FontWeight.bold,
                  color: Colors.green,
                ),
              ),

              const SizedBox(height: 12),

              // Description
              const Text(
                'สแกนฉลากโภชนาการด้วย AI\nเพื่อช่วยให้คุณเลือกอาหารได้อย่างชาญฉลาด',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 18,
                  color: Colors.black87,
                  height: 1.5,
                ),
              ),

              const SizedBox(height: 40),

              // Feature Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 12,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  children: [

                    _featureTile(
                      Icons.document_scanner,
                      'อ่านฉลากอัตโนมัติ',
                      'AI ตรวจจับข้อมูลจากฉลากอาหาร',
                      Colors.green,
                    ),

                    const SizedBox(height: 18),

                    _featureTile(
                      Icons.monitor_heart,
                      'วิเคราะห์สารอาหาร',
                      'ตรวจสอบน้ำตาลและโซเดียม',
                      Colors.orange,
                    ),

                    const SizedBox(height: 18),

                    _featureTile(
                      Icons.insights,
                      'ให้คะแนนสุขภาพ',
                      'ประเมินความเหมาะสมของผลิตภัณฑ์',
                      Colors.blue,
                    ),

                    const SizedBox(height: 18),

                    _featureTile(
                      Icons.tips_and_updates,
                      'คำแนะนำทันที',
                      'ช่วยตัดสินใจก่อนเลือกบริโภค',
                      Colors.purple,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 40),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            const ScanPage(),
                      ),
                    );
                  },
                  icon: const Icon(
                    Icons.camera_alt,
                  ),
                  label: const Text(
                    'เริ่มสแกนฉลากอาหาร',
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      vertical: 18,
                    ),
                    textStyle: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(16),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 24),

              Text(
                'NutriScan AI • ESE Summer Internship 2026',
                style: TextStyle(
                  color: Colors.grey.shade600,
                  fontSize: 13,
                ),
              ),
            ],
          ),
        ),
      ),
    ),
  ),
);
```

}

Widget _featureTile(
IconData icon,
String title,
String subtitle,
Color color,
) {
return Row(
children: [
CircleAvatar(
radius: 24,
backgroundColor: color.withOpacity(0.15),
child: Icon(
icon,
color: color,
),
),

```
    const SizedBox(width: 16),

    Expanded(
      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: TextStyle(
              color: Colors.grey.shade600,
            ),
          ),
        ],
      ),
    ),
  ],
);
```

}
}
