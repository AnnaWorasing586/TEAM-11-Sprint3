import 'package:flutter/material.dart';

class ResultPage extends StatelessWidget {
  final String colorStr;
  final int score;
  final String recommendation;

  const ResultPage({
    super.key,
    required this.colorStr,
    required this.score,
    required this.recommendation,
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
        child: Center(
          child: Card(
            elevation: 5,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Padding(
              padding: const EdgeInsets.all(30.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'คะแนนโภชนาการ',
                    style: TextStyle(fontSize: 20, color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    '$score / 100',
                    style: TextStyle(fontSize: 48, fontWeight: FontWeight.bold, color: _getTextColor()),
                  ),
                  const SizedBox(height: 20),
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: _getTextColor(),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.analytics, color: Colors.white, size: 40),
                  ),
                  const SizedBox(height: 30),
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
    );
  }
}