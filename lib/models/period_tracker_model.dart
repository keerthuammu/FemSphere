import 'dart:convert';

int _parseInt(dynamic val, [int fallback = 0]) {
  if (val == null) return fallback;
  if (val is int) return val;
  if (val is num) return val.toInt();
  if (val is String) return int.tryParse(val) ?? fallback;
  return fallback;
}

bool _parseBool(dynamic val, [bool fallback = false]) {
  if (val == null) return fallback;
  if (val is bool) return val;
  if (val is num) return val != 0;
  if (val is String) {
    final lower = val.toLowerCase().trim();
    if (lower == 'true' || lower == '1' || lower == 't') return true;
    if (lower == 'false' || lower == '0' || lower == 'f') return false;
  }
  return fallback;
}

class PeriodSettingsModel {
  final String lastPeriodStart;
  final int periodDuration;
  final int cycleLength;
  final bool isPregnant;
  final String? pregnancyStartDate;
  final int reminderPeriodDaysBefore;
  final bool reminderPeriodEnabled;
  final bool reminderOvulationEnabled;
  final bool reminderDailyLoggingEnabled;

  PeriodSettingsModel({
    required this.lastPeriodStart,
    required this.periodDuration,
    required this.cycleLength,
    this.isPregnant = false,
    this.pregnancyStartDate,
    this.reminderPeriodDaysBefore = 2,
    this.reminderPeriodEnabled = true,
    this.reminderOvulationEnabled = false,
    this.reminderDailyLoggingEnabled = false,
  });

  factory PeriodSettingsModel.fromJson(Map<String, dynamic> json) {
    return PeriodSettingsModel(
      lastPeriodStart: json['lastPeriodStart']?.toString() ?? json['last_period_start']?.toString() ?? '',
      periodDuration: _parseInt(json['periodDuration'] ?? json['period_duration'], 5),
      cycleLength: _parseInt(json['cycleLength'] ?? json['cycle_length'], 28),
      isPregnant: _parseBool(json['isPregnant'] ?? json['is_pregnant'], false),
      pregnancyStartDate: json['pregnancyStartDate']?.toString() ?? json['pregnancy_start_date']?.toString(),
      reminderPeriodDaysBefore: _parseInt(json['reminderPeriodDaysBefore'] ?? json['reminder_period_days_before'] ?? json['periodDaysBefore'], 2),
      reminderPeriodEnabled: _parseBool(json['reminderPeriodEnabled'] ?? json['reminder_period_enabled'] ?? json['periodEnabled'], true),
      reminderOvulationEnabled: _parseBool(json['reminderOvulationEnabled'] ?? json['reminder_ovulation_enabled'] ?? json['ovulationEnabled'], false),
      reminderDailyLoggingEnabled: _parseBool(json['reminderDailyLoggingEnabled'] ?? json['reminder_daily_logging_enabled'] ?? json['dailyLoggingEnabled'], false),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'lastPeriodStart': lastPeriodStart,
      'periodDuration': periodDuration,
      'cycleLength': cycleLength,
      'isPregnant': isPregnant,
      'pregnancyStartDate': pregnancyStartDate,
      'periodDaysBefore': reminderPeriodDaysBefore,
      'periodEnabled': reminderPeriodEnabled,
      'ovulationEnabled': reminderOvulationEnabled,
      'dailyLoggingEnabled': reminderDailyLoggingEnabled,
    };
  }
}

class CyclePredictionModel {
  final String? nextPeriodStartDate;
  final String? predictionRangeStart;
  final String? predictionRangeEnd;
  final String? estimatedOvulationDate;
  final String? fertileWindowStartDate;
  final String? fertileWindowEndDate;
  final int estimatedPeriodDuration;
  final int cycleDaysElapsed;
  final int daysUntilPeriod;
  final bool isDelayed;
  final int daysDelayed;
  final String predictionDisclaimer;

  CyclePredictionModel({
    this.nextPeriodStartDate,
    this.predictionRangeStart,
    this.predictionRangeEnd,
    this.estimatedOvulationDate,
    this.fertileWindowStartDate,
    this.fertileWindowEndDate,
    this.estimatedPeriodDuration = 5,
    this.cycleDaysElapsed = 1,
    this.daysUntilPeriod = 0,
    this.isDelayed = false,
    this.daysDelayed = 0,
    this.predictionDisclaimer = '',
  });

  factory CyclePredictionModel.fromJson(Map<String, dynamic> json) {
    return CyclePredictionModel(
      nextPeriodStartDate: json['nextPeriodStartDate']?.toString(),
      predictionRangeStart: json['predictionRangeStart']?.toString(),
      predictionRangeEnd: json['predictionRangeEnd']?.toString(),
      estimatedOvulationDate: json['estimatedOvulationDate']?.toString(),
      fertileWindowStartDate: json['fertileWindowStartDate']?.toString(),
      fertileWindowEndDate: json['fertileWindowEndDate']?.toString(),
      estimatedPeriodDuration: _parseInt(json['estimatedPeriodDuration'] ?? json['periodDuration'], 5),
      cycleDaysElapsed: _parseInt(json['cycleDaysElapsed'], 1),
      daysUntilPeriod: _parseInt(json['daysUntilPeriod'], 0),
      isDelayed: _parseBool(json['isDelayed'], false),
      daysDelayed: _parseInt(json['daysDelayed'], 0),
      predictionDisclaimer: json['predictionDisclaimer']?.toString() ?? '',
    );
  }
}

class CycleStatisticsModel {
  final int recordedCyclesCount;
  final int averageCycleLength;
  final int averagePeriodDuration;
  final int cycleVariabilityDays;
  final int minCycleLength;
  final int maxCycleLength;
  final bool isIrregular;
  final String confidenceLevel;

