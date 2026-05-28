import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'result_page.dart';

class ScanPage extends StatefulWidget {
  const ScanPage({super.key});

  @override
  State<ScanPage> createState() => _ScanPageState();
}

class _ScanPageState extends State<ScanPage> {
  XFile? _imageFile;
  final _picker = ImagePicker();
  bool _isLoading = false;

  // 🎯 ยิงเข้าหลังบ้านพอร์ต 8080 ที่คอมพิวเตอร์ของคุณรันอยู่
  final String _apiUrl = "http://127.0.0.1:8080/upload"; 

  Future<void> _pickImage(ImageSource source) async {
    final pickedFile = await _picker.pickImage(source: source);
    if (pickedFile != null) {
      setState(() {
        _imageFile = pickedFile;
      });
    }
  }

  Future<void> _uploadAndAnalyze() async {
    if (_imageFile == null) return;

    setState(() {
      _isLoading = true;
    });

    try {
      // 1. ตั้งคำขอส่งข้อมูลแบบ Multipart ไปที่ API หลังบ้าน
      var request = http.MultipartRequest('POST', Uri.parse(_apiUrl));
      
      // 2. อ่านไฟล์รูปภาพเป็นข้อมูลดิบ (Bytes) เพื่อให้ทำงานบน Web ได้ร้อยเปอร์เซ็นต์
      final imageBytes = await _imageFile!.readAsBytes();
      
      // 3. แอดไฟล์เข้าสู่กล่องข้อมูลส่งออก
      request.files.add(
        http.MultipartFile.fromBytes(
          'file', 
          imageBytes,
          filename: _imageFile!.name,
        ),
      );

      // 4. ยิงข้อมูลข้ามเน็ตเวิร์กไปหา Python
      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        // 5. แกะคำตอบ JSON จริงที่ AI คำนวณได้
        var data = json.decode(response.body);

        if (data.containsKey('error')) {
          _showError("เกิดข้อผิดพลาดจากหลังบ้าน: ${data['error']}");
        } else {
          // 6. วิ่งไปหน้าแสดงผล พร้อมส่งคำแนะนำที่ได้จากฉลากจริงไปโชว์
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ResultPage(
                colorStr: data['color'] ?? 'green',
                score: data['score'] ?? 90,
                recommendation: data['recommendation'] ?? '',
              ),
            ),
          );
        }
      } else {
        _showError("เชื่อมต่อเซิร์ฟเวอร์หลังบ้านไม่ได้ (Status: ${response.statusCode})");
      }
    } catch (e) {
      _showError("ระบบเน็ตเวิร์กขัดข้อง: $e");
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }
  
  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('NutriScan AI 📸'), backgroundColor: Colors.green.shade100),
      body: Center(
        child: _isLoading
            ? const CircularProgressIndicator()
            : SingleChildScrollView(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _imageFile != null
                        ? const Text(
                            'เลือกรูปภาพสำเร็จ พร้อมทำการวิเคราะห์จริง',
                            style: TextStyle(fontSize: 16, color: Colors.green, fontWeight: FontWeight.bold),
                          )
                        : const Text(
                            'กรุณาอัปโหลดรูปภาพฉลากอาหาร',
                            style: TextStyle(fontSize: 16, color: Colors.grey),
                          ),
                    const SizedBox(height: 30),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        ElevatedButton.icon(
                          onPressed: () => _pickImage(ImageSource.camera),
                          icon: const Icon(Icons.camera_alt),
                          label: const Text('ถ่ายรูป'),
                        ),
                        ElevatedButton.icon(
                          onPressed: () => _pickImage(ImageSource.gallery),
                          icon: const Icon(Icons.photo_library),
                          label: const Text('อัปโหลดรูป'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 40),
                    if (_imageFile != null)
                      ElevatedButton(
                        onPressed: _uploadAndAnalyze,
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.green, foregroundColor: Colors.white),
                        child: const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                          child: Text('วิเคราะห์ฉลากอาหาร', style: TextStyle(fontSize: 18)),
                        ),
                      )
                  ],
                ),
              ),
      ),
    );
  }
}