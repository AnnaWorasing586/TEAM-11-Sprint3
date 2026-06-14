import 'dart:convert';
import 'dart:typed_data';

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
Uint8List? _imageBytes;

final ImagePicker _picker = ImagePicker();

bool _isLoading = false;

final String _apiUrl = "https://586anna-nutriscan-ai.hf.space/upload";

Future<void> _pickImage(ImageSource source) async {
final pickedFile = await _picker.pickImage(
source: source,
imageQuality: 90,
);

```
if (pickedFile != null) {
  final bytes = await pickedFile.readAsBytes();

  setState(() {
    _imageFile = pickedFile;
    _imageBytes = bytes;
  });
}
```

}

Future<void> _uploadAndAnalyze() async {
if (_imageFile == null) {
ScaffoldMessenger.of(context).showSnackBar(
const SnackBar(
content: Text(
'กรุณาอัปโหลดรูปฉลากโภชนาการก่อน',
),
),
);
return;
}

```
setState(() {
  _isLoading = true;
});

try {
  var request = http.MultipartRequest(
    'POST',
    Uri.parse(_apiUrl),
  );

  request.files.add(
    http.MultipartFile.fromBytes(
      'file',
      _imageBytes!,
      filename: _imageFile!.name,
    ),
  );

  var streamedResponse = await request.send();
  var response = await http.Response.fromStream(
    streamedResponse,
  );

  if (response.statusCode == 200) {
    final data = json.decode(response.body);

    if (data.containsKey('error')) {
      _showError(
        "เกิดข้อผิดพลาดจากระบบ: ${data['error']}",
      );
    } else {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => ResultPage(
            colorStr: data['color'] ?? 'green',
            score: data['score'] ?? 90,
            recommendation:
                data['recommendation'] ?? '',
            calories: data['calories'] ?? 350,
            protein: data['protein'] ?? 24.5,
            carbs: data['carbs'] ?? 45.0,
            fat: data['fat'] ?? 8.2,
            sugar: data['sugar'] ?? 1.0,
            sodium: data['sodium'] ?? 2,
          ),
        ),
      );
    }
  } else {
    _showError(
      "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ (${response.statusCode})",
    );
  }
} catch (e) {
  _showError(
    "เกิดข้อผิดพลาดในการเชื่อมต่อ: $e",
  );
} finally {
  setState(() {
    _isLoading = false;
  });
}
```

}

void _showError(String message) {
ScaffoldMessenger.of(context).showSnackBar(
SnackBar(
content: Text(message),
),
);
}

@override
Widget build(BuildContext context) {
return Scaffold(
backgroundColor: const Color(0xFFF8FAFC),

```
  appBar: AppBar(
    backgroundColor: Colors.green,
    foregroundColor: Colors.white,
    centerTitle: true,
    title: const Text(
      'NutriScan AI',
      style: TextStyle(
        fontWeight: FontWeight.bold,
      ),
    ),
  ),

  body: _isLoading
      ? Center(
          child: Column(
            mainAxisAlignment:
                MainAxisAlignment.center,
            children: const [
              CircularProgressIndicator(),
              SizedBox(height: 20),
              Text(
                'AI กำลังวิเคราะห์ฉลากโภชนาการ...',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        )
```
```
      : SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(
                maxWidth: 700,
              ),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius:
                      BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    const Icon(
                      Icons.health_and_safety,
                      size: 70,
                      color: Colors.green,
                    ),

                    const SizedBox(height: 12),

                    const Text(
                      'สแกนฉลากโภชนาการ',
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 10),

                    const Text(
                      'อัปโหลดรูปภาพฉลากอาหารเพื่อให้ AI วิเคราะห์ข้อมูลโภชนาการ',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 15,
                      ),
                    ),

                    const SizedBox(height: 25),

                    Container(
                      width: double.infinity,
                      height: 280,
                      decoration: BoxDecoration(
                        borderRadius:
                            BorderRadius.circular(
                                18),
                        border: Border.all(
                          color: Colors.grey
                              .shade300,
                          width: 2,
                        ),
                      ),
                      child: _imageBytes == null
                          ? Column(
                              mainAxisAlignment:
                                  MainAxisAlignment
                                      .center,
                              children: [
                                Icon(
                                  Icons
                                      .cloud_upload_outlined,
                                  size: 80,
                                  color: Colors
                                      .grey.shade400,
                                ),
                                const SizedBox(
                                    height: 12),
                                const Text(
                                  'เลือกรูปฉลากอาหาร',
                                  style:
                                      TextStyle(
                                    fontSize: 18,
                                    fontWeight:
                                        FontWeight
                                            .bold,
                                  ),
                                ),
                                const SizedBox(
                                    height: 5),
                                const Text(
                                  'รองรับ JPG และ PNG',
                                  style:
                                      TextStyle(
                                    color:
                                        Colors.grey,
                                  ),
                                ),
                              ],
                            )
                          : ClipRRect(
                              borderRadius:
                                  BorderRadius
                                      .circular(
                                          16),
                              child: Image.memory(
                                _imageBytes!,
                                fit:
                                    BoxFit.cover,
                                width:
                                    double.infinity,
                                height: 280,
                              ),
                            ),
                    ),

                    const SizedBox(height: 25),

                    Row(
                      children: [
                        Expanded(
                          child:
                              ElevatedButton.icon(
                            onPressed: () =>
                                _pickImage(
                              ImageSource.camera,
                            ),
                            icon: const Icon(
                              Icons.camera_alt,
                            ),
                            label:
                                const Text(
                              'ถ่ายรูป',
                            ),
                            style:
                                ElevatedButton
                                    .styleFrom(
                              padding:
                                  const EdgeInsets
                                      .symmetric(
                                vertical: 15,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(
                            width: 12),
                        Expanded(
                          child:
                              ElevatedButton.icon(
                            onPressed: () =>
                                _pickImage(
                              ImageSource.gallery,
                            ),
                            icon: const Icon(
                              Icons.photo_library,
                            ),
                            label:
                                const Text(
                              'อัปโหลดรูป',
                            ),
                            style:
                                ElevatedButton
                                    .styleFrom(
                              padding:
                                  const EdgeInsets
                                      .symmetric(
                                vertical: 15,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 25),

                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed:
                            _imageFile == null
                                ? null
                                : _uploadAndAnalyze,
                        icon: const Icon(
                          Icons.bolt,
                        ),
                        label: const Text(
                          'เริ่มประมวลผลด้วย AI',
                        ),
                        style:
                            ElevatedButton
                                .styleFrom(
                          backgroundColor:
                              Colors.green,
                          foregroundColor:
                              Colors.white,
                          padding:
                              const EdgeInsets
                                  .symmetric(
                            vertical: 18,
                          ),
                          textStyle:
                              const TextStyle(
                            fontSize: 18,
                            fontWeight:
                                FontWeight.bold,
                          ),
                          shape:
                              RoundedRectangleBorder(
                            borderRadius:
                                BorderRadius
                                    .circular(
                                        14),
                          ),
                        ),
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
}
