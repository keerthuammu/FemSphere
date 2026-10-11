import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../core/app_theme.dart';

class CircularCycleWheel extends StatelessWidget {
  final int cycleDay;
  final int cycleLength;
  final int periodDuration;
  final bool isDelayed;
  final int daysDelayed;
  final int daysUntilPeriod;
  final String phaseName;
  final String? todayStatusText;
  final List<int> loggedDayIndices;
  final VoidCallback onHowDoYouFeelTap;

  const CircularCycleWheel({
    super.key,
    required this.cycleDay,
    required this.cycleLength,
    required this.periodDuration,
    this.isDelayed = false,
    this.daysDelayed = 0,
    required this.daysUntilPeriod,
    required this.phaseName,
    this.todayStatusText,
    this.loggedDayIndices = const [],
    required this.onHowDoYouFeelTap,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveCycleLength = cycleLength > 0 ? cycleLength : 28;
    final effectiveDay = cycleDay.clamp(1, effectiveCycleLength);
    final effectiveDuration = periodDuration.clamp(1, 14);

    return Column(
      children: [
        // Top header label & mode tag
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Your current cycle',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppTheme.textDark,
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFFFAF5FF),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE9D5FF)),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.water_drop, size: 12, color: Color(0xFFF43F5E)),
                  SizedBox(width: 4),
                  Text(
                    'Mode: Period Tracking',
                    style: TextStyle(
                      color: AppTheme.primaryPurple,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),

        const SizedBox(height: 16),

        // THE CIRCULAR CYCLE WHEEL
        SizedBox(
          width: 280,
          height: 280,
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Custom Painter Ring
              CustomPaint(
                size: const Size(280, 280),
                painter: _CycleWheelPainter(
                  cycleDay: effectiveDay,
                  cycleLength: effectiveCycleLength,
                  periodDuration: effectiveDuration,
                  loggedDayIndices: loggedDayIndices,
                ),
              ),

              // Floating "Day X" pill on perimeter
              _buildPerimeterDayPill(effectiveDay, effectiveCycleLength),

              // CENTER CONTENT
              Padding(
                padding: const EdgeInsets.all(36.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Today, ${_getFormattedToday()}',
                      style: const TextStyle(
                        fontSize: 11,
                        color: Colors.grey,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 6),

                    if (isDelayed) ...[
                      Text(
                        '+$daysDelayed days late',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFFD97706),
                          height: 1.1,
                        ),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'Cycle delayed',
                        style: TextStyle(fontSize: 10, color: Colors.grey),
                      ),
                    ] else if (effectiveDay <= effectiveDuration) ...[
                      Text(
                        'Day $effectiveDay of Period',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFFE11D48),
                          height: 1.1,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Day $effectiveDay of $effectiveDuration bleeding days',
                        style: const TextStyle(fontSize: 10, color: Colors.grey),
                      ),
                    ] else ...[
                      Text(
                        '$daysUntilPeriod days',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.textDark,
                          height: 1.1,
                        ),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'until your next period',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey,
                        ),
                      ),
                    ],

                    const SizedBox(height: 8),

                    // Phase Badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF5F3FF),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFDDD6FE)),
                      ),
                      child: Text(
                        phaseName,
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primaryPurple,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),

        // "HOW DO YOU FEEL TODAY?" CARD (MATCHING REFERENCE IMAGE)
        GestureDetector(
          onTap: onHowDoYouFeelTap,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFFFF7ED), Color(0xFFFFF1F2)],
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFFFEDD5)),
              boxShadow: [
                BoxShadow(
                  color: Colors.orange.withOpacity(0.06),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                )
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFB923C),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Center(
                    child: Text('😊', style: TextStyle(fontSize: 18)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'How do you feel today?',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textDark,
                        ),
                      ),
                      Text(
                        todayStatusText ?? 'Tap to log flow, mood, energy & cramps',
                        style: const TextStyle(
                          fontSize: 10,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  width: 28,
                  height: 28,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white,
                  ),
                  child: const Icon(
                    Icons.chevron_right,
                    size: 18,
                    color: Color(0xFFFB923C),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  String _getFormattedToday() {
    final now = DateTime.now();
    final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${now.day} ${months[now.month - 1]}';
  }

  Widget _buildPerimeterDayPill(int day, int cycleLen) {
    const double radius = 105.0; // Distance from center
    const double centerOffset = 140.0;
    final angle = (-math.pi / 2) + (day * (2 * math.pi / cycleLen));
    final x = centerOffset + radius * math.cos(angle);
    final y = centerOffset + radius * math.sin(angle);

    return Positioned(
      left: x - 22,
      top: y - 13,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Day ',
              style: TextStyle(fontSize: 8, color: Colors.grey, fontWeight: FontWeight.bold),
            ),
            Text(
              '$day',
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.textDark),
            ),
          ],
        ),
      ),
    );
  }
}

