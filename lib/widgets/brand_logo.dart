import 'package:flutter/material.dart';

/// A reusable widget that displays the FemSphere brand logo.
///
/// The logo image is stored in `assets/images/femsphere_logo.png` and is
/// declared in `pubspec.yaml`. This widget ensures a consistent size, shape
/// and styling across the mobile app.
class BrandLogo extends StatelessWidget {
  /// Optional size (width & height). Defaults to 44 which matches existing UI.
  final double size;

  const BrandLogo({super.key, this.size = 44.0});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.white,
        border: Border.all(color: const Color(0xFFE9D5FF), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(size / 2),
        child: Image.asset(
          'assets/images/femsphere_logo.png',
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}
