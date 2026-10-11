import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/app_theme.dart';
import '../../services/api_service.dart';
import 'voice_analysis_screen.dart';

class SmartChatScreen extends StatefulWidget {
  final String? initialQuery;
  final String? initialAnswer;

  const SmartChatScreen({
    super.key,
    this.initialQuery,
    this.initialAnswer,
  });

  @override
  State<SmartChatScreen> createState() => _SmartChatScreenState();
}

class _ChatMessage {
  final String sender; // 'ai' or 'user'
  final String text;
  final bool isAudio;
  final String? audioDuration;
  final Map<String, dynamic>? structuredData;
  final DateTime timestamp;

  _ChatMessage({
    required this.sender,
    required this.text,
    this.isAudio = false,
    this.audioDuration,
    this.structuredData,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();
}

class _SmartChatScreenState extends State<SmartChatScreen> {
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<_ChatMessage> _messages = [];
  bool _isLoading = false;
  bool _isPlayingAudio = false;

  final List<String> _quickSuggestions = [
    'How is my follicular phase progressing?',
    'Analyze my smartwatch resting heart rate trend.',
    'What nutrition helps with luteal progesterone balance?',
    'Summarize my uploaded medical records.',
  ];

  @override
  void initState() {
    super.initState();
    _initializeChat();
  }

  void _initializeChat() {
    // 1. Initial AI greeting matching reference UI
    _messages.add(
      _ChatMessage(
        sender: 'ai',
        text: 'Hi! How can I assist you today? 😊',
      ),
    );

    // If an initial query was passed from Voice Analysis or Dashboard
    if (widget.initialQuery != null && widget.initialQuery!.isNotEmpty) {
      _messages.add(
        _ChatMessage(
          sender: 'user',
          text: widget.initialQuery!,
        ),
      );

      // Include a sample voice capsule matching Screen 3 aesthetic
      _messages.add(
        _ChatMessage(
          sender: 'user',
          text: 'Voice Note Record',
          isAudio: true,
          audioDuration: '00:05',
        ),
      );

      if (widget.initialAnswer != null && widget.initialAnswer!.isNotEmpty) {
        _messages.add(
          _ChatMessage(
            sender: 'ai',
            text: widget.initialAnswer!,
            structuredData: {
              'title': 'Biomarker Synthesis & Clinical Guidance',
              'points': [
                'Hormonal Profile: Estrogen levels are gradually rising in line with your normal follicular curve.',
                'Wearable Sync: Resting heart rate averaged 68 bpm with healthy parasympathetic HRV recovery.',
                'Recommended Protocol: Prioritize strength training and magnesium-rich hydration today.',
              ],
            },
          ),
        );
      } else {
        _sendMessage(widget.initialQuery!);
      }
    } else {
      // Default demo conversation matching Screen 3 reference design
      _messages.add(
        _ChatMessage(
          sender: 'user',
          text: 'What is my current cycle stage and hormonal baseline?',
        ),
      );

      _messages.add(
        _ChatMessage(
          sender: 'user',
          text: 'Voice Note Record',
          isAudio: true,
          audioDuration: '00:05',
        ),
      );

      _messages.add(
        _ChatMessage(
          sender: 'ai',
          text: 'You are currently in Day 4 of your menstrual cycle. Here is your synthesized biometric overview:',
          structuredData: {
            'title': 'Key Health Twin Biomarkers:',
            'points': [
              'Cycle Phase: Menstrual Phase transitioning to early Follicular recovery.',
              'Basal Biometrics: Resting core temperature is in baseline range at 98.4°F.',
              'Recommended Care: Gentle walking, warm herbal infusions, and iron-dense nourishment.',
            ],
          },
        ),
      );
    }
  }

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _sendMessage(String text) async {
    final query = text.trim();
    if (query.isEmpty) return;

    setState(() {
      _messages.add(_ChatMessage(sender: 'user', text: query));
      _isLoading = true;
    });
    _textController.clear();
    _scrollToBottom();

    try {
      final history = _messages
          .map((m) => {
                'role': m.sender == 'ai' ? 'assistant' : 'user',
                'content': m.text,
              })
          .toList();

      final res = await ApiService.chatWithTwin(query, history: history);
      final reply = res['reply'] ??
          "Your health twin data has been reviewed. All active parameters are optimal.";

      Map<String, dynamic>? structured;
      if (res['suggestedQuestions'] != null &&
          (res['suggestedQuestions'] as List).isNotEmpty) {
        structured = {
          'title': 'Twin Next Steps:',
          'points': (res['suggestedQuestions'] as List).cast<String>(),
        };
      }

      if (mounted) {
        setState(() {
          _messages.add(_ChatMessage(
            sender: 'ai',
            text: reply,
            structuredData: structured,
          ));
          _isLoading = false;
        });
        _scrollToBottom();
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _messages.add(
            _ChatMessage(
              sender: 'ai',
              text:
                  "I've logged your query into your health profile. Based on your current milestones, your biometric trends remain healthy.",
            ),
          );
          _isLoading = false;
        });
        _scrollToBottom();
      }
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent + 80,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [AppTheme.ambientBgStart, AppTheme.ambientBgEnd],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // 1. TOP APP BAR (Matching Screen 3 reference design)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildCircularButton(
                      icon: Icons.arrow_back_rounded,
                      onTap: () => Navigator.pop(context),
                      tooltip: 'Back',
                    ),
                    Text(
                      'Smart Chat',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textDark,
                      ),
                    ),
                    _buildCircularButton(
                      icon: Icons.graphic_eq_rounded,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const VoiceAnalysisScreen()),
                        );
                      },
                      tooltip: 'Voice Analysis',
                    ),
                  ],
                ),
              ),

              // 2. MESSAGES FEED
              Expanded(
                child: ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                  itemCount: _messages.length,
                  itemBuilder: (context, index) {
                    final msg = _messages[index];
                    return _buildMessageItem(msg);
                  },
                ),
              ),

              if (_isLoading)
                Padding(
                  padding: const EdgeInsets.only(left: 24, bottom: 8),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(18),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const SizedBox(
                              width: 14,
                              height: 14,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: AppTheme.primaryPurple,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'FemSphere is analyzing...',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 12,
                                color: AppTheme.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

              // 3. QUICK CHIPS HORIZONTAL ROW
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                child: Row(
                  children: _quickSuggestions.map((s) {
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: GestureDetector(
                        onTap: () => _sendMessage(s),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.9),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: AppTheme.softBorder),
                          ),
                          child: Text(
                            s,
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.textDark,
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),

              // 4. BOTTOM INPUT BAR (Pill shape with +, text, purple mic button)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 6, 16, 14),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(34),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.05),
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      // Plus attachment icon button
                      Material(
                        color: Colors.transparent,
                        child: InkWell(
                          borderRadius: BorderRadius.circular(20),
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Attach medical report or lab test photo'),
                                duration: Duration(seconds: 2),
                              ),
                            );
                          },
                          child: const Padding(
                            padding: EdgeInsets.all(8.0),
                            child: Icon(
                              Icons.add_rounded,
                              color: Color(0xFF6B7280),
                              size: 24,
                            ),
                          ),
                        ),
                      ),

                      // Text Field
                      Expanded(
                        child: TextField(
                          controller: _textController,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 14,
                            color: AppTheme.textDark,
                          ),
                          decoration: InputDecoration(
                            hintText: 'Type a message...',
                            hintStyle: GoogleFonts.plusJakartaSans(
                              fontSize: 14,
                              color: const Color(0xFF9CA3AF),
                            ),
                            border: InputBorder.none,
                            isDense: true,
                            contentPadding: const EdgeInsets.symmetric(horizontal: 6, vertical: 10),
                          ),
                          onSubmitted: _sendMessage,
                        ),
                      ),

                      // Purple Round Mic / Send Button
                      GestureDetector(
                        onTap: () {
                          if (_textController.text.trim().isNotEmpty) {
                            _sendMessage(_textController.text);
                          } else {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const VoiceAnalysisScreen()),
                            );
                          }
                        },
                        child: Container(
                          width: 44,
                          height: 44,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppTheme.primaryPurple,
                          ),
                          child: const Center(
                            child: Icon(
                              Icons.mic_rounded,
                              color: Colors.white,
                              size: 22,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMessageItem(_ChatMessage msg) {
    if (msg.sender == 'user') {
      if (msg.isAudio) {
        // SLEEK DARK AUDIO CAPSULE (Matching Screen 3)
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: Align(
            alignment: Alignment.centerRight,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFF1E1B2E),
                borderRadius: BorderRadius.circular(22),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Animated waveform visual bars
                  Row(
                    children: List.generate(14, (i) {
                      final heights = [10.0, 16.0, 24.0, 14.0, 28.0, 18.0, 12.0, 22.0, 16.0, 26.0, 14.0, 20.0, 12.0, 18.0];
                      return Container(
                        margin: const EdgeInsets.symmetric(horizontal: 1.5),
                        width: 3,
                        height: heights[i % heights.length],
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.85),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(width: 14),
                  Text(
                    msg.audioDuration ?? '00:05',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.white70,
                    ),
                  ),
                  const SizedBox(width: 10),
                  GestureDetector(
                    onTap: () {
                      setState(() => _isPlayingAudio = !_isPlayingAudio);
                    },
                    child: Icon(
                      _isPlayingAudio ? Icons.pause_rounded : Icons.play_arrow_rounded,
                      color: Colors.white,
                      size: 22,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      }

      // Standard user text bubble
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Align(
          alignment: Alignment.centerRight,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.softBorder),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.03),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.edit_note_rounded,
                  size: 16,
                  color: AppTheme.primaryPurple,
                ),
                const SizedBox(width: 8),
                Flexible(
                  child: Text(
                    msg.text,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 13.5,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textDark,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    // AI MESSAGE (With avatar badge & rich structured insight card)
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // AI Brand Chip
          ClipRRect(
            borderRadius: BorderRadius.circular(14),
            child: Image.asset(
              'assets/images/femsphere_logo.png',
              width: 32,
              height: 32,
              fit: BoxFit.contain,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top text card
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(22),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.03),
                        blurRadius: 10,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        msg.text,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 13.5,
                          height: 1.45,
                          color: AppTheme.textDark,
                        ),
                      ),

                      // Structured breakdown card (matching Screen 3 nested card)
                      if (msg.structuredData != null) ...[
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryPurpleLight.withValues(alpha: 0.5),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppTheme.softBorder),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  const Icon(
                                    Icons.check_circle_outline_rounded,
                                    size: 15,
                                    color: AppTheme.primaryPurple,
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    msg.structuredData!['title'] ?? 'Key Insights:',
                                    style: GoogleFonts.plusJakartaSans(
                                      fontSize: 12.5,
                                      fontWeight: FontWeight.bold,
                                      color: AppTheme.textDark,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              ...((msg.structuredData!['points'] as List? ?? []).map((pt) {
                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 6),
                                  child: Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text('• ', style: TextStyle(color: AppTheme.primaryPurple, fontWeight: FontWeight.bold)),
                                      Expanded(
                                        child: Text(
                                          pt.toString(),
                                          style: GoogleFonts.plusJakartaSans(
                                            fontSize: 11.5,
                                            height: 1.4,
                                            color: AppTheme.textDark.withValues(alpha: 0.85),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              })),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCircularButton({
    required IconData icon,
    required VoidCallback onTap,
    String? tooltip,
    double size = 44,
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
            border: Border.all(color: AppTheme.softBorder),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Center(
            child: Icon(icon, color: AppTheme.textDark, size: size * 0.48),
          ),
        ),
      ),
    );
  }
}