class _CycleWheelPainter extends CustomPainter {
  final int cycleDay;
  final int cycleLength;
  final int periodDuration;
  final List<int> loggedDayIndices;

  _CycleWheelPainter({
    required this.cycleDay,
    required this.cycleLength,
    required this.periodDuration,
    required this.loggedDayIndices,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    const radius = 105.0;
    const strokeWidth = 16.0;

    // 1. Background Ring Track
    final bgPaint = Paint()
      ..color = const Color(0xFFF1F5F9)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawCircle(center, radius, bgPaint);

    final anglePerDay = (2 * math.pi) / cycleLength;
    const startAngle = -math.pi / 2;

    // 2. Fertile Window Arc (Teal)
    // Approx ovulation = cycleLength - 14. Fertile = ovulation - 5 to ovulation + 1
    final ovDay = math.max(1, cycleLength - 14);
    final fertStartDay = math.max(1, ovDay - 5);
    final fertEndDay = math.min(cycleLength, ovDay + 1);

    final fertSweep = (fertEndDay - fertStartDay) * anglePerDay;
    final fertStartAngle = startAngle + (fertStartDay * anglePerDay);

    final fertilePaint = Paint()
      ..color = const Color(0xFF0D9488)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      fertStartAngle,
      fertSweep,
      false,
      fertilePaint,
    );

    // Ovulation marker dot inside fertile arc
    final ovAngle = startAngle + (ovDay * anglePerDay);
    final ovOffset = Offset(
      center.dx + radius * math.cos(ovAngle),
      center.dy + radius * math.sin(ovAngle),
    );

    final ovDotPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;
    canvas.drawCircle(ovOffset, 5, ovDotPaint);

    final ovRingPaint = Paint()
      ..color = const Color(0xFF0D9488)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5;
    canvas.drawCircle(ovOffset, 5, ovRingPaint);

    // 3. Period Bleeding Arc (Rose/Crimson)
    final periodSweep = periodDuration * anglePerDay;
    final periodRect = Rect.fromCircle(center: center, radius: radius);

    final periodGradient = const SweepGradient(
      startAngle: 0,
      endAngle: math.pi / 2,
      colors: [Color(0xFFBE123C), Color(0xFFF43F5E), Color(0xFFFB7185)],
    ).createShader(periodRect);

    final periodPaint = Paint()
      ..shader = periodGradient
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      periodRect,
      startAngle,
      periodSweep,
      false,
      periodPaint,
    );

    // Droplet marker dot at top 12 o'clock (Day 1)
    final dropOffset = Offset(center.dx, center.dy - radius);
    final dropPaint = Paint()..color = const Color(0xFFBE123C);
    canvas.drawCircle(dropOffset, 6, dropPaint);

    // 4. Subtle Progress Arc Outline
    final progressSweep = math.max(0.05, cycleDay * anglePerDay);
    final progressPaint = Paint()
      ..color = AppTheme.primaryPurple.withValues(alpha: 0.5)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius + 11),
      startAngle,
      progressSweep,
      false,
      progressPaint,
    );

    // 5. Daily Symptoms Logged Dots on Inner Radius
    const innerRadius = radius - 20;
    final dotPaint = Paint()..color = AppTheme.primaryPurple.withValues(alpha: 0.7);

    for (final dayIdx in loggedDayIndices) {
      if (dayIdx >= 0 && dayIdx < cycleLength) {
        final dotAngle = startAngle + (dayIdx * anglePerDay);
        final dotPos = Offset(
          center.dx + innerRadius * math.cos(dotAngle),
          center.dy + innerRadius * math.sin(dotAngle),
        );
        canvas.drawCircle(dotPos, 3, dotPaint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _CycleWheelPainter oldDelegate) {
    return oldDelegate.cycleDay != cycleDay ||
        oldDelegate.cycleLength != cycleLength ||
        oldDelegate.periodDuration != periodDuration ||
        oldDelegate.loggedDayIndices != loggedDayIndices;
  }
}
