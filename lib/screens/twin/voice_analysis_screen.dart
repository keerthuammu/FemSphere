import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/app_theme.dart';
import '../../services/api_service.dart';
import '../../widgets/twin/iridescent_sphere_widget.dart';
import 'smart_chat_screen.dart';

class VoiceAnalysisScreen extends StatefulWidget {
  final String? initialPrompt;

  const VoiceAnalysisScreen({super.key, this.initialPrompt});

  @override
  State<VoiceAnalysisScreen> createState() => _VoiceAnalysisScreenState();
}

class _VoiceAnalysisScreenState extends State<VoiceAnalysisScreen> {
  bool _isListening = true;
  bool _isProcessing = false;
  String _activeQueryText = 'What is my hormonal rhythm this week, and how should I adjust my nutrition?';
  int _activePromptIndex = 0;
  Timer? _promptRotationTimer;

  final List<String> _suggestedPrompts = [
    'What is my hormonal rhythm this week, and how should I adjust my nutrition?',
    'Analyze my smartwatch resting heart rate and sleep efficiency last night.',
    'Are there any clinical alerts from my latest blood test records?',
    'What follicular phase exercises will boost my energy today?',
  ];

  @override
  void initState() {
    super.initState();
    if (widget.initialPrompt != null && widget.initialPrompt!.isNotEmpty) {
      _activeQueryText = widget.initialPrompt!;
    } else {
      _promptRotationTimer = Timer.periodic(const Duration(seconds: 6), (timer) {
        if (mounted && _isListening && !_isProcessing) {
          setState(() {
            _activePromptIndex = (_activePromptIndex + 1) % _suggestedPrompts.length;
            _activeQueryText = _suggestedPrompts[_activePromptIndex];
          });
        }
      });
    }
  }

  @override
  void dispose() {
    _promptRotationTimer?.cancel();
    super.dispose();
  }

  void _toggleListening() {
    setState(() {
      _isListening = !_isListening;
    });
  }

  Future<void> _processVoiceQuery(String query) async {
    setState(() {
      _isProcessing = true;
      _activeQueryText = query;
    });

    try {
      final res = await ApiService.chatWithTwin(query);
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => SmartChatScreen(
              initialQuery: query,
              initialAnswer: res['reply'],
            ),
          ),
        );
      }
    } catch (_) {
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => SmartChatScreen(initialQuery: query),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFFCF4F5), Color(0xFFFDF5F6)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // 1. TOP APP BAR (Circular pill buttons)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Back button (white circular pill)
                    _buildCircularButton(
                      icon: Icons.arrow_back_rounded,
                      onTap: () => Navigator.pop(context),
                      tooltip: 'Back',
                    ),

                    // Title
                    Text(
                      'Voice Analysis',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textDark,
                      ),
                    ),

                    // Options Menu Button
                    _buildCircularButton(
                      icon: Icons.menu_rounded,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const SmartChatScreen()),
                        );
                      },
                      tooltip: 'Smart Chat',
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 12),

              // 2. STATUS INDICATOR ("Listening...")
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (_isListening) ...[
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: Color(0xFF936DA2),
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 8),
                  ],
                  Text(
                    _isProcessing
                        ? 'Synthesizing Health Twin...'
                        : (_isListening ? 'Listening...' : 'Paused'),
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: _isListening ? const Color(0xFF936DA2) : Colors.black45,
                    ),
                  ),
                ],
              ),

              const Spacer(),

              // 3. 3D IRIDESCENT FLUID ORB CENTERPIECE
              GestureDetector(
                onTap: () => _processVoiceQuery(_activeQueryText),
                child: Hero(
                  tag: 'twin_iridescent_orb',
                  child: IridescentSphereWidget(
                    size: 230,
                    isListening: _isListening,
                  ),
                ),
              ),

              const Spacer(),

              // 4. LIVE PROMPT TEXT (Clean, elegant, bold)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 400),
                  child: Text(
                    _activeQueryText,
                    key: ValueKey<String>(_activeQueryText),
                    textAlign: TextAlign.center,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 19,
                      fontWeight: FontWeight.w600,
                      height: 1.45,
                      color: AppTheme.textDark.withValues(alpha: 0.85),
                      letterSpacing: -0.3,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 18),

              // Quick query recommendation chips
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  children: _suggestedPrompts.map((p) {
                    final isCurrent = p == _activeQueryText;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: GestureDetector(
                        onTap: () => _processVoiceQuery(p),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(
                            color: isCurrent
                                ? AppTheme.primaryPurple.withValues(alpha: 0.15)
                                : Colors.white.withValues(alpha: 0.8),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isCurrent
                                  ? AppTheme.primaryPurple
                                  : AppTheme.softBorder,
                            ),
                          ),
                          child: Text(
                            p.length > 34 ? '${p.substring(0, 32)}…' : p,
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 11,
                              fontWeight: isCurrent ? FontWeight.bold : FontWeight.w600,
                              color: isCurrent ? const Color(0xFF936DA2) : AppTheme.textDark,
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),

              const Spacer(),

              // 5. BOTTOM CONTROLS (Pause, Center Mic, Close)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    // Pause/Resume button
                    _buildCircularButton(
                      size: 52,
                      icon: _isListening ? Icons.pause_rounded : Icons.play_arrow_rounded,
                      iconColor: AppTheme.textDark,
                      onTap: _toggleListening,
                      tooltip: _isListening ? 'Pause Listening' : 'Resume Listening',
                    ),

                    // Primary Pulsing Mic button
                    GestureDetector(
                      onTap: () => _processVoiceQuery(_activeQueryText),
                      child: Container(
                        width: 72,
                        height: 72,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFF936DA2),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF936DA2).withValues(alpha: 0.45),
                              blurRadius: 24,
                              spreadRadius: 4,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.mic_rounded,
                            color: Colors.white,
                            size: 32,
                          ),
                        ),
                      ),
                    ),

                    // Close button
                    _buildCircularButton(
                      size: 52,
                      icon: Icons.close_rounded,
                      iconColor: AppTheme.textDark,
                      onTap: () => Navigator.pop(context),
                      tooltip: 'Close',
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCircularButton({
    required IconData icon,
    required VoidCallback onTap,
    String? tooltip,
    double size = 46,
    Color iconColor = AppTheme.textDark,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(size / 2),
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.white,
            border: Border.all(color: const Color(0xFFF4DDE2)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Center(
            child: Icon(icon, color: iconColor, size: size * 0.48),
          ),
        ),
      ),
    );
  }
}
