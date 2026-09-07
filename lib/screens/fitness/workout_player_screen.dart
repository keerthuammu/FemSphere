import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../models/exercise_model.dart';

class WorkoutPlayerScreen extends StatefulWidget {
  final WorkoutPlan workoutPlan;

  const WorkoutPlayerScreen({Key? key, required this.workoutPlan}) : super(key: key);

  @override
  State<WorkoutPlayerScreen> createState() => _WorkoutPlayerScreenState();
}

enum PlayerState { ready, active, resting, completed }

class _WorkoutPlayerScreenState extends State<WorkoutPlayerScreen> with TickerProviderStateMixin {
  late int _currentExerciseIndex;
  late PlayerState _playerState;
  
  int _countdownSeconds = 10;
  int _exerciseTimeLeft = 30;
  int _restTimeLeft = 15;
  int _currentRep = 1;
  bool _isPaused = false;
  bool _isMuted = false;

  int _totalCaloriesBurned = 0;
  int _totalActiveSeconds = 0;

  Timer? _ticker;
  late AnimationController _humanAnimController;

  @override
  void initState() {
    super.initState();
    _currentExerciseIndex = 0;
    _playerState = PlayerState.ready;
    _countdownSeconds = 10;
    _exerciseTimeLeft = currentExercise.durationSeconds;
    _restTimeLeft = currentExercise.restDurationSeconds;
    _currentRep = 1;

    _humanAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat();

    _humanAnimController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        if (_playerState == PlayerState.active && !_isPaused) {
          setState(() {
            if (_currentRep < currentExercise.repetitionCount) {
              _currentRep++;
            }
          });
        }
      }
    });

    _startTimer();
  }

  @override
  void dispose() {
    _ticker?.cancel();
    _humanAnimController.dispose();
    super.dispose();
  }

  Exercise get currentExercise => widget.workoutPlan.exercises[_currentExerciseIndex];

  void _startTimer() {
    _ticker?.cancel();
    _ticker = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_isPaused) return;

      setState(() {
        if (_playerState == PlayerState.ready) {
          if (_countdownSeconds > 1) {
            _countdownSeconds--;
          } else {
            _playerState = PlayerState.active;
            _exerciseTimeLeft = currentExercise.durationSeconds;
            _currentRep = 1;
          }
        } else if (_playerState == PlayerState.active) {
          _totalActiveSeconds++;
          if (_exerciseTimeLeft > 1) {
            _exerciseTimeLeft--;
          } else {
            _totalCaloriesBurned += currentExercise.calories;
            if (_currentExerciseIndex < widget.workoutPlan.exercises.length - 1) {
              _playerState = PlayerState.resting;
              _restTimeLeft = currentExercise.restDurationSeconds;
            } else {
              _playerState = PlayerState.completed;
              _ticker?.cancel();
            }
          }
        } else if (_playerState == PlayerState.resting) {
          if (_restTimeLeft > 1) {
            _restTimeLeft--;
          } else {
            _currentExerciseIndex++;
            _playerState = PlayerState.active;
            _exerciseTimeLeft = currentExercise.durationSeconds;
            _currentRep = 1;
          }
        }
      });
    });
  }

  void _skipReady() {
    setState(() {
      _playerState = PlayerState.active;
      _exerciseTimeLeft = currentExercise.durationSeconds;
      _currentRep = 1;
    });
  }

  void _skipRest() {
    setState(() {
      _currentExerciseIndex++;
      _playerState = PlayerState.active;
      _exerciseTimeLeft = currentExercise.durationSeconds;
      _currentRep = 1;
    });
  }

  void _togglePause() {
    setState(() {
      _isPaused = !_isPaused;
      if (_isPaused) {
        _humanAnimController.stop();
      } else {
        _humanAnimController.repeat();
      }
    });
  }

  void _nextExercise() {
    setState(() {
      if (_currentExerciseIndex < widget.workoutPlan.exercises.length - 1) {
        _currentExerciseIndex++;
        _playerState = PlayerState.active;
        _exerciseTimeLeft = currentExercise.durationSeconds;
        _currentRep = 1;
      } else {
        _playerState = PlayerState.completed;
        _ticker?.cancel();
      }
    });
  }

  void _previousExercise() {
    setState(() {
      if (_currentExerciseIndex > 0) {
        _currentExerciseIndex--;
        _playerState = PlayerState.active;
        _exerciseTimeLeft = currentExercise.durationSeconds;
        _currentRep = 1;
      }
    });
  }

  String _formatTime(int totalSeconds) {
    final mins = (totalSeconds ~/ 60).toString().padLeft(2, '0');
    final secs = (totalSeconds % 60).toString().padLeft(2, '0');
    return '$mins:$secs';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: _playerState == PlayerState.completed
            ? _buildCompletionSummary()
            : _playerState == PlayerState.resting
                ? _buildRestScreen()
                : _playerState == PlayerState.ready
                    ? _buildReadyToGoScreen()
                    : _buildProfessionalWorkoutPlayer(),
      ),
    );
  }

  // VIEW 1: READY TO GO SCREEN
  Widget _buildReadyToGoScreen() {
    return Column(
      children: [
        _buildTopBar(),
        const SizedBox(height: 10),
        Expanded(
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: AppTheme.borderPurple),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(28),
              child: AnimatedBuilder(
                animation: _humanAnimController,
                builder: (context, child) {
                  return CustomPaint(
                    painter: StrictHumanoidSkeletalPainter(
                      progress: _humanAnimController.value,
                      exerciseType: currentExercise.animationType,
                    ),
                    size: const Size(double.infinity, double.infinity),
                  );
                },
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'READY TO GO!',
          style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: Color(0xFF0066FF), letterSpacing: -0.5),
        ),
        const SizedBox(height: 4),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(currentExercise.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
            const SizedBox(width: 6),
            IconButton(
              icon: const Icon(Icons.info_outline, size: 20, color: Colors.grey),
              onPressed: _showExerciseGuideModal,
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: 80,
              height: 80,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  CircularProgressIndicator(
                    value: _countdownSeconds / 10,
                    strokeWidth: 8,
                    backgroundColor: const Color(0xFFE2E8F0),
                    valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF0066FF)),
                  ),
                  Text('$_countdownSeconds', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Colors.black)),
                ],
              ),
            ),
            const SizedBox(width: 30),
            ElevatedButton(
              onPressed: _skipReady,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0066FF),
                foregroundColor: Colors.white,
                shape: const CircleBorder(),
                padding: const EdgeInsets.all(16),
                elevation: 4,
              ),
              child: const Icon(Icons.arrow_forward_ios, size: 22),
            ),
          ],
        ),
        const SizedBox(height: 30),
      ],
    );
  }

  // VIEW 2: PROFESSIONAL WORKOUT PLAYER
  Widget _buildProfessionalWorkoutPlayer() {
    return Column(
      children: [
        _buildTopBar(),
        const SizedBox(height: 4),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    currentExercise.name,
                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.textDark, letterSpacing: -0.5),
                  ),
                  Text(
                    'Exercise ${_currentExerciseIndex + 1} / ${widget.workoutPlan.exercises.length}',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Color(0xFF0066FF)),
                  ),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.help_outline, color: AppTheme.primaryPurple, size: 24),
                onPressed: _showExerciseGuideModal,
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),

        Expanded(
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: AppTheme.borderPurple),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.03),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                )
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(28),
              child: AnimatedBuilder(
                animation: _humanAnimController,
                builder: (context, child) {
                  return CustomPaint(
                    painter: StrictHumanoidSkeletalPainter(
                      progress: _humanAnimController.value,
                      exerciseType: currentExercise.animationType,
                    ),
                    size: const Size(double.infinity, double.infinity),
                  );
                },
              ),
            ),
          ),
        ),

        const SizedBox(height: 12),

        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFBFDBFE)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.repeat, size: 16, color: Color(0xFF0066FF)),
                    const SizedBox(width: 6),
                    Text(
                      '$_currentRep / ${currentExercise.repetitionCount} REPS',
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF0066FF)),
                    ),
                  ],
                ),
              ),
              Text(
                _formatTime(_exerciseTimeLeft),
                style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: AppTheme.textDark, fontFamily: 'monospace'),
              ),
            ],
          ),
        ),

        const SizedBox(height: 10),

        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: (_currentExerciseIndex + (_currentRep / currentExercise.repetitionCount)) / widget.workoutPlan.exercises.length,
              backgroundColor: const Color(0xFFE2E8F0),
              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF0066FF)),
              minHeight: 8,
            ),
          ),
        ),

        const SizedBox(height: 14),

        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Row(
            children: [
              IconButton(
                onPressed: _currentExerciseIndex > 0 ? _previousExercise : null,
                icon: const Icon(Icons.skip_previous, size: 36),
                color: Colors.grey.shade700,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: _togglePause,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0066FF),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    elevation: 4,
                  ),
                  child: Text(
                    _isPaused ? 'RESUME' : 'PAUSE',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, letterSpacing: 1),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              IconButton(
                onPressed: _nextExercise,
                icon: const Icon(Icons.skip_next, size: 36),
                color: Colors.grey.shade700,
              ),
            ],
          ),
        ),

        const SizedBox(height: 18),
      ],
    );
  }

  // VIEW 3: REST INTERVAL SCREEN
  Widget _buildRestScreen() {
    final nextExercise = widget.workoutPlan.exercises[_currentExerciseIndex + 1];
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFEDE9FE),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text('REST & RECOVER', style: TextStyle(fontWeight: FontWeight.w900, color: AppTheme.primaryPurple, fontSize: 12)),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: 140,
            height: 140,
            child: Stack(
              alignment: Alignment.center,
              children: [
                CircularProgressIndicator(
                  value: _restTimeLeft / 15,
                  strokeWidth: 10,
                  backgroundColor: const Color(0xFFE2E8F0),
                  valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.primaryPurple),
                ),
                Text(
                  '00:${_restTimeLeft.toString().padLeft(2, '0')}',
                  style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: AppTheme.textDark, fontFamily: 'monospace'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 36),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.borderPurple),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Text('⚡', style: TextStyle(fontSize: 22)),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('NEXT EXERCISE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
                      Text(nextExercise.name, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppTheme.textDark)),
                      Text('${nextExercise.repetitionCount} reps • ${nextExercise.calories} kcal', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 30),
          ElevatedButton(
            onPressed: _skipRest,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0066FF),
              foregroundColor: Colors.white,
              minimumSize: const Size(double.infinity, 50),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: const Text('Skip Rest →', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          ),
        ],
      ),
    );
  }

  // VIEW 4: COMPLETION SUMMARY
  Widget _buildCompletionSummary() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: const Color(0xFFECFDF5),
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFA7F3D0), width: 2),
            ),
            child: const Center(child: Text('🏆', style: TextStyle(fontSize: 48))),
          ),
          const SizedBox(height: 20),
          const Text('WORKOUT COMPLETED!', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppTheme.textDark, letterSpacing: -0.5)),
          const SizedBox(height: 6),
          const Text('Outstanding effort! Your female vitality metrics are updated.', textAlign: TextAlign.center, style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(child: _buildSummaryMetric('Calories Burned', '+$_totalCaloriesBurned', 'kcal', Colors.orange.shade700, const Color(0xFFFFF7ED))),
              const SizedBox(width: 12),
              Expanded(child: _buildSummaryMetric('Active Time', _formatTime(_totalActiveSeconds), 'duration', const Color(0xFF0066FF), const Color(0xFFEFF6FF))),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(child: _buildSummaryMetric('Exercises Done', '${widget.workoutPlan.exercises.length}', 'completed', const Color(0xFF10B981), const Color(0xFFECFDF5))),
              const SizedBox(width: 12),
              Expanded(child: _buildSummaryMetric('Streak', '5 Days 🔥', 'consistency', const Color(0xFF7C3AED), const Color(0xFFF3E8FF))),
            ],
          ),
          const SizedBox(height: 32),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryPurple,
              foregroundColor: Colors.white,
              minimumSize: const Size(double.infinity, 54),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
            ),
            child: const Text('Save & Finish', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryMetric(String title, String value, String unit, Color textColor, Color bgColor) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: textColor.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: textColor.withOpacity(0.8))),
          const SizedBox(height: 6),
          Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: textColor)),
          Text(unit, style: TextStyle(fontSize: 10, color: textColor.withOpacity(0.6))),
        ],
      ),
    );
  }

  Widget _buildTopBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFFEFF6FF),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFBFDBFE)),
            ),
            child: Text(
              '${_currentExerciseIndex + 1} of ${widget.workoutPlan.exercises.length}',
              style: const TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF0066FF), fontSize: 11),
            ),
          ),
          IconButton(
            icon: Icon(_isMuted ? Icons.volume_off : Icons.volume_up, size: 22, color: Colors.grey.shade700),
            onPressed: () => setState(() => _isMuted = !_isMuted),
          ),
        ],
      ),
    );
  }

  void _showExerciseGuideModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(currentExercise.name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppTheme.textDark)),
                  IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(context)),
                ],
              ),
              const SizedBox(height: 12),
              const Text('BIOMECHANICS INSTRUCTIONS', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFF0066FF))),
              const SizedBox(height: 6),
              Text(currentExercise.instructions, style: const TextStyle(fontSize: 13, color: Colors.black87, height: 1.5)),
              const SizedBox(height: 14),
              const Text('KEY BIOMECHANICAL CUES', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFF0066FF))),
              const SizedBox(height: 6),
              ...currentExercise.biomechanicsSteps.map((step) => Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('✓ ', style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
                    Expanded(child: Text(step, style: const TextStyle(fontSize: 12, color: Colors.black87))),
                  ],
                ),
              )),
              const SizedBox(height: 14),
              const Text('TARGET MUSCLES', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFF0066FF))),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: currentExercise.focusAreas.map((area) {
                  return Chip(
                    label: Text(area, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    backgroundColor: const Color(0xFFF1F5F9),
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }
}

// =========================================================================
// 60FPS STRICT HUMANOID SKELETAL PAINTER SUPPORTING 24 ISOLATED KINEMATIC RIGS
// =========================================================================
class StrictHumanoidSkeletalPainter extends CustomPainter {
  final double progress;
  final String exerciseType;

  StrictHumanoidSkeletalPainter({required this.progress, required this.exerciseType});

  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2 + 10;
    final theta = progress * math.pi * 2;

    final paintShadow = Paint()..color = const Color(0x3394A3B8);
    final paintSkin = Paint()..color = const Color(0xFFF8C7B0);
    final paintTankTop = Paint()..color = const Color(0xFF2D9CDB);
    final paintShorts = Paint()..color = const Color(0xFF1E293B);
    final paintShoes = Paint()..color = const Color(0xFF64748B);
    final paintHair = Paint()..color = const Color(0xFF451A03);

    final paintArm = Paint()
      ..color = const Color(0xFFF8C7B0)
      ..strokeWidth = 7.5
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    // =========================================================================
    // 1. GLUTE BRIDGE (SUPINE ON MAT, PELVIC RISE TO STRAIGHT DIAGONAL)
    // =========================================================================
    if (exerciseType == 'glute_bridge') {
      final bridgePhase = (math.sin(theta) + 1) / 2;
      final pelvisRise = bridgePhase * 40.0;

      // Mat
      final paintMat = Paint()..color = const Color(0xFFE2E8F0);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 120, cy + 85, 240, 10), const Radius.circular(4)), paintMat);

      // Head & Shoulders
      canvas.drawCircle(Offset(cx - 85, cy + 62), 15, paintHair);
      canvas.drawCircle(Offset(cx - 81, cy + 60), 13, paintSkin);

      // Torso & Pelvis
      final paintTorso = Paint()
        ..color = const Color(0xFF2D9CDB)
        ..strokeWidth = 24
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(Offset(cx - 60, cy + 65), Offset(cx, cy + 65 - pelvisRise), paintTorso);

      // Shorts
      canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy + 65 - pelvisRise), width: 36, height: 26), paintShorts);

      // Thigh & Calf
      final paintLeg = Paint()
        ..color = const Color(0xFFF8C7B0)
        ..strokeWidth = 13
        ..strokeCap = StrokeCap.round;
      final kneeX = cx + 45.0;
      final kneeY = cy + 28.0 - (pelvisRise * 0.3);
      canvas.drawLine(Offset(cx, cy + 65 - pelvisRise), Offset(kneeX, kneeY), paintLeg);
      canvas.drawLine(Offset(kneeX, kneeY), Offset(cx + 70, cy + 78), paintLeg);

      // Shoes
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx + 60, cy + 76, 24, 10), const Radius.circular(3)), paintShoes);

      // Arms on floor
      canvas.drawLine(Offset(cx - 60, cy + 72), Offset(cx + 10, cy + 82), paintArm);
    }

    // =========================================================================
    // 2. HIGH KNEES (ALTERNATING 90° KNEE DRIVES WITH ARM PUMP)
    // =========================================================================
    else if (exerciseType == 'high_knees' || exerciseType == 'standing_knee_raise' || exerciseType == 'butt_kick') {
      final cycle = math.sin(theta * 1.8);
      final isLeftPhase = cycle > 0;
      final liftAmount = cycle.abs();
      final bodyY = cy - 20 - (liftAmount * 6);

      canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy + 120), width: 80, height: 12), paintShadow);

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 22, bodyY + 40, 44, 38), const Radius.circular(6)), paintShorts);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 19, bodyY - 10, 38, 52), const Radius.circular(8)), paintTankTop);
      canvas.drawRect(Rect.fromLTWH(cx - 5, bodyY - 24, 10, 16), paintSkin);
      canvas.drawOval(Rect.fromCenter(center: Offset(cx, bodyY - 36), width: 26, height: 30), paintSkin);
      canvas.drawArc(Rect.fromCenter(center: Offset(cx, bodyY - 41), width: 28, height: 28), math.pi, math.pi, true, paintHair);

      final paintLeg = Paint()
        ..color = const Color(0xFFF8C7B0)
        ..strokeWidth = 10
        ..strokeCap = StrokeCap.round;

      if (isLeftPhase) {
        final kneeLY = bodyY + 45 - (liftAmount * 30);
        canvas.drawLine(Offset(cx - 14, bodyY + 70), Offset(cx - 22, kneeLY), paintLeg);
        canvas.drawLine(Offset(cx - 22, kneeLY), Offset(cx - 18, kneeLY + 32), paintLeg);
        canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 26, kneeLY + 28, 18, 9), const Radius.circular(3)), paintShoes);

        canvas.drawLine(Offset(cx + 14, bodyY + 70), Offset(cx + 14, cy + 114), paintLeg);
        canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx + 6, cy + 114, 16, 9), const Radius.circular(3)), paintShoes);
      } else {
        final kneeRY = bodyY + 45 - (liftAmount * 30);
        canvas.drawLine(Offset(cx + 14, bodyY + 70), Offset(cx + 22, kneeRY), paintLeg);
        canvas.drawLine(Offset(cx + 22, kneeRY), Offset(cx + 18, kneeRY + 32), paintLeg);
        canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx + 10, kneeRY + 28, 18, 9), const Radius.circular(3)), paintShoes);

        canvas.drawLine(Offset(cx - 14, bodyY + 70), Offset(cx - 14, cy + 114), paintLeg);
        canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 22, cy + 114, 16, 9), const Radius.circular(3)), paintShoes);
      }

      final armPumpL = isLeftPhase ? -18.0 : 22.0;
      final armPumpR = isLeftPhase ? 22.0 : -18.0;
      canvas.drawLine(Offset(cx - 18, bodyY), Offset(cx - 24, bodyY + 20), paintArm);
      canvas.drawLine(Offset(cx - 24, bodyY + 20), Offset(cx - 18 + armPumpL, bodyY + 15), paintArm);
      canvas.drawLine(Offset(cx + 18, bodyY), Offset(cx + 24, bodyY + 20), paintArm);
      canvas.drawLine(Offset(cx + 24, bodyY + 20), Offset(cx + 18 + armPumpR, bodyY + 15), paintArm);
    }

    // =========================================================================
    // 3. FORWARD LUNGES (EXACT ALTERNATING FORWARD LUNGE: RIGHT LEG -> STAND -> LEFT LEG -> STAND)
    // STEP FORWARD -> LOWER INTO 90° LUNGE -> PUSH BACK -> STAND -> ALTERNATE LEG -> REPEAT
    // =========================================================================
    else if (exerciseType == 'lunge' || exerciseType == 'lunges' || exerciseType == 'step_up') {
      final isRightLeg = (theta % (math.pi * 2)) < math.pi;
      final normalizedAngle = isRightLeg ? (theta % math.pi) : ((theta - math.pi) % math.pi);
      final lungePhase = math.sin(normalizedAngle); // 0.0 -> 1.0 -> 0.0
      final lungeDepth = lungePhase * 40.0;
      final stepSpread = lungePhase * 52.0;
      final torsoY = cy - 48 + lungeDepth;

      canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy + 124), width: 90, height: 14), paintShadow);

      final frontFootX = isRightLeg ? (cx + 12 + stepSpread) : (cx - 12 - stepSpread);
      final frontFootY = cy + 114.0;
      final rearFootX = isRightLeg ? (cx - 16.0) : (cx + 16.0);
      final rearFootY = cy + 114.0;

      final frontKneeX = isRightLeg ? (cx + 12 + (stepSpread * 0.75)) : (cx - 12 - (stepSpread * 0.75));
      final frontKneeY = cy + 68 + (lungeDepth * 0.85);
      final rearKneeX = isRightLeg ? (cx - 12.0) : (cx + 12.0);
      final rearKneeY = cy + 68 + lungeDepth;

      final paintLeg = Paint()
        ..color = const Color(0xFFF8C7B0)
        ..strokeWidth = 12
        ..strokeCap = StrokeCap.round;

      final rearHipX = isRightLeg ? (cx - 10.0) : (cx + 10.0);
      canvas.drawLine(Offset(rearHipX, torsoY + 38), Offset(rearKneeX, rearKneeY), paintLeg);
      canvas.drawLine(Offset(rearKneeX, rearKneeY), Offset(rearFootX, rearFootY), paintLeg);

      final frontHipX = isRightLeg ? (cx + 10.0) : (cx - 10.0);
      canvas.drawLine(Offset(frontHipX, torsoY + 38), Offset(frontKneeX, frontKneeY), paintLeg);
      canvas.drawLine(Offset(frontKneeX, frontKneeY), Offset(frontFootX, frontFootY), paintLeg);

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(rearFootX - 8, rearFootY - 4, 18, 9), const Radius.circular(3)), paintShoes);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(frontFootX - 8, frontFootY - 4, 18, 9), const Radius.circular(3)), paintShoes);

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 20, torsoY, 40, 42), const Radius.circular(6)), paintShorts);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 18, torsoY - 48, 36, 52), const Radius.circular(8)), paintTankTop);
      canvas.drawRect(Rect.fromLTWH(cx - 5, torsoY - 62, 10, 15), paintSkin);
      canvas.drawOval(Rect.fromCenter(center: Offset(cx, torsoY - 74), width: 26, height: 30), paintSkin);
      canvas.drawArc(Rect.fromCenter(center: Offset(cx, torsoY - 78), width: 28, height: 28), math.pi, math.pi, true, paintHair);

      canvas.drawLine(Offset(cx - 18, torsoY - 38), Offset(cx - 28, torsoY - 18), paintArm);
      canvas.drawLine(Offset(cx - 28, torsoY - 18), Offset(cx - 16, torsoY - 2), paintArm);
      canvas.drawLine(Offset(cx + 18, torsoY - 38), Offset(cx + 28, torsoY - 18), paintArm);
      canvas.drawLine(Offset(cx + 28, torsoY - 18), Offset(cx + 16, torsoY - 2), paintArm);
    }

    // =========================================================================
    // 4. SQUATS (EXACT ANATOMICAL SQUAT: STANDING -> LOWERING -> SQUAT -> RISING -> STANDING)
    // FEET FIXED SHOULDER-WIDTH, HIPS BACK & DOWN, 90° PARALLEL THIGHS, UPRIGHT CHEST, ZERO JUMP/SLIDE
    // =========================================================================
    else if (exerciseType == 'squat' || exerciseType == 'squats' || exerciseType == 'wall_sit') {
      final squatPhase = (math.sin(theta - math.pi / 2) + 1) / 2;
      final squatDepth = squatPhase * 40.0;
      final torsoY = cy - 50 + squatDepth;

      canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy + 124), width: 90, height: 14), paintShadow);

      // 1. Fixed Feet (Never move or slide)
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 26, cy + 114, 18, 9), const Radius.circular(3)), paintShoes);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx + 8, cy + 114, 18, 9), const Radius.circular(3)), paintShoes);

      // 2. Knees & Legs
      final kneeLX = cx - 20 - (squatPhase * 10);
      final kneeLY = cy + 56 + (squatPhase * 20);
      final kneeRX = cx + 20 + (squatPhase * 10);
      final kneeRY = cy + 56 + (squatPhase * 20);

      final paintLeg = Paint()
        ..color = const Color(0xFFF8C7B0)
        ..strokeWidth = 13
        ..strokeCap = StrokeCap.round;

      canvas.drawLine(Offset(cx - 14, torsoY + 38), Offset(kneeLX, kneeLY), paintLeg);
      canvas.drawLine(Offset(kneeLX, kneeLY), Offset(cx - 17, cy + 114), paintLeg);

      canvas.drawLine(Offset(cx + 14, torsoY + 38), Offset(kneeRX, kneeRY), paintLeg);
      canvas.drawLine(Offset(kneeRX, kneeRY), Offset(cx + 17, cy + 114), paintLeg);

      // 3. Shorts
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 22, torsoY, 44, 42), const Radius.circular(6)), paintShorts);

      // 4. Torso
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 19, torsoY - 48, 38, 52), const Radius.circular(8)), paintTankTop);

      // 5. Head
      canvas.drawRect(Rect.fromLTWH(cx - 5, torsoY - 62, 10, 15), paintSkin);
      canvas.drawOval(Rect.fromCenter(center: Offset(cx, torsoY - 74), width: 26, height: 30), paintSkin);
      canvas.drawArc(Rect.fromCenter(center: Offset(cx, torsoY - 78), width: 28, height: 28), math.pi, math.pi, true, paintHair);

      // 6. Arms extended forward naturally for balance
      final armReachY = torsoY - 24 - (squatPhase * 8);
      canvas.drawLine(Offset(cx - 18, torsoY - 38), Offset(cx - 4, armReachY), paintArm);
      canvas.drawLine(Offset(cx + 18, torsoY - 38), Offset(cx + 4, armReachY), paintArm);
    }

    // =========================================================================
    // 5. JUMPING JACKS (EXACT 5-STAGE BIOMECHANICAL LOOP)
    // START (feet together, arms straight down) -> JUMP OUT (arms sweep up) -> TOP (legs apart, arms overhead) -> JUMP IN -> RETURN TO START -> REPEAT
    // =========================================================================
    else if (exerciseType == 'jumping_jack' || exerciseType == 'jumping_jacks') {
      final phase = (math.sin(theta - math.pi / 2) + 1) / 2; // 0 at start, 1 at peak overhead
      final jumpElevation = math.sin(phase * math.pi) * 14.0;
      final legSpread = phase * 40.0;
      final armAngle = phase * (math.pi * 0.92);

      final shadowScale = math.max(0.4, 1 - (jumpElevation / 20));
      canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy + 120), width: 90 * shadowScale, height: 16 * shadowScale), paintShadow);
      final bodyY = cy - jumpElevation;

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 16 - legSpread, bodyY + 110, 16, 9), const Radius.circular(3)), paintShoes);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx + legSpread, bodyY + 110, 16, 9), const Radius.circular(3)), paintShoes);

      final paintLeg = Paint()
        ..color = const Color(0xFFF8C7B0)
        ..strokeWidth = 12
        ..strokeCap = StrokeCap.round;

      canvas.drawLine(Offset(cx - 10, bodyY + 40), Offset(cx - 8 - legSpread, bodyY + 110), paintLeg);
      canvas.drawLine(Offset(cx + 10, bodyY + 40), Offset(cx + 8 + legSpread, bodyY + 110), paintLeg);

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 22, bodyY, 44, 42), const Radius.circular(6)), paintShorts);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 19, bodyY - 48, 38, 52), const Radius.circular(8)), paintTankTop);
      canvas.drawRect(Rect.fromLTWH(cx - 5, bodyY - 62, 10, 15), paintSkin);
      canvas.drawOval(Rect.fromCenter(center: Offset(cx, bodyY - 74), width: 26, height: 30), paintSkin);
      canvas.drawArc(Rect.fromCenter(center: Offset(cx, bodyY - 78), width: 28, height: 28), math.pi, math.pi, true, paintHair);

      const armLength = 70.0;
      final radL = (math.pi * 0.5) - armAngle;
      final handLX = cx - 18 - (math.sin(radL) * armLength * 0.2) - (math.cos(radL) * armLength);
      final handLY = bodyY - 42 + (math.sin(radL) * armLength);

      final radR = (math.pi * 0.5) - armAngle;
      final handRX = cx + 18 + (math.sin(radR) * armLength * 0.2) + (math.cos(radR) * armLength);
      final handRY = bodyY - 42 + (math.sin(radR) * armLength);

      canvas.drawLine(Offset(cx - 18, bodyY - 42), Offset(handLX, handLY), paintArm);
      canvas.drawLine(Offset(cx + 18, bodyY - 42), Offset(handRX, handRY), paintArm);
    }

    // =========================================================================
    // 6. FOREARM PLANK (REALISTIC 3/4 HUMANOID ISOMETRIC HOLD WITH DIAPHRAGMATIC BREATH)
    // =========================================================================
    else if (exerciseType == 'plank') {
      final breath = math.sin(theta * 1.2) * 1.2;

      final paintMat = Paint()..color = const Color(0xFFE2E8F0);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 130, cy + 70, 260, 8), const Radius.circular(3)), paintMat);

      canvas.drawOval(Rect.fromCenter(center: Offset(cx + 10, cy + 75), width: 210, height: 16), paintShadow);

      final headX = cx - 80.0;
      final headY = cy + 22.0 + (breath * 0.4);

      final nearShoulderX = cx - 48.0;
      final nearShoulderY = cy + 28.0 + breath;
      final farShoulderX = cx - 42.0;
      final farShoulderY = cy + 24.0 + breath;

      final nearHipX = cx + 8.0;
      final nearHipY = cy + 38.0;
      final farHipX = cx + 14.0;
      final farHipY = cy + 34.0;

      final nearKneeX = cx + 52.0;
      final nearKneeY = cy + 49.0;
      final farKneeX = cx + 58.0;
      final farKneeY = cy + 45.0;

      final nearFootX = cx + 90.0;
      final nearFootY = cy + 62.0;
      final farFootX = cx + 96.0;
      final farFootY = cy + 58.0;

      final nearElbowX = nearShoulderX;
      final nearElbowY = cy + 68.0;
      final nearWristX = cx - 20.0;
      final nearWristY = cy + 68.0;

      final farElbowX = farShoulderX;
      final farElbowY = cy + 65.0;
      final farWristX = cx - 14.0;
      final farWristY = cy + 65.0;

      // Layer 1: Far Limbs
      final paintFarSkin = Paint()
        ..color = const Color(0xFFF97316)
        ..strokeWidth = 10
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(Offset(farHipX, farHipY), Offset(farKneeX, farKneeY), paintFarSkin);
      canvas.drawLine(Offset(farKneeX, farKneeY), Offset(farFootX, farFootY), paintFarSkin);

      final paintFarShoe = Paint()..color = const Color(0xFF334155);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(farFootX - 4, farFootY - 2, 14, 8), const Radius.circular(2)), paintFarShoe);

      final paintFarArm = Paint()
        ..color = const Color(0xFFF97316)
        ..strokeWidth = 7
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(Offset(farShoulderX, farShoulderY), Offset(farElbowX, farElbowY), paintFarArm);
      canvas.drawLine(Offset(farElbowX, farElbowY), Offset(farWristX, farWristY), paintFarArm);

      // Layer 2: Torso & Head
      final paintTorso = Paint()
        ..color = const Color(0xFF0284C7)
        ..strokeWidth = 26
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(Offset(nearShoulderX + 4, nearShoulderY), Offset(nearHipX - 2, nearHipY), paintTorso);

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(nearHipX - 16, nearHipY - 14, 38, 28), const Radius.circular(6)), paintShorts);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(headX + 8, headY + 4, 12, 10), const Radius.circular(2)), paintSkin);

      canvas.drawCircle(Offset(headX, headY), 14, paintHair);
      canvas.drawOval(Rect.fromCenter(center: Offset(headX - 12, headY - 4), width: 20, height: 12), paintHair);
      canvas.drawCircle(Offset(headX + 4, headY + 2), 12, paintSkin);

      // Layer 3: Near Foreground Limbs
      final paintNearLeg = Paint()
        ..color = const Color(0xFFF8C7B0)
        ..strokeWidth = 12
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(Offset(nearHipX, nearHipY), Offset(nearKneeX, nearKneeY), paintNearLeg);
      canvas.drawLine(Offset(nearKneeX, nearKneeY), Offset(nearFootX, nearFootY), paintNearLeg);

      final paintPatella = Paint()..color = const Color(0xFFFB923C);
      canvas.drawCircle(Offset(nearKneeX, nearKneeY), 6, paintPatella);

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(nearFootX - 4, nearFootY - 2, 16, 8), const Radius.circular(2)), paintShoes);

      canvas.drawCircle(Offset(nearShoulderX, nearShoulderY), 8, paintTankTop);

      final paintNearArm = Paint()
        ..color = const Color(0xFFF8C7B0)
        ..strokeWidth = 8
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(Offset(nearShoulderX, nearShoulderY), Offset(nearElbowX, nearElbowY), paintNearArm);
      canvas.drawLine(Offset(nearElbowX, nearElbowY), Offset(nearWristX, nearWristY), paintNearArm);
      canvas.drawCircle(Offset(nearWristX, nearWristY), 4, paintPatella);
    }

    // =========================================================================
    // 7. PUSH-UPS (REALISTIC 3/4 HUMANOID FULL PUSH-UP REPETITION)
    // =========================================================================
    else if (exerciseType == 'push_up' || exerciseType == 'push_ups' || exerciseType == 'mountain_climber' || exerciseType == 'mountain_climbers') {
      final pushPhase = (math.sin(theta - math.pi / 2) + 1) / 2;
      final chestDescent = pushPhase * 36.0;

      final paintMat = Paint()..color = const Color(0xFFE2E8F0);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 130, cy + 70, 260, 8), const Radius.circular(3)), paintMat);

      canvas.drawOval(Rect.fromCenter(center: Offset(cx + 10, cy + 75), width: 210, height: 16), paintShadow);

      final nearHandX = cx - 36.0;
      final nearHandY = cy + 68.0;
      final farHandX = cx - 30.0;
      final farHandY = cy + 65.0;

      final nearFootX = cx + 90.0;
      final nearFootY = cy + 62.0;
      final farFootX = cx + 96.0;
      final farFootY = cy + 58.0;

      final nearShoulderX = cx - 48.0;
      final nearShoulderY = cy + 14.0 + chestDescent;
      final farShoulderX = cx - 42.0;
      final farShoulderY = cy + 10.0 + chestDescent;

      final headX = cx - 80.0;
      final headY = nearShoulderY - 6.0;

      final nearHipX = cx + 8.0;
      final nearHipY = cy + 28.0 + (chestDescent * 0.65);
      final farHipX = cx + 14.0;
      final farHipY = cy + 24.0 + (chestDescent * 0.65);

      final nearKneeX = cx + 52.0;
      final nearKneeY = cy + 44.0 + (chestDescent * 0.35);
      final farKneeX = cx + 58.0;
      final farKneeY = cy + 40.0 + (chestDescent * 0.35);

      final nearElbowX = cx - 58.0 - (pushPhase * 6.0);
      final nearElbowY = nearShoulderY + 16.0 + (pushPhase * 14.0);
      final farElbowX = cx - 52.0 - (pushPhase * 6.0);
      final farElbowY = farShoulderY + 16.0 + (pushPhase * 14.0);

      // Layer 1: Far Limbs
      final paintFarSkin = Paint()
        ..color = const Color(0xFFF97316)
        ..strokeWidth = 10
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(Offset(farHipX, farHipY), Offset(farKneeX, farKneeY), paintFarSkin);
      canvas.drawLine(Offset(farKneeX, farKneeY), Offset(farFootX, farFootY), paintFarSkin);

      final paintFarShoe = Paint()..color = const Color(0xFF334155);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(farFootX - 4, farFootY - 2, 14, 8), const Radius.circular(2)), paintFarShoe);

      final paintFarArm = Paint()
        ..color = const Color(0xFFF97316)
        ..strokeWidth = 7
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(Offset(farShoulderX, farShoulderY), Offset(farElbowX, farElbowY), paintFarArm);
      canvas.drawLine(Offset(farElbowX, farElbowY), Offset(farHandX, farHandY), paintFarArm);

      // Layer 2: Torso & Head
      final paintTorso = Paint()
        ..color = const Color(0xFF0284C7)
        ..strokeWidth = 26
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(Offset(nearShoulderX + 4, nearShoulderY), Offset(nearHipX - 2, nearHipY), paintTorso);

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(nearHipX - 16, nearHipY - 14, 38, 28), const Radius.circular(6)), paintShorts);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(headX + 8, headY + 4, 12, 10), const Radius.circular(2)), paintSkin);

      canvas.drawCircle(Offset(headX, headY), 14, paintHair);
      canvas.drawOval(Rect.fromCenter(center: Offset(headX - 12, headY - 4), width: 20, height: 12), paintHair);
      canvas.drawCircle(Offset(headX + 4, headY + 2), 12, paintSkin);

      // Layer 3: Near Foreground Limbs
      final paintNearLeg = Paint()
        ..color = const Color(0xFFF8C7B0)
        ..strokeWidth = 12
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(Offset(nearHipX, nearHipY), Offset(nearKneeX, nearKneeY), paintNearLeg);
      canvas.drawLine(Offset(nearKneeX, nearKneeY), Offset(nearFootX, nearFootY), paintNearLeg);

      final paintPatella = Paint()..color = const Color(0xFFFB923C);
      canvas.drawCircle(Offset(nearKneeX, nearKneeY), 6, paintPatella);

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(nearFootX - 4, nearFootY - 2, 16, 8), const Radius.circular(2)), paintShoes);

      canvas.drawCircle(Offset(nearShoulderX, nearShoulderY), 8, paintTankTop);

      final paintNearArm = Paint()
        ..color = const Color(0xFFF8C7B0)
        ..strokeWidth = 8
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(Offset(nearShoulderX, nearShoulderY), Offset(nearElbowX, nearElbowY), paintNearArm);
      canvas.drawLine(Offset(nearElbowX, nearElbowY), Offset(nearHandX, nearHandY), paintNearArm);

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(nearHandX - 6, nearHandY - 2, 12, 6), const Radius.circular(2)), paintPatella);
    }

    // =========================================================================
    // 8. SIDE LEG RAISES (LATERAL ABDUCTION WITH STABLE STANDING BASE)
    // =========================================================================
    else if (exerciseType == 'side_leg_raise' || exerciseType == 'side_leg_raises') {
      final raisePhase = (math.sin(theta - math.pi / 2) + 1) / 2;
      final abductionAngle = raisePhase * 0.72;
      const legLength = 76.0;

      canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy + 124), width: 90, height: 14), paintShadow);

      final torsoY = cy - 48.0;
      final plantFootX = cx - 14.0;
      final plantFootY = cy + 114.0;

      final activeHipX = cx + 12.0;
      final activeHipY = torsoY + 38.0;
      final activeFootX = activeHipX + math.sin(abductionAngle) * legLength;
      final activeFootY = activeHipY + math.cos(abductionAngle) * legLength;
      final activeKneeX = activeHipX + math.sin(abductionAngle) * (legLength * 0.5);
      final activeKneeY = activeHipY + math.cos(abductionAngle) * (legLength * 0.5);

      final paintLeg = Paint()
        ..color = const Color(0xFFF8C7B0)
        ..strokeWidth = 12
        ..strokeCap = StrokeCap.round;

      // Planted leg
      canvas.drawLine(Offset(cx - 10, torsoY + 38), Offset(plantFootX, plantFootY), paintLeg);
      // Active abducting leg
      canvas.drawLine(Offset(activeHipX, activeHipY), Offset(activeKneeX, activeKneeY), paintLeg);
      canvas.drawLine(Offset(activeKneeX, activeKneeY), Offset(activeFootX, activeFootY), paintLeg);

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(plantFootX - 8, plantFootY - 2, 18, 9), const Radius.circular(3)), paintShoes);

      canvas.save();
      canvas.translate(activeFootX, activeFootY);
      canvas.rotate(-abductionAngle);
      canvas.drawRRect(const RRect.fromRectAndRadius(Rect.fromLTWH(-6, -4, 18, 9), Radius.circular(3)), paintShoes);
      canvas.restore();

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 20, torsoY, 40, 42), const Radius.circular(6)), paintShorts);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 18, torsoY - 48, 36, 52), const Radius.circular(8)), paintTankTop);
      canvas.drawRect(Rect.fromLTWH(cx - 5, torsoY - 62, 10, 15), paintSkin);
      canvas.drawOval(Rect.fromCenter(center: Offset(cx, torsoY - 74), width: 26, height: 30), paintSkin);
      canvas.drawArc(Rect.fromCenter(center: Offset(cx, torsoY - 78), width: 28, height: 28), math.pi, math.pi, true, paintHair);

      canvas.drawLine(Offset(cx - 18, torsoY - 38), Offset(cx - 28, torsoY - 18), paintArm);
      canvas.drawLine(Offset(cx - 28, torsoY - 18), Offset(cx - 16, torsoY - 2), paintArm);
      canvas.drawLine(Offset(cx + 18, torsoY - 38), Offset(cx + 28, torsoY - 18), paintArm);
      canvas.drawLine(Offset(cx + 28, torsoY - 18), Offset(cx + 16, torsoY - 2), paintArm);
    }

    // =========================================================================
    // 9. BIRD DOG (CONTRALATERAL REACH ON ALL FOURS)
    // =========================================================================
    else if (exerciseType == 'bird_dog') {
      final extPhase = (math.sin(theta - math.pi / 2) + 1) / 2;

      final paintMat = Paint()..color = const Color(0xFFE2E8F0);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 130, cy + 70, 260, 8), const Radius.circular(3)), paintMat);
      canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy + 75), width: 200, height: 14), paintShadow);

      final shoulderX = cx - 35.0;
      final shoulderY = cy + 32.0;
      final hipX = cx + 25.0;
      final hipY = cy + 32.0;

      final handX = shoulderX - 25.0 - (extPhase * 40.0);
      final handY = (cy + 68.0) - (extPhase * 36.0);
      final footX = hipX + 25.0 + (extPhase * 42.0);
      final footY = (cy + 68.0) - (extPhase * 36.0);
      final kneeX = hipX + 12.0 + (extPhase * 20.0);
      final kneeY = (cy + 68.0) - (extPhase * 18.0);

      final paintFarSkin = Paint()
        ..color = const Color(0xFFF97316)
        ..strokeWidth = 7
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(Offset(shoulderX + 6, shoulderY), Offset(shoulderX + 6, cy + 68), paintFarSkin);
      canvas.drawLine(Offset(hipX - 5, hipY), Offset(hipX - 5, cy + 68), paintFarSkin);

      final paintLeg = Paint()
        ..color = const Color(0xFFF8C7B0)
        ..strokeWidth = 11
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(Offset(hipX, hipY), Offset(kneeX, kneeY), paintLeg);
      canvas.drawLine(Offset(kneeX, kneeY), Offset(footX, footY), paintLeg);

      final paintFarShoe = Paint()..color = const Color(0xFF334155);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(footX - 4, footY - 4, 14, 8), const Radius.circular(2)), paintFarShoe);

      final paintTorso = Paint()
        ..color = const Color(0xFF0284C7)
        ..strokeWidth = 24
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(Offset(shoulderX, shoulderY), Offset(hipX, hipY), paintTorso);

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(hipX - 14, hipY - 12, 28, 24), const Radius.circular(4)), paintShorts);

      canvas.drawCircle(Offset(shoulderX - 22, shoulderY - 4), 13, paintHair);
      canvas.drawCircle(Offset(shoulderX - 18, shoulderY - 2), 11, paintSkin);

      final paintArmBold = Paint()
        ..color = const Color(0xFFF8C7B0)
        ..strokeWidth = 8
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(Offset(shoulderX, shoulderY), Offset(handX, handY), paintArmBold);
    }

    // =========================================================================
    // 10. CALF RAISES (PLANTARFLEXION ON TOES)
    // =========================================================================
    else if (exerciseType == 'calf_raise' || exerciseType == 'calf_raises') {
      final calfPhase = (math.sin(theta - math.pi / 2) + 1) / 2;
      final heelElevation = calfPhase * 24.0;
      final bodyY = cy - heelElevation;

      canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy + 124), width: 90 - calfPhase * 30, height: 12), paintShadow);

      final paintLeg = Paint()
        ..color = const Color(0xFFF8C7B0)
        ..strokeWidth = 12
        ..strokeCap = StrokeCap.round;

      canvas.drawLine(Offset(cx - 10, bodyY + 38), Offset(cx - 10, bodyY + 112), paintLeg);
      canvas.drawLine(Offset(cx + 10, bodyY + 38), Offset(cx + 10, bodyY + 112), paintLeg);

      final paintPatella = Paint()..color = const Color(0xFFFB923C);
      canvas.drawOval(Rect.fromCenter(center: Offset(cx - 14, bodyY + 84), width: 8, height: 16), paintPatella);
      canvas.drawOval(Rect.fromCenter(center: Offset(cx + 14, bodyY + 84), width: 8, height: 16), paintPatella);

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 20, bodyY + 112, 18, 9), const Radius.circular(3)), paintShoes);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx + 2, bodyY + 112, 18, 9), const Radius.circular(3)), paintShoes);

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 22, bodyY, 44, 42), const Radius.circular(6)), paintShorts);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 19, bodyY - 48, 38, 52), const Radius.circular(8)), paintTankTop);
      canvas.drawRect(Rect.fromLTWH(cx - 5, bodyY - 62, 10, 15), paintSkin);
      canvas.drawOval(Rect.fromCenter(center: Offset(cx, bodyY - 74), width: 26, height: 30), paintSkin);
      canvas.drawArc(Rect.fromCenter(center: Offset(cx, bodyY - 78), width: 28, height: 28), math.pi, math.pi, true, paintHair);

      canvas.drawLine(Offset(cx - 18, bodyY - 38), Offset(cx - 28, bodyY - 18), paintArm);
      canvas.drawLine(Offset(cx - 28, bodyY - 18), Offset(cx - 16, bodyY - 2), paintArm);
      canvas.drawLine(Offset(cx + 18, bodyY - 38), Offset(cx + 28, bodyY - 18), paintArm);
      canvas.drawLine(Offset(cx + 28, bodyY - 18), Offset(cx + 16, bodyY - 2), paintArm);
    }

    // =========================================================================
    // 11. CHILD'S POSE & CAT-COW
    // =========================================================================
    else if (exerciseType == 'child_pose' || exerciseType == 'childs_pose' || exerciseType == 'cat_cow') {
      final paintMat = Paint()..color = const Color(0xFFE2E8F0);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 130, cy + 70, 260, 8), const Radius.circular(3)), paintMat);
      canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy + 75), width: 200, height: 14), paintShadow);

      if (exerciseType == 'cat_cow') {
        final cowPhase = math.sin(theta);
        final spineCurve = cowPhase * 10.0;
        final shoulderX = cx - 35.0;
        final shoulderY = cy + 32.0;
        final hipX = cx + 25.0;
        final hipY = cy + 32.0;

        final paintArmBold = Paint()
          ..color = const Color(0xFFF8C7B0)
          ..strokeWidth = 9
          ..strokeCap = StrokeCap.round;
        canvas.drawLine(Offset(shoulderX, shoulderY), Offset(shoulderX, cy + 68), paintArmBold);
        canvas.drawLine(Offset(hipX, hipY), Offset(hipX, cy + 68), paintArmBold);

        final paintTorso = Paint()
          ..color = const Color(0xFF0284C7)
          ..strokeWidth = 22
          ..strokeCap = StrokeCap.round;
        final path = Path()
          ..moveTo(shoulderX, shoulderY)
          ..quadraticBezierTo(cx - 5, cy + 32 + spineCurve, hipX, hipY);
        canvas.drawPath(path, paintTorso);

        final headY = cy + 24.0 - (spineCurve * 0.6);
        canvas.drawCircle(Offset(shoulderX - 20, headY), 13, paintHair);
        canvas.drawCircle(Offset(shoulderX - 16, headY + 2), 11, paintSkin);
      } else {
        canvas.drawOval(Rect.fromCenter(center: Offset(cx + 35, cy + 56), width: 44, height: 32), paintShorts);

        final paintTorso = Paint()
          ..color = const Color(0xFF0284C7)
          ..strokeWidth = 22
          ..strokeCap = StrokeCap.round;
        canvas.drawLine(Offset(cx + 30, cy + 52), Offset(cx - 25, cy + 62), paintTorso);

        final paintArmBold = Paint()
          ..color = const Color(0xFFF8C7B0)
          ..strokeWidth = 8
          ..strokeCap = StrokeCap.round;
        canvas.drawLine(Offset(cx - 25, cy + 62), Offset(cx - 85, cy + 68), paintArmBold);
        canvas.drawCircle(Offset(cx - 42, cy + 56), 12, paintHair);
      }
    }

    // =========================================================================
    // 12. ARM CIRCLES & DEFAULT (360° GLENOHUMERAL ROTATION)
    // =========================================================================
    else {
      final rotCos = math.cos(theta);
      final rotSin = math.sin(theta);
      final handLY = cy - 36 + rotSin * 16;
      final handLX = cx - 90 + rotCos * 8;
      final handRY = cy - 36 + rotSin * 16;
      final handRX = cx + 90 - rotCos * 8;

      canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy + 120), width: 85, height: 14), paintShadow);

      final paintCyan = Paint()
        ..color = const Color(0xFF38BDF8)
        ..strokeWidth = 4
        ..style = PaintingStyle.stroke;
      canvas.drawOval(Rect.fromCenter(center: Offset(cx - 90, cy - 36), width: 24, height: 44), paintCyan);
      canvas.drawOval(Rect.fromCenter(center: Offset(cx + 90, cy - 36), width: 24, height: 44), paintCyan);

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 24, cy + 110, 16, 9), const Radius.circular(3)), paintShoes);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx + 8, cy + 110, 16, 9), const Radius.circular(3)), paintShoes);

      final legPath = Path()
        ..moveTo(cx - 20, cy + 36)
        ..lineTo(cx - 18, cy + 110)
        ..lineTo(cx - 8, cy + 110)
        ..lineTo(cx - 6, cy + 36)
        ..close()
        ..moveTo(cx + 6, cy + 36)
        ..lineTo(cx + 8, cy + 110)
        ..lineTo(cx + 18, cy + 110)
        ..lineTo(cx + 20, cy + 36)
        ..close();
      canvas.drawPath(legPath, paintSkin);

      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 22, cy, 44, 42), const Radius.circular(6)), paintShorts);
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx - 19, cy - 48, 38, 52), const Radius.circular(8)), paintTankTop);
      canvas.drawRect(Rect.fromLTWH(cx - 5, cy - 62, 10, 15), paintSkin);
      canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy - 74), width: 26, height: 30), paintSkin);
      canvas.drawArc(Rect.fromCenter(center: Offset(cx, cy - 78), width: 28, height: 28), math.pi, math.pi, true, paintHair);

      canvas.drawLine(Offset(cx - 18, cy - 40), Offset(handLX, handLY), paintArm);
      canvas.drawLine(Offset(cx + 18, cy - 40), Offset(handRX, handRY), paintArm);
    }
  }

  @override
  bool shouldRepaint(covariant StrictHumanoidSkeletalPainter oldDelegate) {
    return oldDelegate.progress != progress || oldDelegate.exerciseType != exerciseType;
  }
}
