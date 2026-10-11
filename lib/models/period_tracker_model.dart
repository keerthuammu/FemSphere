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
      lastPeriodStart: json['lastPeriodStart'] ?? json['last_period_start'] ?? '',
      periodDuration: json['periodDuration'] ?? json['period_duration'] ?? 5,
      cycleLength: json['cycleLength'] ?? json['cycle_length'] ?? 28,
      isPregnant: json['isPregnant'] ?? json['is_pregnant'] ?? false,
      pregnancyStartDate: json['pregnancyStartDate'] ?? json['pregnancy_start_date'],
      reminderPeriodDaysBefore: json['reminderPeriodDaysBefore'] ?? json['reminder_period_days_before'] ?? 2,
      reminderPeriodEnabled: json['reminderPeriodEnabled'] ?? json['reminder_period_enabled'] ?? true,
      reminderOvulationEnabled: json['reminderOvulationEnabled'] ?? json['reminder_ovulation_enabled'] ?? false,
      reminderDailyLoggingEnabled: json['reminderDailyLoggingEnabled'] ?? json['reminder_daily_logging_enabled'] ?? false,
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
      nextPeriodStartDate: json['nextPeriodStartDate'],
      predictionRangeStart: json['predictionRangeStart'],
      predictionRangeEnd: json['predictionRangeEnd'],
      estimatedOvulationDate: json['estimatedOvulationDate'],
      fertileWindowStartDate: json['fertileWindowStartDate'],
      fertileWindowEndDate: json['fertileWindowEndDate'],
      estimatedPeriodDuration: json['estimatedPeriodDuration'] ?? 5,
      cycleDaysElapsed: json['cycleDaysElapsed'] ?? 1,
      daysUntilPeriod: json['daysUntilPeriod'] ?? 0,
      isDelayed: json['isDelayed'] ?? false,
      daysDelayed: json['daysDelayed'] ?? 0,
      predictionDisclaimer: json['predictionDisclaimer'] ?? '',
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
      recordedCyclesCount: json['recordedCyclesCount'] ?? 0,
      averageCycleLength: json['averageCycleLength'] ?? 28,
      averagePeriodDuration: json['averagePeriodDuration'] ?? 5,
      cycleVariabilityDays: json['cycleVariabilityDays'] ?? 0,
      minCycleLength: json['minCycleLength'] ?? 28,
      maxCycleLength: json['maxCycleLength'] ?? 28,
      isIrregular: json['isIrregular'] ?? false,
      confidenceLevel: json['confidenceLevel'] ?? 'Default',
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
    }
    return PeriodCycleModel(
      id: json['id'],
      startDate: json['startDate'] ?? json['start_date'] ?? '',
      endDate: json['endDate'] ?? json['end_date'],
      durationDays: json['durationDays'] ?? json['duration_days'] ?? 5,
      cycleLengthDays: json['cycleLengthDays'] ?? json['cycle_length_days'] ?? 28,
      flowIntensity: json['flowIntensity'] ?? json['flow_intensity'] ?? 'Medium',
      symptoms: parsedSymptoms,
      mood: json['mood'] ?? 'Calm',
      status: json['status'] ?? 'Regular Cycle',
      notes: json['notes'] ?? '',
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
    }
    return DailyLogModel(
      id: json['id'],
      date: json['date'] ?? '',
      isPeriodDay: json['isPeriodDay'] ?? json['is_period_day'] ?? false,
      flowIntensity: json['flowIntensity'] ?? json['flow_intensity'] ?? 'None',
      symptoms: parsedSymptoms,
      mood: json['mood'] ?? 'Calm',
      energyLevel: json['energyLevel'] ?? json['energy_level'] ?? 'Medium',
      sleepQuality: json['sleepQuality'] ?? json['sleep_quality'] ?? 'Good',
      cervicalMucus: json['cervicalMucus'] ?? json['cervical_mucus'] ?? 'None',
      notes: json['notes'] ?? '',
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
