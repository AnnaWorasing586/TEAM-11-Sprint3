import 'package:flutter/material.dart';

class ResultPage extends StatelessWidget {
  final String colorStr;
  final int score;
  final String recommendation;
  final int calories;
  final double protein;
  final double carbs;
  final double fat;
  
  // 1. เพิ่มตัวแปรแยกสำหรับน้ำตาลและโซเดียมตรงนี้
  final double sugar;
  final int sodium;

  const ResultPage({
    super.key,
    required this.colorStr,
    required this.score,
    required this.recommendation,
    required this.calories,
    required this.protein,
    required this.carbs,
    required this.fat,
    // 2. บังคับรับค่าเพิ่มใน Constructor
    required this.sugar,
    required this.sodium,
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
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            children: [
              // การ์ดคะแนนโภชนาการเดิม
              Card(
                elevation: 3,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    width: double.infinity,
                    children: [
                      Text('คะแนนโภชนาการ', style: TextStyle(fontSize: 18, color: Colors.grey[600])),
                      const SizedBox(height: 8),
                      Text('$score / 100', style: TextStyle(fontSize: 44, fontWeight: FontWeight.bold, color: _getTextColor())),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // การ์ดสารอาหาร (ปรับปรุงใหม่ให้โชว์ 5 สารอาหารหลัก)
              Card(
                elevation: 3,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.local_fire_department, color: Colors.orange),
                          SizedBox(width: 8),
                          Text('พลังงานและสารอาหารที่ได้รับ', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const Divider(height: 24),
                      Center(
                        child: Text('$calories kcal', style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(height: 24),
                      
                      // แถวที่ 1: โปรตีน คาร์บ ไขมัน
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildMacroItem('โปรตีน', '${protein}g', Colors.red),
                          _buildMacroItem('คาร์บ', '${carbs}g', Colors.amber),
                          _buildMacroItem('ไขมัน', '${fat}g', Colors.blue),
                        ],
                      ),
                      const SizedBox(height: 20),
                      const Divider(indent: 20, endIndent: 20),
                      const SizedBox(height: 10),

                      // แถวที่ 2: น้ำตาล โซเดียม (เพิ่มเข้ามาใหม่ให้ตัวใหญ่ชัดเจน)
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildMacroItem('น้ำตาล', '${sugar}g', Colors.purple),
                          _buildMacroItem('โซเดียม', '${sodium}mg', Colors.blueGrey),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // การ์ดคำแนะนำ
              Card(
                elevation: 3,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    width: double.infinity,
                    children: [
                      const Text('คำแนะนำ:', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 10),
                      Text(recommendation, textAlign: TextAlign.center, style: const TextStyle(fontSize: 16)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('สแกนใหม่อีกครั้ง'),
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMacroItem(String label, String value, Color color) {
    return Column(
      children: [
        Container(width: 10, height: 10, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(height: 6),
        Text(label, style: const TextStyle(fontSize: 14, color: Colors.grey)),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87)),
      ],
    );
  }
}
