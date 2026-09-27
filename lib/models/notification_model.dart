class NotificationModel {
  final int id;
  final String title;
  final String message;
  final String category; // 'Period Alert' | 'Medication' | 'Appointment' | 'AI Health Twin' | 'System'
  final String timestamp;
  final bool isRead;
  final String? actionUrl;

  NotificationModel({
    required this.id,
    required this.title,
    required this.message,
    required this.category,
    required this.timestamp,
    this.isRead = false,
    this.actionUrl,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      title: json['title'] ?? 'Notification',
      message: json['message'] ?? '',
      category: json['category'] ?? 'System',
      timestamp: json['timestamp'] ?? 'Just now',
      isRead: json['isRead'] ?? json['is_read'] ?? false,
      actionUrl: json['actionUrl'] ?? json['action_url'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'message': message,
      'category': category,
      'timestamp': timestamp,
      'isRead': isRead,
      'actionUrl': actionUrl,
    };
  }

  NotificationModel copyWith({
    int? id,
    String? title,
    String? message,
    String? category,
    String? timestamp,
    bool? isRead,
    String? actionUrl,
  }) {
    return NotificationModel(
      id: id ?? this.id,
      title: title ?? this.title,
      message: message ?? this.message,
      category: category ?? this.category,
      timestamp: timestamp ?? this.timestamp,
      isRead: isRead ?? this.isRead,
      actionUrl: actionUrl ?? this.actionUrl,
    );
  }
}