  CycleStatisticsModel({
    this.recordedCyclesCount = 0,
    this.averageCycleLength = 28,
    this.averagePeriodDuration = 5,
    this.cycleVariabilityDays = 0,
    this.minCycleLength = 28,
    this.maxCycleLength = 28,
    this.isIrregular = false,
    this.confidenceLevel = 'Default',
  });

  factory CycleStatisticsModel.fromJson(Map<String, dynamic> json) {
    return CycleStatisticsModel(
      recordedCyclesCount: _parseInt(json['recordedCyclesCount'] ?? json['count'], 0),
      averageCycleLength: _parseInt(json['averageCycleLength'], 28),
      averagePeriodDuration: _parseInt(json['averagePeriodDuration'], 5),
      cycleVariabilityDays: _parseInt(json['cycleVariabilityDays'], 0),
      minCycleLength: _parseInt(json['minCycleLength'], 28),
      maxCycleLength: _parseInt(json['maxCycleLength'], 28),
      isIrregular: _parseBool(json['isIrregular'], false),
      confidenceLevel: json['confidenceLevel']?.toString() ?? 'Default',
    );
  }
}

class PeriodCycleModel {
  final dynamic id;
  final String startDate;
  final String? endDate;
  final int durationDays;
  final int cycleLengthDays;
  final String flowIntensity;
  final List<String> symptoms;
  final String mood;
  final String status;
  final String notes;

  PeriodCycleModel({
    required this.id,
    required this.startDate,
    this.endDate,
    this.durationDays = 5,
    this.cycleLengthDays = 28,
    this.flowIntensity = 'Medium',
    this.symptoms = const [],
    this.mood = 'Calm',
    this.status = 'Regular Cycle',
    this.notes = '',
  });

  factory PeriodCycleModel.fromJson(Map<String, dynamic> json) {
    List<String> parsedSymptoms = [];
    if (json['symptoms'] is List) {
      parsedSymptoms = (json['symptoms'] as List).map((e) => e.toString()).toList();
    } else if (json['symptoms'] is String && (json['symptoms'] as String).isNotEmpty) {
      try {
        final decoded = jsonDecode(json['symptoms'] as String);
        if (decoded is List) {
          parsedSymptoms = decoded.map((e) => e.toString()).toList();
        }
      } catch (_) {
        parsedSymptoms = [json['symptoms'] as String];
      }
    }
    return PeriodCycleModel(
      id: json['id'],
      startDate: json['startDate']?.toString() ?? json['start_date']?.toString() ?? '',
      endDate: json['endDate']?.toString() ?? json['end_date']?.toString(),
      durationDays: _parseInt(json['durationDays'] ?? json['duration_days'], 5),
      cycleLengthDays: _parseInt(json['cycleLengthDays'] ?? json['cycle_length_days'], 28),
      flowIntensity: json['flowIntensity']?.toString() ?? json['flow_intensity']?.toString() ?? 'Medium',
      symptoms: parsedSymptoms,
      mood: json['mood']?.toString() ?? 'Calm',
      status: json['status']?.toString() ?? 'Regular Cycle',
      notes: json['notes']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'startDate': startDate,
      'endDate': endDate,
      'durationDays': durationDays,
      'cycleLengthDays': cycleLengthDays,
      'flowIntensity': flowIntensity,
      'symptoms': symptoms,
      'mood': mood,
      'notes': notes,
    };
  }
}

class DailyLogModel {
  final dynamic id;
  final String date;
  final bool isPeriodDay;
  final String flowIntensity;
  final List<String> symptoms;
  final String mood;
  final String energyLevel;
  final String sleepQuality;
  final String cervicalMucus;
  final String notes;

  DailyLogModel({
    this.id,
    required this.date,
    this.isPeriodDay = false,
    this.flowIntensity = 'None',
    this.symptoms = const [],
    this.mood = 'Calm',
    this.energyLevel = 'Medium',
    this.sleepQuality = 'Good',
    this.cervicalMucus = 'None',
    this.notes = '',
  });

  factory DailyLogModel.fromJson(Map<String, dynamic> json) {
    List<String> parsedSymptoms = [];
    if (json['symptoms'] is List) {
      parsedSymptoms = (json['symptoms'] as List).map((e) => e.toString()).toList();
    } else if (json['symptoms'] is String && (json['symptoms'] as String).isNotEmpty) {
      try {
        final decoded = jsonDecode(json['symptoms'] as String);
        if (decoded is List) {
          parsedSymptoms = decoded.map((e) => e.toString()).toList();
        }
      } catch (_) {
        parsedSymptoms = [json['symptoms'] as String];
      }
    }
    return DailyLogModel(
      id: json['id'],
      date: json['date']?.toString() ?? json['log_date']?.toString() ?? '',
      isPeriodDay: _parseBool(json['isPeriodDay'] ?? json['is_period_day'], false),
      flowIntensity: json['flowIntensity']?.toString() ?? json['flow_intensity']?.toString() ?? 'None',
      symptoms: parsedSymptoms,
      mood: json['mood']?.toString() ?? 'Calm',
      energyLevel: json['energyLevel']?.toString() ?? json['energy_level']?.toString() ?? 'Medium',
      sleepQuality: json['sleepQuality']?.toString() ?? json['sleep_quality']?.toString() ?? 'Good',
      cervicalMucus: json['cervicalMucus']?.toString() ?? json['cervical_mucus']?.toString() ?? 'None',
      notes: json['notes']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'date': date,
      'isPeriodDay': isPeriodDay,
      'flowIntensity': flowIntensity,
      'symptoms': symptoms,
      'mood': mood,
      'energyLevel': energyLevel,
      'sleepQuality': sleepQuality,
      'cervicalMucus': cervicalMucus,
      'notes': notes,
    };
  }
}
