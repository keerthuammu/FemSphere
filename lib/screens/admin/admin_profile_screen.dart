import 'package:flutter/material.dart';
import '../../core/app_theme.dart';

class AdminProfileScreen extends StatelessWidget {
  const AdminProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('🛡️ Superuser Governance & Audit'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.borderPurple),
              ),
              child: const Row(
                children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: Color(0xFFEDE9FE),
                    child: Icon(Icons.security, size: 30, color: Color(0xFF6366F1)),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('System Administrator', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
                        Text('admin@femsphere.health', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                        SizedBox(height: 4),
                        Text('Role: Superuser (Tier 0 Full Root Access)', style: TextStyle(fontSize: 11, color: Color(0xFF6366F1), fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            const Text('🔍 System Security & Audit Log', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
            const SizedBox(height: 12),

            _buildAuditItem('Physician Verified', 'Dr. Sarah Jenkins approved (MD-892401)', 'Today, 10:14 AM', Icons.verified),
            _buildAuditItem('Security Telemetry', 'Encrypted TLS 1.3 key rotation completed', 'Today, 04:00 AM', Icons.lock),
            _buildAuditItem('Database Backup', 'PostgreSQL cluster snapshot verified healthy', 'Yesterday, 11:59 PM', Icons.storage),
            _buildAuditItem('User Status Update', 'Account suspended for policy violation', 'Sep 19, 03:22 PM', Icons.block),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildAuditItem(String title, String details, String time, IconData icon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderPurple),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 16,
            backgroundColor: const Color(0xFFEDE9FE),
            child: Icon(icon, size: 16, color: const Color(0xFF6366F1)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                Text(details, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
              ],
            ),
          ),
          Text(time, style: const TextStyle(fontSize: 10, color: AppTheme.textMuted)),
        ],
      ),
    );
  }
}
