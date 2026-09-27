import 'package:flutter/material.dart';
import '../../core/app_theme.dart';

class PartnerSyncScreen extends StatefulWidget {
  const PartnerSyncScreen({super.key});

  @override
  State<PartnerSyncScreen> createState() => _PartnerSyncScreenState();
}

class _PartnerSyncScreenState extends State<PartnerSyncScreen> {
  bool _isPartnerConnected = true;
  final String _partnerName = 'Alex Mercer';
  final String _partnerPairCode = 'FEM-9428-SYNC';

  bool _shareCyclePhase = true;
  bool _shareFertileWindow = true;
  bool _shareMoodInsights = true;
  bool _shareEmergencyAlerts = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('💞 Partner Health Sync'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFEC4899), Color(0xFFF43F5E)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const CircleAvatar(
                            radius: 20,
                            backgroundColor: Colors.white,
                            child: Icon(Icons.favorite, color: Color(0xFFF43F5E), size: 20),
                          ),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _isPartnerConnected ? 'Linked with $_partnerName' : 'No Partner Connected',
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                              Text(
                                _isPartnerConnected ? 'Bi-directional health sync active' : 'Pair to share wellness insights',
                                style: const TextStyle(color: Colors.white70, fontSize: 12),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          _isPartnerConnected ? 'Active' : 'Unpaired',
                          style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Pairing Sync Code', style: TextStyle(color: Colors.white70, fontSize: 11)),
                            Text(_partnerPairCode, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                          ],
                        ),
                        IconButton(
                          icon: const Icon(Icons.copy, color: Colors.white, size: 20),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Copied pairing code: $_partnerPairCode')),
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Privacy & Granular Sharing Permissions
            const Text(
              '🔒 Granular Sharing Permissions',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
            ),
            const SizedBox(height: 8),
            const Text(
              'You have 100% control over which biological events and metrics your partner can view in real-time.',
              style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
            ),
            const SizedBox(height: 16),

            _buildToggleCard(
              title: 'Menstrual Cycle Phase & Calendar',
              description: 'Allows partner to understand energy levels, follicular/luteal transitions, and period start projections.',
              icon: Icons.water_drop,
              value: _shareCyclePhase,
              onChanged: (val) => setState(() => _shareCyclePhase = val),
            ),
            _buildToggleCard(
              title: 'Fertile Window & Ovulation Alerts',
              description: 'Notifies partner during estimated 6-day fertile window for family planning or contraception awareness.',
              icon: Icons.child_friendly,
              value: _shareFertileWindow,
              onChanged: (val) => setState(() => _shareFertileWindow = val),
            ),
            _buildToggleCard(
              title: 'Mood & Daily Wellness Insights',
              description: 'Shares daily mood emojis and fatigue indicators with suggested partner support tips.',
              icon: Icons.mood,
              value: _shareMoodInsights,
              onChanged: (val) => setState(() => _shareMoodInsights = val),
            ),
            _buildToggleCard(
              title: 'Emergency Health & SOS Alerts',
              description: 'Automatically alerts partner with GPS location if severe pain or high fever is logged.',
              icon: Icons.emergency,
              value: _shareEmergencyAlerts,
              onChanged: (val) => setState(() => _shareEmergencyAlerts = val),
            ),

            const SizedBox(height: 24),

            // Action Buttons
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                icon: const Icon(Icons.link_off, color: Colors.red),
                label: const Text('Disconnect Partner Link', style: TextStyle(color: Colors.red)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.red),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: () {
                  setState(() => _isPartnerConnected = !_isPartnerConnected);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(_isPartnerConnected ? 'Partner connected!' : 'Partner disconnected.')),
                  );
                },
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildToggleCard({
    required String title,
    required String description,
    required IconData icon,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppTheme.borderPurple),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            radius: 18,
            backgroundColor: const Color(0xFFFCE7F3),
            child: Icon(icon, size: 18, color: const Color(0xFFEC4899)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textDark)),
                const SizedBox(height: 4),
                Text(description, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
              ],
            ),
          ),
          Switch(
            value: value,
            activeColor: const Color(0xFFEC4899),
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
}
