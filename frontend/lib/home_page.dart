import 'package:flutter/material.dart';
import 'scan_page.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('NutriScan AI'),
        centerTitle: true,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [

              const Icon(
                Icons.restaurant_menu,
                size: 100,
              ),

              const SizedBox(height: 20),

              const Text(
                'NutriScan AI',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 10),

              const Text(
                'Analyze nutrition labels quickly and easily.',
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 40),

              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const ScanPage(),
                    ),
                  );
                },
                child: const Text('Start Scanning'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
