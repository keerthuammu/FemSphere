import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../services/api_service.dart';

class PartnerSyncScreen extends StatefulWidget {
  const PartnerSyncScreen({super.key});

  @override
  State<PartnerSyncScreen> createState() => _PartnerSyncScreenState();
}

class _PartnerSyncScreenState extends State<PartnerSyncScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  bool _isLoading = true;

  // Search state
  final TextEditingController _searchController = TextEditingController();
  bool _isSearching = false;
  List<dynamic> _searchResults = [];
  Map<String, dynamic>? _selectedCompanion;

  // Relationship state
  final List<String> _relationshipOptions = const [
    'Parent',
    'Spouse or partner',
    'Sibling',
    'Other family member',
    'Friend',
    'Professional caregiver',
    'Other',
  ];
  String _selectedRelationship = 'Spouse or partner';
  final TextEditingController _customRelationshipController = TextEditingController();

  // Initial request permissions
  bool _reqDailyActivities = false;
  bool _reqMenstrualCycle = false;
  bool _reqSymptomsNotes = false;
  bool _reqMedicalRecords = false;
  bool _reqAppointments = false;

  // Categorized Connections lists
  List<dynamic> _pendingRequests = [];
  List<dynamic> _activeConnections = [];
  List<dynamic> _rejectedCancelled = [];
  List<dynamic> _revokedHistory = [];

  // Access History Audit Trail
  List<dynamic> _accessHistory = [];
  bool _isLoadingHistory = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _tabController.addListener(() {
      if (_tabController.index == 2 && !_tabController.indexIsChanging) {
        _loadAccessHistory();
      }
    });
    _loadConnections();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    _customRelationshipController.dispose();
    super.dispose();
  }

  Future<void> _loadConnections() async {
    setState(() => _isLoading = true);
    try {
      final data = await ApiService.getOutgoingConnectionsData();
      if (mounted) {
        setState(() {
          _pendingRequests = (data['pendingRequests'] as List<dynamic>?) ?? [];
          _activeConnections = (data['activeConnections'] as List<dynamic>?) ?? [];
          _rejectedCancelled = (data['rejectedCancelled'] as List<dynamic>?) ?? [];
          _revokedHistory = (data['revokedHistory'] as List<dynamic>?) ?? [];
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _loadAccessHistory() async {
    setState(() => _isLoadingHistory = true);
    try {
      final history = await ApiService.getAccessHistory();
      if (mounted) {
        setState(() {
          _accessHistory = history;
          _isLoadingHistory = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoadingHistory = false);
      }
    }
  }

  Future<void> _handleSearch() async {
    final query = _searchController.text.trim();
    if (query.length < 2) {
      _showMessage('Please enter at least 2 characters to search.', false);
      return;
    }

    setState(() {
      _isSearching = true;
      _searchResults = [];
      _selectedCompanion = null;
    });

    try {
      final results = await ApiService.searchCompanions(query);
      if (mounted) {
        setState(() {
          _searchResults = results;
          _isSearching = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isSearching = false);
        _showMessage('Search failed: $e', false);
      }
    }
  }

  Future<void> _handleSendRequest() async {
    if (_selectedCompanion == null) {
      _showMessage('Please search and select a companion first.', false);
      return;
    }

    final rel = _selectedRelationship == 'Other'
        ? _customRelationshipController.text.trim()
        : _selectedRelationship;

    if (rel.isEmpty) {
      _showMessage('Please enter your relationship with this companion.', false);
      return;
    }

    setState(() => _isLoading = true);

    try {
      final companionId = int.tryParse(_selectedCompanion!['id'].toString()) ?? 0;
      final permissions = {
        'daily_activities': _reqDailyActivities,
        'menstrual_cycle': _reqMenstrualCycle,
        'symptoms_notes': _reqSymptomsNotes,
        'medical_records': _reqMedicalRecords,
        'appointments': _reqAppointments,
      };

      final res = await ApiService.sendConnectionRequest(
        caregiverId: companionId,
        relationship: rel,
        permissions: permissions,
      );

      if (mounted) {
        if (res['success'] == true) {
          _showMessage('Connection request sent to ${_selectedCompanion!['name']}!', true);
          setState(() {
            _selectedCompanion = null;
            _searchResults = [];
            _searchController.clear();
            _customRelationshipController.clear();
            _reqDailyActivities = false;
            _reqMenstrualCycle = false;
            _reqSymptomsNotes = false;
            _reqMedicalRecords = false;
            _reqAppointments = false;
          });
          await _loadConnections();
          _tabController.animateTo(1); // switch to Connections tab
        } else {
          _showMessage(res['message'] ?? 'Failed to send request.', false);
          setState(() => _isLoading = false);
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        _showMessage('Error sending request: $e', false);
      }
    }
  }

  Future<void> _handleCancelRequest(int connectionId) async {
    try {
      final res = await ApiService.cancelConnection(connectionId);
      if (res['success'] == true) {
        _showMessage('Connection request cancelled.', true);
        await _loadConnections();
      } else {
        _showMessage(res['message'] ?? 'Failed to cancel request.', false);
      }
    } catch (e) {
      _showMessage('Error cancelling request: $e', false);
    }
  }

  Future<void> _handleRevokeConnection(int connectionId, String companionName) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: Colors.red, size: 28),
            SizedBox(width: 8),
            Text('Revoke Connection?', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Are you sure you want to completely stop sharing health data with $companionName?',
              style: const TextStyle(fontSize: 14, color: AppTheme.textDark),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFFEE2E2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text(
                '• They will immediately lose access to all shared health records.\n• Any active tokens or cached views will be invalidated.\n• Your original health records remain untouched.\n• This action will be recorded in your Access History.',
                style: TextStyle(fontSize: 12, color: Color(0xFF991B1B), height: 1.4),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Keep Connection', style: TextStyle(color: AppTheme.textMuted)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Confirm Revocation'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      try {
        final res = await ApiService.revokeConnection(connectionId);
        if (res['success'] == true) {
          _showMessage('Access revoked. Companion cannot view any data.', true);
          await _loadConnections();
        } else {
          _showMessage(res['message'] ?? 'Failed to revoke connection.', false);
        }
      } catch (e) {
        _showMessage('Error revoking connection: $e', false);
      }
    }
  }

  void _showConsentModal(Map<String, dynamic> conn) {
    final connectionId = int.tryParse(conn['id'].toString()) ?? 0;
    final companionName = conn['caregiver_name'] ?? conn['recipientName'] ?? 'Companion';

    // Current permissions
    final existingPerms = (conn['permissions'] is Map) ? Map<String, dynamic>.from(conn['permissions']) : {};

    bool pDaily = existingPerms['daily_activities'] == true;
    bool pMenstrual = existingPerms['menstrual_cycle'] == true;
    bool pSymptoms = existingPerms['symptoms_notes'] == true;
    bool pMedical = existingPerms['medical_records'] == true;
    bool pAppts = existingPerms['appointments'] == true;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Container(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
              height: MediaQuery.of(context).size.height * 0.85,
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
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Explicit Data-Sharing Consent',
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                            ),
                            Text(
                              'Grant or deny health data access for $companionName',
                              style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                            ),
                          ],
                        ),
                      ),
                      IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFAF5FF),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFE9D5FF)),
                    ),
                    child: const Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(Icons.shield_outlined, color: Color(0xFF936DA2), size: 18),
                        SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'FemSphere Privacy Protection: Permissions are not enabled by default. Only categories you explicitly check below will be accessible to this companion.',
                            style: TextStyle(fontSize: 11, color: Color(0xFF6B21A8), height: 1.3),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Expanded(
                    child: ListView(
                      children: [
                        _buildConsentCategoryTile(
                          title: 'Daily Activities & Vitals',
                          description: 'Water intake, steps, sleep, mood, and smartwatch telemetry.',
                          icon: Icons.directions_walk_rounded,
                          value: pDaily,
                          onChanged: (v) => setSheetState(() => pDaily = v ?? false),
                        ),
                        _buildConsentCategoryTile(
                          title: 'Menstrual Cycle & Ovulation',
                          description: 'Current cycle phase, expected period date, and fertility window.',
                          icon: Icons.water_drop_rounded,
                          value: pMenstrual,
                          onChanged: (v) => setSheetState(() => pMenstrual = v ?? false),
                        ),
                        _buildConsentCategoryTile(
                          title: 'Daily Symptoms & Health Notes',
                          description: 'Logged symptoms, severity levels, onset dates, and personal symptom notes.',
                          icon: Icons.favorite_border_rounded,
                          value: pSymptoms,
                          onChanged: (v) => setSheetState(() => pSymptoms = v ?? false),
                        ),
                        _buildConsentCategoryTile(
                          title: 'Medical Records & Vault',
                          description: 'Uploaded clinical documents, prescriptions, and lab test reports.',
                          icon: Icons.folder_shared_rounded,
                          value: pMedical,
                          onChanged: (v) => setSheetState(() => pMedical = v ?? false),
                        ),
                        _buildConsentCategoryTile(
                          title: 'Doctor Appointments',
                          description: 'Scheduled medical visits, doctor names, and clinic consultation times.',
                          icon: Icons.calendar_month_rounded,
                          value: pAppts,
                          onChanged: (v) => setSheetState(() => pAppts = v ?? false),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.check_circle_outline_rounded),
                      label: const Text('Approve Consent & Authorize Sharing', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF936DA2),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 1,
                      ),
                      onPressed: () async {
                        Navigator.pop(ctx);
                        final selectedPerms = {
                          'daily_activities': pDaily,
                          'menstrual_cycle': pMenstrual,
                          'symptoms_notes': pSymptoms,
                          'medical_records': pMedical,
                          'appointments': pAppts,
                        };
                        try {
                          final res = await ApiService.approveConsent(connectionId, selectedPerms);
                          if (res['success'] == true) {
                            _showMessage('Consent granted! Permitted categories are now live.', true);
                            await _loadConnections();
                          } else {
                            _showMessage(res['message'] ?? 'Failed to approve consent.', false);
                          }
                        } catch (e) {
                          _showMessage('Error approving consent: $e', false);
                        }
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showManagePermissionsModal(Map<String, dynamic> conn) {
    final connectionId = int.tryParse(conn['id'].toString()) ?? 0;
    final companionName = conn['caregiver_name'] ?? conn['recipientName'] ?? 'Companion';

    final existingPerms = (conn['permissions'] is Map) ? Map<String, dynamic>.from(conn['permissions']) : {};

    bool pDaily = existingPerms['daily_activities'] == true;
    bool pMenstrual = existingPerms['menstrual_cycle'] == true;
    bool pSymptoms = existingPerms['symptoms_notes'] == true;
    bool pMedical = existingPerms['medical_records'] == true;
    bool pAppts = existingPerms['appointments'] == true;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Container(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
              height: MediaQuery.of(context).size.height * 0.8,
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
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Manage Sharing Permissions',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                          ),
                          Text('Live permissions for $companionName', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                        ],
                      ),
                      IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                    ],
                  ),
                  const Divider(height: 20),
                  Expanded(
                    child: ListView(
                      children: [
                        _buildManageSwitchTile('Daily Activities & Vitals', 'Steps, sleep, hydration, and smartwatch vitals', pDaily, (v) => setSheetState(() => pDaily = v)),
                        _buildManageSwitchTile('Menstrual Cycle & Ovulation', 'Cycle phases, predicted onset, and fertile window', pMenstrual, (v) => setSheetState(() => pMenstrual = v)),
                        _buildManageSwitchTile('Daily Symptoms & Health Notes', 'Symptoms, severity notes, and logs', pSymptoms, (v) => setSheetState(() => pSymptoms = v)),
                        _buildManageSwitchTile('Medical Records & Lab Reports', 'Clinical documents, lab results, and prescriptions', pMedical, (v) => setSheetState(() => pMedical = v)),
                        _buildManageSwitchTile('Doctor Appointments', 'Scheduled consultations and appointment calendar', pAppts, (v) => setSheetState(() => pAppts = v)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF936DA2),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      onPressed: () async {
                        Navigator.pop(ctx);
                        final updated = {
                          'daily_activities': pDaily,
                          'menstrual_cycle': pMenstrual,
                          'symptoms_notes': pSymptoms,
                          'medical_records': pMedical,
                          'appointments': pAppts,
                        };
                        try {
                          final res = await ApiService.updateConnectionPermissions(connectionId, updated);
                          if (res['success'] == true) {
                            _showMessage('Permissions updated immediately.', true);
                            await _loadConnections();
                          } else {
                            _showMessage(res['message'] ?? 'Failed to update permissions.', false);
                          }
                        } catch (e) {
                          _showMessage('Error updating permissions: $e', false);
                        }
                      },
                      child: const Text('Save Permission Changes', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showMessage(String text, bool success) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(text),
        backgroundColor: success ? const Color(0xFF10B981) : Colors.red,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('Connections & Data Sharing', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0.5,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: Color(0xFF936DA2)),
            onPressed: () {
              _loadConnections();
              if (_tabController.index == 2) _loadAccessHistory();
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: const Color(0xFF936DA2),
          unselectedLabelColor: AppTheme.textMuted,
          indicatorColor: const Color(0xFF936DA2),
          indicatorWeight: 3,
          tabs: [
            const Tab(icon: Icon(Icons.person_add_alt_1_rounded), text: 'Connect New'),
            Tab(
              icon: Badge(
                isLabelVisible: _pendingRequests.isNotEmpty,
                label: Text('${_pendingRequests.length}'),
                child: const Icon(Icons.people_alt_rounded),
              ),
              text: 'Connections (${_activeConnections.length})',
            ),
            const Tab(icon: Icon(Icons.history_rounded), text: 'Access History'),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF936DA2)))
          : TabBarView(
              controller: _tabController,
              children: [
                _buildConnectNewTab(),
                _buildConnectionsTab(),
                _buildAccessHistoryTab(),
              ],
            ),
    );
  }

  // ===========================================================================
  // TAB 1: CONNECT NEW COMPANION / CAREGIVER
  // ===========================================================================
  Widget _buildConnectNewTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFEDE4F7), Color(0xFFFCE7F3)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFF4DDE2)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.security_rounded, color: Color(0xFF936DA2), size: 24),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'You Own & Control Your Health Data',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF201538)),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'FemSphere guarantees total patient ownership. Sending a request establishes a connection only. Protected health data is never shared without your explicit consent.',
                        style: TextStyle(fontSize: 12, color: Color(0xFF5A4B56), height: 1.35),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Search Field
          const Text('1. Search Companion or Caregiver', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Search by username or email...',
                    hintStyle: const TextStyle(fontSize: 13, color: AppTheme.textMuted),
                    prefixIcon: const Icon(Icons.search, color: Color(0xFF936DA2)),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, size: 18),
                            onPressed: () {
                              _searchController.clear();
                              setState(() => _searchResults = []);
                            },
                          )
                        : null,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF936DA2), width: 1.5)),
                    filled: true,
                    fillColor: Colors.white,
                  ),
                  onSubmitted: (_) => _handleSearch(),
                ),
              ),
              const SizedBox(width: 10),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF936DA2),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 15),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: _isSearching ? null : _handleSearch,
                child: _isSearching
                    ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Text('Find', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Search Results
          if (_searchResults.isNotEmpty) ...[
            const Text('Search Results:', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
            const SizedBox(height: 8),
            ..._searchResults.map((user) {
              final isSelected = _selectedCompanion != null && _selectedCompanion!['id'] == user['id'];
              final name = user['name'] ?? user['username'] ?? 'User';
              final email = user['email'] ?? '';
              final role = user['caregiver_type'] ?? user['role'] ?? 'Companion';

              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                decoration: BoxDecoration(
                  color: isSelected ? const Color(0xFFF3E8FF) : Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: isSelected ? const Color(0xFF936DA2) : const Color(0xFFE5E7EB)),
                ),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: isSelected ? const Color(0xFF936DA2) : const Color(0xFFEDE4F7),
                    child: Text(name.isNotEmpty ? name[0].toUpperCase() : 'U', style: TextStyle(color: isSelected ? Colors.white : const Color(0xFF936DA2), fontWeight: FontWeight.bold)),
                  ),
                  title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  subtitle: Text('$email • $role', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                  trailing: isSelected
                      ? const Icon(Icons.check_circle, color: Color(0xFF936DA2))
                      : OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Color(0xFF936DA2)),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          onPressed: () => setState(() => _selectedCompanion = user),
                          child: const Text('Select', style: TextStyle(fontSize: 12, color: Color(0xFF936DA2))),
                        ),
                ),
              );
            }),
            const SizedBox(height: 14),
          ],

          if (_selectedCompanion != null) ...[
            // Relationship Selector
            const Text('2. Your Relationship to This Companion', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: const Color(0xFFE5E7EB))),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  isExpanded: true,
                  value: _selectedRelationship,
                  items: _relationshipOptions.map((rel) => DropdownMenuItem(value: rel, child: Text(rel, style: const TextStyle(fontSize: 14)))).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedRelationship = val);
                  },
                ),
              ),
            ),
            if (_selectedRelationship == 'Other') ...[
              const SizedBox(height: 10),
              TextField(
                controller: _customRelationshipController,
                decoration: InputDecoration(
                  hintText: 'Enter custom relationship (e.g., Doula, Nurse)',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  filled: true,
                  fillColor: Colors.white,
                ),
              ),
            ],
            const SizedBox(height: 20),

            // Preliminary permission preferences
            const Text('3. Initial Requested Permissions (Optional)', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
            const SizedBox(height: 4),
            const Text('You will review and confirm these permissions when the companion accepts.', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
            const SizedBox(height: 10),

            _buildConsentCategoryTile(
              title: 'Daily Activities & Vitals',
              description: 'Step count, water intake, sleep telemetry',
              icon: Icons.directions_walk_rounded,
              value: _reqDailyActivities,
              onChanged: (v) => setState(() => _reqDailyActivities = v ?? false),
            ),
            _buildConsentCategoryTile(
              title: 'Menstrual Cycle & Ovulation',
              description: 'Cycle phase and period timing',
              icon: Icons.water_drop_rounded,
              value: _reqMenstrualCycle,
              onChanged: (v) => setState(() => _reqMenstrualCycle = v ?? false),
            ),
            _buildConsentCategoryTile(
              title: 'Daily Symptoms & Health Notes',
              description: 'Logged symptoms, severity, and notes',
              icon: Icons.favorite_border_rounded,
              value: _reqSymptomsNotes,
              onChanged: (v) => setState(() => _reqSymptomsNotes = v ?? false),
            ),
            _buildConsentCategoryTile(
              title: 'Medical Records & Vault',
              description: 'Prescriptions and lab records',
              icon: Icons.folder_shared_rounded,
              value: _reqMedicalRecords,
              onChanged: (v) => setState(() => _reqMedicalRecords = v ?? false),
            ),
            _buildConsentCategoryTile(
              title: 'Doctor Appointments',
              description: 'Upcoming clinic bookings and times',
              icon: Icons.calendar_month_rounded,
              value: _reqAppointments,
              onChanged: (v) => setState(() => _reqAppointments = v ?? false),
            ),
            const SizedBox(height: 20),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.send_rounded),
                label: const Text('Send Connection Request', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF936DA2),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 1,
                ),
                onPressed: _handleSendRequest,
              ),
            ),
            const SizedBox(height: 30),
          ],
        ],
      ),
    );
  }

  // ===========================================================================
  // TAB 2: CONNECTIONS (Pending, Active with Consent, History)
  // ===========================================================================
  Widget _buildConnectionsTab() {
    if (_pendingRequests.isEmpty && _activeConnections.isEmpty && _rejectedCancelled.isEmpty && _revokedHistory.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(color: Color(0xFFEDE4F7), shape: BoxShape.circle),
                child: const Icon(Icons.people_outline_rounded, size: 48, color: Color(0xFF936DA2)),
              ),
              const SizedBox(height: 16),
              const Text('No Connections Found', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
              const SizedBox(height: 8),
              const Text('Search for a companion or caregiver in the "Connect New" tab to establish your first connection.', textAlign: TextAlign.center, style: TextStyle(fontSize: 13, color: AppTheme.textMuted)),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                icon: const Icon(Icons.person_add_rounded),
                label: const Text('Find Companion'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF936DA2),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: () => _tabController.animateTo(0),
              ),
            ],
          ),
        ),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Pending Outgoing Requests
        if (_pendingRequests.isNotEmpty) ...[
          Row(
            children: [
              const Icon(Icons.hourglass_top_rounded, color: Color(0xFFD97706), size: 18),
              const SizedBox(width: 8),
              Text('Pending Outgoing Requests (${_pendingRequests.length})', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
            ],
          ),
          const SizedBox(height: 10),
          ..._pendingRequests.map((req) => _buildPendingRequestCard(req)),
          const SizedBox(height: 20),
        ],

        // Active Companions (Awaiting Consent vs Active Sharing)
        if (_activeConnections.isNotEmpty) ...[
          Row(
            children: [
              const Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 18),
              const SizedBox(width: 8),
              Text('Active Companions (${_activeConnections.length})', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
            ],
          ),
          const SizedBox(height: 10),
          ..._activeConnections.map((conn) => _buildActiveConnectionCard(conn)),
          const SizedBox(height: 20),
        ],

        // Revoked Connections
        if (_revokedHistory.isNotEmpty) ...[
          const Row(
            children: [
              Icon(Icons.link_off_rounded, color: Colors.red, size: 18),
              SizedBox(width: 8),
              Text('Revoked Connections', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
            ],
          ),
          const SizedBox(height: 10),
          ..._revokedHistory.map((item) => _buildHistoryCard(item, 'Revoked', Colors.red)),
          const SizedBox(height: 20),
        ],

        // Cancelled / Rejected Requests
        if (_rejectedCancelled.isNotEmpty) ...[
          const Row(
            children: [
              Icon(Icons.history_toggle_off_rounded, color: AppTheme.textMuted, size: 18),
              SizedBox(width: 8),
              Text('Cancelled & Declined Requests', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
            ],
          ),
          const SizedBox(height: 10),
          ..._rejectedCancelled.map((item) => _buildHistoryCard(item, item['status'] ?? 'Declined', Colors.grey.shade700)),
        ],
      ],
    );
  }

  Widget _buildPendingRequestCard(Map<String, dynamic> req) {
    final connectionId = int.tryParse(req['id'].toString()) ?? 0;
    final name = req['recipientName'] ?? req['caregiver_name'] ?? 'Companion';
    final email = req['recipientEmail'] ?? req['caregiver_email'] ?? '';
    final relationship = req['relationship'] ?? 'Companion';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFFDE68A)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 18,
                    backgroundColor: const Color(0xFFFEF3C7),
                    child: Text(name.isNotEmpty ? name[0].toUpperCase() : 'C', style: const TextStyle(color: Color(0xFFB45309), fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textDark)),
                      if (email.isNotEmpty) Text(email, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: const Color(0xFFFEF3C7), borderRadius: BorderRadius.circular(12)),
                child: const Text('Pending Acceptance', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFB45309))),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(color: const Color(0xFFFAF8FC), borderRadius: BorderRadius.circular(8)),
            child: Row(
              children: [
                const Icon(Icons.link_rounded, size: 16, color: Color(0xFF936DA2)),
                const SizedBox(width: 6),
                Text('Relationship: $relationship', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF5A4B56))),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Awaiting companion response', style: TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: AppTheme.textMuted)),
              OutlinedButton.icon(
                icon: const Icon(Icons.close_rounded, size: 14, color: Colors.red),
                label: const Text('Cancel Request', style: TextStyle(fontSize: 11, color: Colors.red)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.red),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                ),
                onPressed: () => _handleCancelRequest(connectionId),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActiveConnectionCard(Map<String, dynamic> conn) {
    final connectionId = int.tryParse(conn['id'].toString()) ?? 0;
    final name = conn['recipientName'] ?? conn['caregiver_name'] ?? 'Companion';
    final email = conn['recipientEmail'] ?? conn['caregiver_email'] ?? '';
    final relationship = conn['relationship'] ?? 'Companion';
    final consentStatus = conn['consent_status'] ?? 'awaiting_consent';
    final isAwaitingConsent = consentStatus == 'awaiting_consent';

    final perms = (conn['permissions'] is Map) ? Map<String, dynamic>.from(conn['permissions']) : {};

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isAwaitingConsent ? const Color(0xFFFDE68A) : const Color(0xFFD1FAE5)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: isAwaitingConsent ? const Color(0xFFFEF3C7) : const Color(0xFFDCFCE7),
                    child: Text(
                      name.isNotEmpty ? name[0].toUpperCase() : 'C',
                      style: TextStyle(color: isAwaitingConsent ? const Color(0xFFB45309) : const Color(0xFF15803D), fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textDark)),
                      if (email.isNotEmpty) Text(email, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isAwaitingConsent ? const Color(0xFFFEF3C7) : const Color(0xFFDCFCE7),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  isAwaitingConsent ? 'Awaiting Consent' : 'Sharing Active',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: isAwaitingConsent ? const Color(0xFFB45309) : const Color(0xFF15803D),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(color: const Color(0xFFFAF8FC), borderRadius: BorderRadius.circular(8)),
            child: Row(
              children: [
                const Icon(Icons.favorite_rounded, size: 16, color: Color(0xFF936DA2)),
                const SizedBox(width: 6),
                Text('Relationship: $relationship', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF5A4B56))),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // If awaiting consent, show big review button
          if (isAwaitingConsent) ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFFFFBEB),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFFDE68A)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.lock_clock_rounded, color: Color(0xFFB45309), size: 16),
                      SizedBox(width: 6),
                      Text('Explicit Consent Required', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFB45309))),
                    ],
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'This companion has accepted your connection. In accordance with FemSphere privacy policy, no health records are accessible until you explicitly approve consent.',
                    style: TextStyle(fontSize: 11, color: Color(0xFF78350F), height: 1.3),
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.verified_user_rounded, size: 16),
                      label: const Text('Review & Approve Consent', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFB45309),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                      onPressed: () => _showConsentModal(conn),
                    ),
                  ),
                ],
              ),
            ),
          ] else ...[
            // Active consent: show permitted categories summary
            const Text('Authorized Data Categories:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
            const SizedBox(height: 6),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: [
                _buildPermChip('Daily Activities', perms['daily_activities'] == true),
                _buildPermChip('Menstrual Cycle', perms['menstrual_cycle'] == true),
                _buildPermChip('Symptoms & Notes', perms['symptoms_notes'] == true),
                _buildPermChip('Medical Records', perms['medical_records'] == true),
                _buildPermChip('Appointments', perms['appointments'] == true),
              ],
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.settings_rounded, size: 15, color: Color(0xFF936DA2)),
                    label: const Text('Manage Permissions', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF936DA2))),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFF936DA2)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(vertical: 8),
                    ),
                    onPressed: () => _showManagePermissionsModal(conn),
                  ),
                ),
              ],
            ),
          ],

          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              icon: const Icon(Icons.link_off_rounded, size: 15, color: Colors.red),
              label: const Text('Revoke Companion Access', style: TextStyle(color: Colors.red, fontSize: 12, fontWeight: FontWeight.bold)),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Colors.red),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                padding: const EdgeInsets.symmetric(vertical: 8),
              ),
              onPressed: () => _handleRevokeConnection(connectionId, name),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPermChip(String label, bool isGranted) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: isGranted ? const Color(0xFFECFDF5) : const Color(0xFFF3F4F6),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: isGranted ? const Color(0xFFA7F3D0) : const Color(0xFFE5E7EB)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(isGranted ? Icons.check : Icons.lock_outline, size: 12, color: isGranted ? const Color(0xFF059669) : Colors.grey),
          const SizedBox(width: 4),
          Text(label, style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isGranted ? const Color(0xFF065F46) : Colors.grey.shade600)),
        ],
      ),
    );
  }

  Widget _buildHistoryCard(Map<String, dynamic> item, String statusLabel, Color statusColor) {
    final name = item['recipientName'] ?? item['caregiver_name'] ?? 'Companion';
    final rel = item['relationship'] ?? '';

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
              if (rel.isNotEmpty) Text(rel, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: statusColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(statusLabel, style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: statusColor)),
          ),
        ],
      ),
    );
  }

  // ===========================================================================
  // TAB 3: ACCESS HISTORY & AUDIT LOG (Prompt Section 7)
  // ===========================================================================
  Widget _buildAccessHistoryTab() {
    if (_isLoadingHistory) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF936DA2)));
    }

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
              Icon(Icons.verified_user_rounded, color: Color(0xFF7C3AED), size: 20),
              SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Tamper-Proof Audit Trail', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF581C87))),
                    SizedBox(height: 2),
                    Text(
                      'Every connection request, consent approval, permission change, access attempt, and revocation is recorded here automatically. Normal users cannot alter or delete this history.',
                      style: TextStyle(fontSize: 11, color: Color(0xFF6B21A8), height: 1.35),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        if (_accessHistory.isEmpty)
          Center(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                children: [
                  Icon(Icons.history_edu_rounded, size: 48, color: Colors.grey.shade400),
                  const SizedBox(height: 12),
                  const Text('No Access Events Logged Yet', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                  const SizedBox(height: 6),
                  const Text('Actions such as consent grants, permission changes, and access attempts will appear here in chronological order.', textAlign: TextAlign.center, style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                ],
              ),
            ),
          )
        else
          ..._accessHistory.map((event) => _buildAuditEventCard(event)),
      ],
    );
  }

  Widget _buildAuditEventCard(Map<String, dynamic> event) {
    final action = event['action'] ?? 'ACTION';
    final companionName = event['companionName'] ?? 'Companion';
    final timestamp = event['timestamp'] != null
        ? DateTime.tryParse(event['timestamp'].toString())?.toLocal().toString().split('.')[0] ?? event['timestamp']
        : 'Recorded';
    final description = event['description'] ?? 'Event logged';
    final outcome = event['outcome'] ?? 'Success';
    final isSuccess = outcome == 'Success' || outcome == 'Completed';

    IconData eventIcon = Icons.info_outline;
    Color iconColor = const Color(0xFF936DA2);

    if (action.contains('CONSENT')) {
      eventIcon = Icons.verified_user_rounded;
      iconColor = const Color(0xFF10B981);
    } else if (action.contains('PERMISSION')) {
      eventIcon = Icons.toggle_on_rounded;
      iconColor = const Color(0xFF3B82F6);
    } else if (action.contains('REVOKE')) {
      eventIcon = Icons.link_off_rounded;
      iconColor = Colors.red;
    } else if (action.contains('REQUEST')) {
      eventIcon = Icons.person_add_rounded;
      iconColor = const Color(0xFFD97706);
    } else if (action.contains('VIEW') || action.contains('ACCESS')) {
      eventIcon = Icons.visibility_rounded;
      iconColor = const Color(0xFF6366F1);
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFEDE8F5)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            radius: 18,
            backgroundColor: iconColor.withValues(alpha: 0.12),
            child: Icon(eventIcon, size: 18, color: iconColor),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(description, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textDark)),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: isSuccess ? const Color(0xFFDCFCE7) : const Color(0xFFFEE2E2),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        outcome,
                        style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: isSuccess ? const Color(0xFF15803D) : Colors.red),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text('Actor: $companionName • $timestamp', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildConsentCategoryTile({
    required String title,
    required String description,
    required IconData icon,
    required bool value,
    required ValueChanged<bool?> onChanged,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: value ? const Color(0xFF936DA2) : const Color(0xFFE5E7EB)),
      ),
      child: CheckboxListTile(
        value: value,
        activeColor: const Color(0xFF936DA2),
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        secondary: CircleAvatar(
          radius: 16,
          backgroundColor: value ? const Color(0xFFF3E8FF) : const Color(0xFFF3F4F6),
          child: Icon(icon, size: 16, color: value ? const Color(0xFF936DA2) : Colors.grey),
        ),
        title: Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
        subtitle: Text(description, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
        onChanged: onChanged,
      ),
    );
  }

  Widget _buildManageSwitchTile(String title, String subtitle, bool value, ValueChanged<bool> onChanged) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: value ? const Color(0xFFFAF5FF) : Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: value ? const Color(0xFFE9D5FF) : const Color(0xFFE5E7EB)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textDark)),
                Text(subtitle, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
              ],
            ),
          ),
          Switch(
            value: value,
            activeThumbColor: const Color(0xFF936DA2),
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
}
