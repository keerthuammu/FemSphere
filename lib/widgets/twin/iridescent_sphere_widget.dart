import 'dart:math' as math;
import 'package:flutter/material.dart';

/// A 3D animated iridescent fluid sphere reflecting chromatic
/// lavender, rose, cyan, and chrome highlights matching Screen 2 of the reference design.
class IridescentSphereWidget extends StatefulWidget {
  final double size;
  final bool isListening;

  const IridescentSphereWidget({
    super.key,
    this.size = 220,
    this.isListening = true,
  });

  @override
  State<IridescentSphereWidget> createState() => _IridescentSphereWidgetState();
}

class _IridescentSphereWidgetState extends State<IridescentSphereWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 8),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final t = _controller.value;
        // Breathing oscillation
        final breathingScale = 1.0 + (math.sin(t * 2 * math.pi * 2) * 0.035);

        return Transform.scale(
          scale: breathingScale,
          child: Container(
            width: widget.size,
            height: widget.size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              boxShadow: [
                // Soft external ambient glow matching logo plum & blush rose palette
                BoxShadow(
                  color: const Color(0xFF936DA2).withValues(alpha: 0.32),
                  blurRadius: 40,
                  spreadRadius: 8,
                ),
                BoxShadow(
                  color: const Color(0xFFF4BDCA).withValues(alpha: 0.28),
                  blurRadius: 55,
                  spreadRadius: 4,
                ),
                BoxShadow(
                  color: const Color(0xFFE27D95).withValues(alpha: 0.18),
                  blurRadius: 30,
                  spreadRadius: -4,
                ),
              ],
            ),
            child: CustomPaint(
              size: Size(widget.size, widget.size),
              painter: _IridescentSpherePainter(animationProgress: t),
            ),
          ),
        );
      },
    );
  }
}

class _IridescentSpherePainter extends CustomPainter {
  final double animationProgress;

  _IridescentSpherePainter({required this.animationProgress});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // Clip to circle boundary
    canvas.save();
    final clipPath = Path()..addOval(Rect.fromCircle(center: center, radius: radius));
    canvas.clipPath(clipPath);

    // 1. Base Pearlescent Sphere Gradient (Derived from official logo)
    final baseGradient = RadialGradient(
      center: const Alignment(-0.25, -0.28),
      radius: 0.95,
      colors: const [
        Color(0xFFFFFFFF), // Specular core
        Color(0xFFFDF5F6), // Whisper blush
        Color(0xFFF4BDCA), // Soft rose petal
        Color(0xFFB591BF), // Amethyst highlight
        Color(0xFF936DA2), // Signature plum mauve
        Color(0xFF6E437C), // Deep plum shadow
      ],
      stops: const [0.0, 0.22, 0.45, 0.68, 0.88, 1.0],
    );

    final basePaint = Paint()
      ..shader = baseGradient.createShader(Rect.fromCircle(center: center, radius: radius));
    canvas.drawCircle(center, radius, basePaint);

    // 2. Liquid Swirling Chromatic Wave 1 (Plum Mauve & Rose Petal)
    final waveAngle1 = animationProgress * 2 * math.pi;
    final waveOffset1 = Offset(
      center.dx + math.cos(waveAngle1) * (radius * 0.18),
      center.dy + math.sin(waveAngle1) * (radius * 0.18),
    );

    final swirl1 = Paint()
      ..shader = SweepGradient(
        center: const Alignment(-0.1, -0.1),
        startAngle: waveAngle1,
        endAngle: waveAngle1 + (2 * math.pi),
        colors: [
          const Color(0xFFFFFFFF).withValues(alpha: 0.8),
          const Color(0xFFF4BDCA).withValues(alpha: 0.7),
          const Color(0xFFC396BB).withValues(alpha: 0.65),
          const Color(0xFF936DA2).withValues(alpha: 0.75),
          const Color(0xFFFFFFFF).withValues(alpha: 0.8),
        ],
      ).createShader(Rect.fromCircle(center: waveOffset1, radius: radius * 0.85))
      ..blendMode = BlendMode.screen;

    canvas.drawCircle(waveOffset1, radius * 0.82, swirl1);

    // 3. Fluid Liquid Ribbons
    final ribbonPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = radius * 0.28
      ..strokeCap = StrokeCap.round
      ..blendMode = BlendMode.overlay;

    for (int i = 0; i < 3; i++) {
      final phase = animationProgress * 2 * math.pi + (i * (math.pi / 1.5));
      final path = Path();
      final p1 = Offset(center.dx - radius * 0.7, center.dy + math.sin(phase) * (radius * 0.4));
      final cp1 = Offset(center.dx, center.dy + math.cos(phase) * (radius * 0.65));
      final p2 = Offset(center.dx + radius * 0.7, center.dy - math.sin(phase) * (radius * 0.4));

      path.moveTo(p1.dx, p1.dy);
      path.quadraticBezierTo(cp1.dx, cp1.dy, p2.dx, p2.dy);

      ribbonPaint.shader = LinearGradient(
        colors: [
          const Color(0xFFE879F9).withValues(alpha: 0.4),
          const Color(0xFFFFFFFF).withValues(alpha: 0.85),
          const Color(0xFF38BDF8).withValues(alpha: 0.45),
        ],
      ).createShader(Rect.fromCircle(center: center, radius: radius));

      canvas.drawPath(path, ribbonPaint);
    }

    // 4. Bright Specular Light Glint (3D liquid reflection)
    final glintCenter = Offset(center.dx - radius * 0.32, center.dy - radius * 0.32);
    final glintPaint = Paint()
      ..shader = RadialGradient(
        colors: [
          Colors.white.withValues(alpha: 0.95),
          Colors.white.withValues(alpha: 0.4),
          Colors.white.withValues(alpha: 0.0),
        ],
        stops: const [0.0, 0.4, 1.0],
      ).createShader(Rect.fromCircle(center: glintCenter, radius: radius * 0.42));

    canvas.drawOval(
      Rect.fromCenter(center: glintCenter, width: radius * 0.75, height: radius * 0.45),
      glintPaint,
    );

    // Secondary subtle glint bottom-right
    final secGlintCenter = Offset(center.dx + radius * 0.28, center.dy + radius * 0.35);
    final secGlintPaint = Paint()
      ..shader = RadialGradient(
        colors: [
          const Color(0xFFE9D5FF).withValues(alpha: 0.6),
          const Color(0xFFF472B6).withValues(alpha: 0.0),
        ],
      ).createShader(Rect.fromCircle(center: secGlintCenter, radius: radius * 0.35));

    canvas.drawCircle(secGlintCenter, radius * 0.32, secGlintPaint);

    // 5. Outer Fresnel Rim Glow (Glossy glass reflection)
    final rimPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.5
      ..shader = SweepGradient(
        colors: [
          Colors.white.withValues(alpha: 0.9),
          const Color(0xFFF472B6).withValues(alpha: 0.7),
          const Color(0xFF67E8F9).withValues(alpha: 0.8),
          const Color(0xFFC084FC).withValues(alpha: 0.8),
          Colors.white.withValues(alpha: 0.9),
        ],
      ).createShader(Rect.fromCircle(center: center, radius: radius));

    canvas.drawCircle(center, radius - 1.5, rimPaint);

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _IridescentSpherePainter oldDelegate) {
    return oldDelegate.animationProgress != animationProgress;
  }
}
