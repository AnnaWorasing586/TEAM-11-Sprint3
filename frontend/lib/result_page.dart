import 'package:flutter/material.dart';

class ResultPage extends StatelessWidget {
  final String colorStr;
  final int score;
  final String recommendation;

  // 1. เพิ่มตัวแปรสำหรับรับค่าโภชนาการเพิ่มตรงนี้
  final int calories;
  final double protein;
  final double carbs;
  final double fat;

  const ResultPage({
    super.key,
    required this.colorStr,
    required this.score,
    required this.recommendation,
    // 2. เพิ่มการบังคับรับค่าสารอาหารใน Constructor ตรงนี้
    required this.calories,
    required this.protein,
    required this.carbs,
    required this.fat,
  });

  Color _getBgColor() {
    switch (colorStr) {
      case 'red': return Colors.red.shade100;
      case 'yellow': return Colors.yellow.shade100;
      case 'green': return Colors.green.shade100;
      default: return Colors.white;
    }
  }

  Color _getTextColor() {
    switch (colorStr) {
      case 'red': return Colors.red.shade800;
      case 'yellow': return Colors.orange.shade800; 
      case 'green': return Colors.green.shade800;
      default: return Colors.black;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('ผลการวิเคราะห์')),
      body: Container(
        color: _getBgColor(),
        padding: const EdgeInsets.all(20.0),
        // ใช้ SingleChildScrollView ครอบไว้เพื่อไม่ให้หน้าจอล้นเวลาแสดงผลเพิ่ม
        child: SingleChildScrollView(
          child: Center(
            child: Card(
              elevation: 5,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'คะแนนโภชนาการ',
                      style: TextStyle(fontSize: 18, color: Colors.grey[600]),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      '$score / 100',
                      style: TextStyle(fontSize: 44, fontWeight: FontWeight.bold, color: _getTextColor()),
                    ),
                    const SizedBox(height: 20),
                    Container(
                      width: 70,
                      height: 70,
                      decoration: BoxDecoration(
                        color: _getTextColor(),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.analytics, color: Colors.white, size: 36),
                    ),
                    const SizedBox(height: 24),

                    // ---------------------------------------------------------
                    // 3. ส่วนแสดงผล แคลอรี โปรตีน คาร์บ ไขมัน ที่เพิ่มเข้ามาใหม่
                    // ---------------------------------------------------------
                    const Divider(height: 30),
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.local_fire_department, color: Colors.orange),
                        SizedBox(width: 5),
                        Text(
                          'พลังงานและสารอาหารที่ได้รับ',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      '$calories kcal',
                      style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildMacroItem('โปรตีน', '${protein}g', Colors.red),
                        _buildMacroItem('คาร์บ', '${carbs}g', Colors.amber),
                        _buildMacroItem('ไขมัน', '${fat}g', Colors.blue),
                      ],
                    ),
                    const Divider(height: 30),
                    // ---------------------------------------------------------

                    const Text(
                      'คำแนะนำ:',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      recommendation,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 16),
                    ),
                    const SizedBox(height: 30),
                    ElevatedButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('สแกนใหม่อีกครั้ง'),
                    )
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ฟังก์ชันช่วยสร้าง UI เม็ดกลมๆ แสดงสารอาหารแต่ละตัวด้านล่าง
  Widget _buildMacroItem(String label, String value, Color color) {
    return Column(
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        const SizedBox(height: 2),
        Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
      ],
    );
  }
}
