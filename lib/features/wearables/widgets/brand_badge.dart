import 'package:flutter/material.dart';
import '../core/device_brand.dart';

class BrandBadge extends StatelessWidget {
  final DeviceBrand brand;
  final bool compact;

  const BrandBadge({
    super.key,
    required this.brand,
    this.compact = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: compact ? 6 : 10,
        vertical: compact ? 2 : 4,
      ),
      decoration: BoxDecoration(
        color: brand.brandColor.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: brand.brandColor.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            brand.iconData,
            size: compact ? 12 : 14,
            color: brand.brandColor,
          ),
          const SizedBox(width: 4),
          Text(
            brand.displayName,
            style: TextStyle(
              color: brand.brandColor,
              fontWeight: FontWeight.bold,
              fontSize: compact ? 10 : 12,
            ),
          ),
        ],
      ),
    );
  }
}
