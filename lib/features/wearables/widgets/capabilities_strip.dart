import 'package:flutter/material.dart';
import '../core/wearable_capabilities.dart';

class CapabilitiesStrip extends StatelessWidget {
  final WearableCapabilities capabilities;

  const CapabilitiesStrip({super.key, required this.capabilities});

  @override
  Widget build(BuildContext context) {
    final features = [
      _FeatureItem('Heart Rate', capabilities.heartRate, Icons.favorite),
      _FeatureItem('Steps', capabilities.steps, Icons.directions_walk),
      _FeatureItem('Calories', capabilities.calories, Icons.local_fire_department),
      _FeatureItem('Sleep', capabilities.sleep, Icons.bedtime),
      _FeatureItem('SpO2', capabilities.spo2, Icons.bloodtype),
      _FeatureItem('HRV', capabilities.hrv, Icons.graphic_eq),
      _FeatureItem('Body Temp', capabilities.bodyTemperature, Icons.thermostat),
      _FeatureItem('Blood Pressure', capabilities.bloodPressure, Icons.speed),
      _FeatureItem('Stress', capabilities.stress, Icons.psychology),
      _FeatureItem('Respiration', capabilities.respiratoryRate, Icons.air),
    ];

    return Wrap(
      spacing: 6,
      runSpacing: 6,
      children: features.map((f) {
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
          decoration: BoxDecoration(
            color: f.supported
                ? const Color(0xFF10B981).withValues(alpha: 0.1)
                : Colors.grey.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: f.supported
                  ? const Color(0xFF10B981).withValues(alpha: 0.3)
                  : Colors.grey.withValues(alpha: 0.2),
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                f.icon,
                size: 11,
                color: f.supported ? const Color(0xFF059669) : Colors.grey,
              ),
              const SizedBox(width: 4),
              Text(
                f.name,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: f.supported ? FontWeight.w600 : FontWeight.normal,
                  color: f.supported ? const Color(0xFF059669) : Colors.grey.shade600,
                  decoration: f.supported ? null : TextDecoration.lineThrough,
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }
}

class _FeatureItem {
  final String name;
  final bool supported;
  final IconData icon;
  _FeatureItem(this.name, this.supported, this.icon);
}
