import 'package:flutter/material.dart';

class ResultPage extends StatelessWidget {
final String colorStr;
final int score;
final String recommendation;
final int calories;
final double protein;
final double carbs;
final double fat;
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
required this.sugar,
required this.sodium,
});

Color _getBgColor() {
switch (colorStr) {
case 'red':
return Colors.red.shade50;
case 'yellow':
return Colors.yellow.shade50;
case 'green':
return Colors.green.shade50;
default:
return Colors.white;
}
}

Color _getMainColor() {
switch (colorStr) {
case 'red':
return Colors.red;
case 'yellow':
return Colors.orange;
case 'green':
return Colors.green;
default:
return Colors.grey;
}
}

String _getStatusText() {
switch (colorStr) {
case 'red':
return 'ควรบริโภคแต่พอเหมาะ';
case 'yellow':
return 'ปานกลาง';
case 'green':
return 'ดีต่อสุขภาพ';
default:
return 'ไม่ระบุ';
}
}

@override
Widget build(BuildContext context) {
return Scaffold(
backgroundColor: const Color(0xFFF8FAFC),

```
  appBar: AppBar(
    title: const Text('ผลการวิเคราะห์'),
    centerTitle: true,
    backgroundColor: Colors.green,
    foregroundColor: Colors.white,
  ),

  body: SingleChildScrollView(
    padding: const EdgeInsets.all(20),
    child: Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(
          maxWidth: 700,
        ),
        child: Column(
          children: [

            // คะแนน
            Card(
              elevation: 3,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    const Text(
                      'คะแนนโภชนาการ',
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.grey,
                      ),
                    ),

                    const SizedBox(height: 10),

                    Text(
                      '$score / 100',
                      style: TextStyle(
                        fontSize: 48,
                        fontWeight: FontWeight.bold,
                        color: _getMainColor(),
                      ),
                    ),

                    const SizedBox(height: 10),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.circle,
                          size: 14,
                          color: _getMainColor(),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          _getStatusText(),
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: _getMainColor(),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            // สารอาหาร
            Card(
              elevation: 3,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [

                    const Row(
                      children: [
                        Icon(
                          Icons.local_fire_department,
                          color: Colors.orange,
                        ),
                        SizedBox(width: 8),
                        Text(
                          'ข้อมูลโภชนาการ',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),

                    const Divider(height: 30),

                    Text(
                      '$calories kcal',
                      style: const TextStyle(
                        fontSize: 40,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 25),

                    Row(
                      mainAxisAlignment:
                          MainAxisAlignment.spaceAround,
                      children: [
                        _buildMacroItem(
                          'โปรตีน',
                          '${protein}g',
                          Colors.red,
                        ),
                        _buildMacroItem(
                          'คาร์บ',
                          '${carbs}g',
                          Colors.amber,
                        ),
                        _buildMacroItem(
                          'ไขมัน',
                          '${fat}g',
                          Colors.blue,
                        ),
                      ],
                    ),

                    const SizedBox(height: 20),

                    const Divider(),

                    const SizedBox(height: 15),

                    Row(
                      mainAxisAlignment:
                          MainAxisAlignment.spaceAround,
                      children: [
                        _buildMacroItem(
                          'น้ำตาล',
                          '${sugar}g',
                          Colors.purple,
                        ),
                        _buildMacroItem(
                          'โซเดียม',
                          '${sodium}mg',
                          Colors.blueGrey,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            // คำแนะนำ
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: _getBgColor(),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: _getMainColor(),
                ),
              ),
              child: Column(
                children: [
                  const Text(
                    'คำแนะนำจาก AI',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 12),

                  Text(
                    recommendation,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 30),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.pop(context);
                },
                icon: const Icon(Icons.camera_alt),
                label: const Text(
                  'สแกนใหม่อีกครั้ง',
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    vertical: 18,
                  ),
                  textStyle: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    ),
  ),
);
```

}

Widget _buildMacroItem(
String label,
String value,
Color color,
) {
return Column(
children: [
CircleAvatar(
radius: 18,
backgroundColor: color.withOpacity(0.15),
child: Icon(
Icons.circle,
size: 12,
color: color,
),
),
const SizedBox(height: 8),
Text(
label,
style: const TextStyle(
color: Colors.grey,
),
),
const SizedBox(height: 4),
Text(
value,
style: const TextStyle(
fontSize: 18,
fontWeight: FontWeight.bold,
),
),
],
);
}
}
