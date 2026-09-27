import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../data/repositories/smartwatch_repository.dart';

class SmartwatchHistoryScreen extends StatefulWidget {
  const SmartwatchHistoryScreen({super.key});

  @override
  State<SmartwatchHistoryScreen> createState() => _SmartwatchHistoryScreenState();
}

class _SmartwatchHistoryScreenState extends State<SmartwatchHistoryScreen> {
  final SmartwatchRepository _repo = SmartwatchRepository();
  List<Map<String, dynamic>> _history = [];
  bool _isLoading = true;
  int _selectedDays = 7;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchHistory();
  }

  Future<void> _fetchHistory() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final list = await _repo.fetchHistory(days: _selectedDays);
      setState(() {
        _history = list;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Could not load history: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Smartwatch History'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchHistory,
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter Tabs
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Row(
              children: [7, 14, 30].map((days) {
                final isSelected = _selectedDays == days;
                return Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4.0),
                    child: ChoiceChip(
                      label: Center(child: Text('$days Days')),
                      selected: isSelected,
                      selectedColor: AppColors.primary,
                      labelStyle: TextStyle(
                        color: isSelected ? Colors.white : AppColors.textPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                      onSelected: (val) {
                        if (val && _selectedDays != days) {
                          setState(() {
                            _selectedDays = days;
                          });
                          _fetchHistory();
                        }
                      },
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          // Content
          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(color: AppColors.primary),
                  )
                : _error != null
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.error_outline, size: 40, color: AppColors.error),
                              const SizedBox(height: 12),
                              Text(_error!, textAlign: TextAlign.center),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: _fetchHistory,
                                child: const Text('Retry'),
                              ),
                            ],
                          ),
                        ),
                      )
                    : _history.isEmpty
                        ? const Center(
                            child: Text(
                              'No historical telemetry entries found.',
                              style: TextStyle(color: AppColors.textSecondary),
                            ),
                          )
                        : ListView.separated(
                            padding: const EdgeInsets.all(16),
                            itemCount: _history.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 10),
                            itemBuilder: (context, index) {
                              final item = _history[index];
                              final dateStr = item['date'] != null
                                  ? DateTime.tryParse(item['date'])?.toLocal().toString().split(' ')[0] ?? item['date']
                                  : 'Date';
                              final steps = item['steps'] ?? 0;
                              final hr = item['avg_heart_rate'] ?? '--';
                              final sleep = item['sleep_hours'] ?? '--';
                              final cal = item['calories'] ?? '--';
                              final dist = item['distance_km'] ?? '--';

                              return Card(
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            dateStr,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 15,
                                              color: AppColors.textPrimary,
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: AppColors.primaryLight,
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                            child: const Text(
                                              'AMAZFIT_BIP_U_PRO',
                                              style: TextStyle(
                                                fontSize: 9,
                                                fontWeight: FontWeight.bold,
                                                color: AppColors.primary,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 12),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          _HistoryMetric(
                                            icon: Icons.directions_walk,
                                            color: AppColors.steps,
                                            label: '$steps',
                                            sub: 'steps',
                                          ),
                                          _HistoryMetric(
                                            icon: Icons.favorite,
                                            color: AppColors.heartRate,
                                            label: '$hr',
                                            sub: 'avg BPM',
                                          ),
                                          _HistoryMetric(
                                            icon: Icons.straighten,
                                            color: AppColors.water,
                                            label: '$dist',
                                            sub: 'km',
                                          ),
                                          _HistoryMetric(
                                            icon: Icons.bedtime,
                                            color: AppColors.sleep,
                                            label: '$sleep',
                                            sub: 'hrs sleep',
                                          ),
                                          _HistoryMetric(
                                            icon: Icons.local_fire_department,
                                            color: AppColors.weight,
                                            label: '$cal',
                                            sub: 'kcal',
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
          ),
        ],
      ),
    );
  }
}

class _HistoryMetric extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String label;
  final String sub;

  const _HistoryMetric({
    required this.icon,
    required this.color,
    required this.label,
    required this.sub,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, size: 18, color: color),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
        ),
        Text(
          sub,
          style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
        ),
      ],
    );
  }
}
