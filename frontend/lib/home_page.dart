import 'package:flutter/material.dart';
import 'scan_page.dart'; // อิมพอร์ตหน้าสแกนมาเพื่อให้ปุ่มกดเชื่อมไปได้

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // 1. แก้ไขโดยการย้าย title มาไว้ใน AppBar ให้ถูกต้องตามหลักของ Flutter
      appBar: AppBar(
        title: const Text(
          'NutriScan AI',
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        backgroundColor: Colors.green,
        centerTitle: true,
      ),
      
      // 2. ใช้ Column แทน Stack เพื่อจัดวางสิ่งของจากบนลงล่างให้อยู่ตรงกลางหน้าจออย่างสวยงาม
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // ไอคอนตกแต่งให้เข้ากับแอปอาหารและสุขภาพ
              const Icon(
                Icons.restaurant_menu,
                size: 100,
                color: Colors.green,
              ),
              const SizedBox(height: 24),
              
              // ข้อความหัวข้อหลัก
              const Text(
                'NutriScan AI',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Colors.green,
                ),
              ),
              const SizedBox(height: 12),
              
              // ข้อความคำอธิบายสั้นๆ
              const Text(
                'Track nutrition labels quickly and accurately with AI.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 48),
              
              // 3. ปุ่มกดเพื่อเปลี่ยนหน้า (โค้ดดั้งเดิมของคุณที่ถูกต้อง นำมาปรับแต่งความสวยงามเพิ่ม)
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const ScanPage(),
                    ),
                  );
                },
                icon: const Icon(Icons.camera_alt, color: Colors.white),
                label: const Text(
                  'Start Scanning',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green, // ปุ่มสีเขียว
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32,
                    vertical: 16,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30), // ทำปุ่มให้ขอบมนสวยงาม
                  ),
                  elevation: 3, // ใส่เงาให้ปุ่มดูมีมิติ
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
