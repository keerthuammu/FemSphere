import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../models/dependent_model.dart';
import '../../services/api_service.dart';

class DependentsScreen extends StatefulWidget {
  final ValueChanged<DependentModel>? onSelectDependent;

  const DependentsScreen({super.key, this.onSelectDependent});

  @override
  State<DependentsScreen> createState() => _DependentsScreenState();
}

class _DependentsScreenState extends State<DependentsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  bool _isLoading = true;
  String? _errorMessage;

  List<dynamic> _incomingRequests = [];
  List<dynamic> _activeConnections = [];
  List<DependentModel> _legacyDependents = [];

  String? _requestingCategoryKey;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadAllData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadAllData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final results = await Future.wait([
        ApiService.getIncomingConnectionsData().catchError((_) => <String, dynamic>{}),
        ApiService.getDependents().catchError((_) => <dynamic>[]),
      ]);

      if (!mounted) return;

      final incomingData = results[0] as Map<String, dynamic>;
      final depsRaw = results[1] as List<dynamic>;

      final pending = (incomingData['pendingRequests'] as List<dynamic>?) ?? [];
      final active = (incomingData['activeConnections'] as List<dynamic>?) ?? [];

      // Legacy dependents
      final List<DependentModel> deps = [];
      for (var item in depsRaw) {
        if (item is Map<String, dynamic>) {
          deps.add(DependentModel.fromJson(item));
        }
      }

      setState(() {
        _incomingRequests = pending;
        _activeConnections = active;
        _legacyDependents = deps;
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Failed to load connections: $e';
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _handleAccept(int connectionId, String userName) async {
    try {
      final res = await ApiService.acceptConnection(connectionId);
      if (mounted) {
        if (res['success'] == true) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Connected with $userName! In accordance with privacy rules, the user will now review data-sharing permissions.'),
              backgroundColor: const Color(0xFF10B981),
              duration: const Duration(seconds: 4),
            ),
          );
          await _loadAllData();
          _tabController.animateTo(1);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(res['message'] ?? 'Failed to accept request.'), backgroundColor: Colors.red),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _handleReject(int connectionId, String userName) async {
    try {
      final res = await ApiService.rejectConnection(connectionId);
      if (mounted) {
        if (res['success'] == true) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Declined request from $userName.'),
              backgroundColor: Colors.orange.shade800,
            ),
          );
          await _loadAllData();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(res['message'] ?? 'Failed to decline request.'), backgroundColor: Colors.red),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _handleRequestCategory(int connectionId, String category, String categoryLabel) async {
    setState(() => _requestingCategoryKey = '$connectionId-$category');
    try {
      final res = await ApiService.requestCategoryAccess(connectionId, category);
      if (mounted) {
        if (res['success'] == true) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Requested access to $categoryLabel. The care recipient has been notified.'),
              backgroundColor: const Color(0xFF936DA2),
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(res['message'] ?? 'Failed to request category access.'), backgroundColor: Colors.red),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error requesting category: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _requestingCategoryKey = null);
      }
    }
  }

  void _showPermittedDataModal(Map<String, dynamic> user) async {
    final connectionId = int.tryParse(user['id']?.toString() ?? user['connection_id']?.toString() ?? '0') ?? 0;
    final userName = user['senderName'] ?? user['name'] ?? user['user_name'] ?? 'Care Recipient';
    final consentStatus = user['consent_status'] ?? 'awaiting_consent';

    if (consentStatus == 'awaiting_consent') {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('$userName has not yet approved data-sharing consent. Records will appear once they approve.'),
          backgroundColor: Colors.amber.shade800,
        ),
      );
      return;
    }

    if (consentStatus == 'consent_revoked') {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Data sharing has been revoked by $userName.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return FutureBuilder<Map<String, dynamic>>(
              future: ApiService.getConnectionSharedData(connectionId),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const SizedBox(
                    height: 350,
                    child: Center(child: CircularProgressIndicator(color: Color(0xFF936DA2))),
                  );
                }

                if (snapshot.hasError || snapshot.data?['success'] != true) {
                  final msg = snapshot.data?['message'] ?? 'Unable to retrieve shared health records.';
                  return Container(
                    padding: const EdgeInsets.all(24),
                    height: 250,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.lock_rounded, size: 40, color: Colors.amber),
                        const SizedBox(height: 12),
                        Text(msg, textAlign: TextAlign.center, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF936DA2), foregroundColor: Colors.white),
                          onPressed: () => Navigator.pop(ctx),
                          child: const Text('Close'),
                        ),
                      ],
                    ),
                  );
                }

                final sharedHealth = snapshot.data?['sharedHealth'] ?? {};
                final data = (sharedHealth['data'] ?? snapshot.data?['data']) as Map<String, dynamic>? ?? {};
                final perms = (sharedHealth['permissions'] ?? snapshot.data?['permissions']) as Map<String, dynamic>? ?? {};

                return Container(
                  height: MediaQuery.of(context).size.height * 0.85,
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Container(
                          width: 40,
                          height: 4,
                          decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
                        ),
                      ),
                      const SizedBox(height: 14),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '$userName\'s Health Telemetry',
                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                              ),
                              const Text('Filtered strictly by patient consent (Read-Only)', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                            ],
                          ),
                          IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(color: const Color(0xFFEDE4F7), borderRadius: BorderRadius.circular(12)),
                        child: const Row(
                          children: [
                            Icon(Icons.shield_outlined, color: Color(0xFF936DA2), size: 16),
                            SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                'Read-only access: Caregivers cannot edit or modify care recipient records.',
                                style: TextStyle(fontSize: 11, color: Color(0xFF581C87)),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Divider(height: 20),
                      Expanded(
                        child: ListView(
                          children: [
                            // 1. Daily Activities
                            _buildPermittedCategoryCard(
                              title: 'Daily Activities & Vitals',
                              icon: Icons.directions_walk_rounded,
                              isPermitted: perms['daily_activities'] == true,
                              isRequesting: _requestingCategoryKey == '$connectionId-daily_activities',
                              content: perms['daily_activities'] == true
                                  ? (data['daily_activities'] is Map)
                                      ? 'Steps: ${(data['daily_activities'] as Map)['steps'] ?? '--'} · Sleep: ${(data['daily_activities'] as Map)['sleep_hours'] ?? '--'}h · Water: ${(data['daily_activities'] as Map)['water_liters'] ?? '--'}L · Heart Rate: ${(data['daily_activities'] as Map)['heart_rate'] ?? '--'} bpm'
                                      : 'Activity telemetry active.'
                                  : 'Access not granted by patient consent.',
                              onRequestAccess: () => _handleRequestCategory(connectionId, 'daily_activities', 'Daily Activities'),
                            ),

                            // 2. Menstrual Cycle
                            _buildPermittedCategoryCard(
                              title: 'Menstrual Cycle & Ovulation',
                              icon: Icons.water_drop_rounded,
                              isPermitted: perms['menstrual_cycle'] == true,
                              isRequesting: _requestingCategoryKey == '$connectionId-menstrual_cycle',
                              content: perms['menstrual_cycle'] == true
                                  ? (data['menstrual_cycle'] is Map)
                                      ? 'Phase: ${(data['menstrual_cycle'] as Map)['cyclePhase'] ?? 'Active'} · Day ${(data['menstrual_cycle'] as Map)['cycleDay'] ?? '--'} · Next: ${(data['menstrual_cycle'] as Map)['nextExpectedPeriod'] ?? 'Upcoming'}'
                                      : 'Cycle telemetry active.'
                                  : 'Access not granted by patient consent.',
                              onRequestAccess: () => _handleRequestCategory(connectionId, 'menstrual_cycle', 'Menstrual Cycle'),
                            ),

                            // 3. Symptoms & Health Notes
                            _buildPermittedCategoryCard(
                              title: 'Daily Symptoms & Health Notes',
                              icon: Icons.favorite_border_rounded,
                              isPermitted: perms['symptoms_notes'] == true,
                              isRequesting: _requestingCategoryKey == '$connectionId-symptoms_notes',
                              content: perms['symptoms_notes'] == true
                                  ? (data['symptoms_notes'] is List && (data['symptoms_notes'] as List).isNotEmpty)
                                      ? '${(data['symptoms_notes'] as List).length} symptom logs recorded. Latest: ${(data['symptoms_notes'] as List).first['symptom_name'] ?? 'Logged'}'
                                      : 'No recent symptom logs.'
                                  : 'Access not granted by patient consent.',
                              onRequestAccess: () => _handleRequestCategory(connectionId, 'symptoms_notes', 'Symptoms & Notes'),
                            ),

                            // 4. Medical Records
                            _buildPermittedCategoryCard(
                              title: 'Medical Records & Vault',
                              icon: Icons.folder_shared_rounded,
                              isPermitted: perms['medical_records'] == true,
                              isRequesting: _requestingCategoryKey == '$connectionId-medical_records',
                              content: perms['medical_records'] == true
                                  ? (data['medical_records'] is List && (data['medical_records'] as List).isNotEmpty)
                                      ? '${(data['medical_records'] as List).length} clinical documents uploaded.'
                                      : 'No clinical documents uploaded.'
                                  : 'Access not granted by patient consent.',
                              onRequestAccess: () => _handleRequestCategory(connectionId, 'medical_records', 'Medical Records'),
                            ),

                            // 5. Appointments
                            _buildPermittedCategoryCard(
                              title: 'Doctor Appointments',
                              icon: Icons.calendar_month_rounded,
                              isPermitted: perms['appointments'] == true,
                              isRequesting: _requestingCategoryKey == '$connectionId-appointments',
                              content: perms['appointments'] == true
                                  ? (data['appointments'] is List && (data['appointments'] as List).isNotEmpty)
                                      ? '${(data['appointments'] as List).length} scheduled consultations.'
                                      : 'No consultations scheduled.'
                                  : 'Access not granted by patient consent.',
                              onRequestAccess: () => _handleRequestCategory(connectionId, 'appointments', 'Doctor Appointments'),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            );
          },
        );
      },
    );
  }

  Widget _buildPermittedCategoryCard({
    required String title,
    required IconData icon,
    required bool isPermitted,
    bool isRequesting = false,
    required String content,
    required VoidCallback onRequestAccess,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isPermitted ? Colors.white : const Color(0xFFFAF8FC),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isPermitted ? const Color(0xFFD1FAE5) : const Color(0xFFEDE8F5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: isPermitted ? const Color(0xFFDCFCE7) : Colors.grey.shade200,
                child: Icon(icon, size: 16, color: isPermitted ? const Color(0xFF15803D) : Colors.grey),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textDark)),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: isPermitted ? const Color(0xFFDCFCE7) : const Color(0xFFFEE2E2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  isPermitted ? 'Authorized' : 'Locked',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: isPermitted ? const Color(0xFF15803D) : Colors.red,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(content, style: TextStyle(fontSize: 12, color: isPermitted ? const Color(0xFF4B5563) : Colors.grey.shade600)),
          if (!isPermitted) ...[
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.centerRight,
              child: TextButton.icon(
                icon: isRequesting
                    ? const SizedBox(width: 12, height: 12, child: CircularProgressIndicator(strokeWidth: 1.5, color: Color(0xFF936DA2)))
                    : const Icon(Icons.send_rounded, size: 13, color: Color(0xFF936DA2)),
                label: const Text('Request Access', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF936DA2))),
                style: TextButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4)),
                onPressed: isRequesting ? null : onRequestAccess,
              ),
            ),
          ],
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('Care Recipients & Companions', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0.5,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: Color(0xFF936DA2)),
            onPressed: _loadAllData,
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: const Color(0xFF936DA2),
          unselectedLabelColor: AppTheme.textMuted,
          indicatorColor: const Color(0xFF936DA2),
          indicatorWeight: 3,
          tabs: [
            Tab(
              icon: Badge(
                isLabelVisible: _incomingRequests.isNotEmpty,
                label: Text('${_incomingRequests.length}'),
                child: const Icon(Icons.notifications_active_rounded),
              ),
              text: 'Requests (${_incomingRequests.length})',
            ),
            Tab(
              icon: const Icon(Icons.people_alt_rounded),
              text: 'Active (${_activeConnections.length})',
            ),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF936DA2)))
          : _errorMessage != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.cloud_off, size: 48, color: Colors.grey),
                      const SizedBox(height: 12),
                      Text(_errorMessage!, style: const TextStyle(color: AppTheme.textMuted)),
                      const SizedBox(height: 16),
                      ElevatedButton(onPressed: _loadAllData, child: const Text('Retry')),
                    ],
                  ),
                )
              : TabBarView(
                  controller: _tabController,
                  children: [
                    _buildRequestsTab(),
                    _buildActiveTab(),
                  ],
                ),
    );
  }

  // ===========================================================================
  // TAB 1: INCOMING REQUESTS (Prompt Section 4)
  // ===========================================================================
  Widget _buildRequestsTab() {
    if (_incomingRequests.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(color: Color(0xFFEDE4F7), shape: BoxShape.circle),
                child: const Icon(Icons.mark_email_read_rounded, size: 48, color: Color(0xFF936DA2)),
              ),
              const SizedBox(height: 16),
              const Text('No Pending Requests', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
              const SizedBox(height: 8),
              const Text('When a female user sends you a companion connection request, it will appear here for your review.', textAlign: TextAlign.center, style: TextStyle(fontSize: 13, color: AppTheme.textMuted)),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _incomingRequests.length,
      itemBuilder: (context, index) {
        final req = _incomingRequests[index];
        final connectionId = int.tryParse(req['id'].toString()) ?? 0;
        final senderName = req['senderName'] ?? req['user_name'] ?? 'Care Recipient';
        final senderEmail = req['senderEmail'] ?? req['user_email'] ?? '';
        final relationship = req['relationship'] ?? 'Care Recipient';

        return Container(
          margin: const EdgeInsets.only(bottom: 14),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFFDE68A)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.03),
                blurRadius: 8,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: const Color(0xFFFEF3C7),
                    child: Text(
                      senderName.isNotEmpty ? senderName[0].toUpperCase() : 'U',
                      style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFB45309), fontSize: 16),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(senderName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textDark)),
                        if (senderEmail.isNotEmpty) Text(senderEmail, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: const Color(0xFFFEF3C7), borderRadius: BorderRadius.circular(12)),
                    child: const Text('Pending', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFB45309))),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(color: const Color(0xFFFAF8FC), borderRadius: BorderRadius.circular(10)),
                child: Row(
                  children: [
                    const Icon(Icons.favorite_outline_rounded, size: 16, color: Color(0xFF936DA2)),
                    const SizedBox(width: 8),
                    Text('Stated Relationship: $relationship', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF5A4B56))),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(color: const Color(0xFFFFFBEB), borderRadius: BorderRadius.circular(10)),
                child: const Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.info_outline, size: 15, color: Color(0xFFB45309)),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Acceptance links accounts only. The user will explicitly review and grant data-sharing consent before health records appear.',
                        style: TextStyle(fontSize: 11, color: Color(0xFF78350F), height: 1.3),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      icon: const Icon(Icons.close_rounded, size: 16, color: Colors.red),
                      label: const Text('Decline', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Colors.red),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                      onPressed: () => _handleReject(connectionId, senderName),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.check_rounded, size: 16),
                      label: const Text('Accept Connection', style: TextStyle(fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF936DA2),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        elevation: 0,
                      ),
                      onPressed: () => _handleAccept(connectionId, senderName),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  // ===========================================================================
  // TAB 2: ACTIVE CONNECTIONS & LEGACY PROFILES (Prompt Sections 5 & 8)
  // ===========================================================================
  Widget _buildActiveTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFFEDE4F7),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE9D5FF)),
          ),
          child: const Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(Icons.security_rounded, color: Color(0xFF936DA2), size: 20),
              SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Female users own and manage their accounts. You have access strictly to the health categories they have explicitly authorized.',
                  style: TextStyle(fontSize: 12, color: Color(0xFF581C87), height: 1.35),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        if (_activeConnections.isNotEmpty) ...[
          const Text('Connected Care Recipients', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
          const SizedBox(height: 10),
          ..._activeConnections.map((user) {
            final name = user['senderName'] ?? user['name'] ?? user['user_name'] ?? 'Care Recipient';
            final email = user['senderEmail'] ?? user['email'] ?? user['user_email'] ?? '';
            final rel = user['relationship'] ?? 'Care Recipient';
            final consentStatus = user['consent_status'] ?? 'awaiting_consent';
            final isAwaitingConsent = consentStatus == 'awaiting_consent';
            final isRevoked = consentStatus == 'consent_revoked';

            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: isAwaitingConsent ? const Color(0xFFFDE68A) : const Color(0xFFD1FAE5)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.03),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 20,
                        backgroundColor: isAwaitingConsent ? const Color(0xFFFEF3C7) : const Color(0xFFDCFCE7),
                        child: Text(
                          name.isNotEmpty ? name[0].toUpperCase() : 'U',
                          style: TextStyle(fontWeight: FontWeight.bold, color: isAwaitingConsent ? const Color(0xFFB45309) : const Color(0xFF15803D)),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textDark)),
                            Text('$rel • $email', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: isAwaitingConsent
                              ? const Color(0xFFFEF3C7)
                              : isRevoked
                                  ? const Color(0xFFFEE2E2)
                                  : const Color(0xFFDCFCE7),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          isAwaitingConsent ? 'Awaiting Consent' : isRevoked ? 'Revoked' : 'Active',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: isAwaitingConsent ? const Color(0xFFB45309) : isRevoked ? Colors.red : const Color(0xFF15803D),
                          ),
                        ),
                      ),
                    ],
                  ),
                  if (isAwaitingConsent) ...[
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(color: const Color(0xFFFFFBEB), borderRadius: BorderRadius.circular(10)),
                      child: const Row(
                        children: [
                          Icon(Icons.lock_clock_rounded, size: 15, color: Color(0xFFB45309)),
                          SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'The care recipient has connected with you but has not yet approved data-sharing permissions. Protected records will appear here as soon as they authorize consent.',
                              style: TextStyle(fontSize: 11, color: Color(0xFF78350F)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.visibility_rounded, size: 16),
                      label: Text(isAwaitingConsent ? 'Awaiting Patient Consent' : 'View Authorized Health Telemetry'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF936DA2),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                      onPressed: isAwaitingConsent ? null : () => _showPermittedDataModal(user),
                    ),
                  ),
                ],
              ),
            );
          }),
          const SizedBox(height: 20),
        ],

        // Legacy Dependents (read-only)
        if (_legacyDependents.isNotEmpty) ...[
          const Text('Family Records (Read-Only)', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
          const SizedBox(height: 10),
          ..._legacyDependents.map((dep) {
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE5E7EB)),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 18,
                    backgroundColor: const Color(0xFFEDE4F7),
                    child: Text(
                      dep.fullName.isNotEmpty ? dep.fullName[0].toUpperCase() : 'D',
                      style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF936DA2)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(dep.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textDark)),
                        Text('${dep.relationship} • DOB: ${dep.dob} • Blood: ${dep.bloodGroup}', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }),
        ],

        if (_activeConnections.isEmpty && _legacyDependents.isEmpty)
          Center(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                children: [
                  Icon(Icons.people_outline, size: 48, color: Colors.grey.shade400),
                  const SizedBox(height: 12),
                  const Text('No Active Care Recipients', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                  const SizedBox(height: 6),
                  const Text('When a female user links your account and you accept, she will appear here.', textAlign: TextAlign.center, style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                ],
              ),
            ),
          ),
      ],
    );
  }
}
