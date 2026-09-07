class UserModel {
  final int id;
  final String username;
  final String email;
  final String fullName;
  final String role;
  final String status;
  final Map<String, dynamic>? profile;

  UserModel({
    required this.id,
    required this.username,
    required this.email,
    required this.fullName,
    required this.role,
    required this.status,
    this.profile,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      fullName: json['fullName'] ?? json['full_name'] ?? json['username'] ?? '',
      role: json['role'] ?? 'Myself',
      status: json['status'] ?? 'Active',
      profile: json['profile'] is Map<String, dynamic> ? json['profile'] : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'fullName': fullName,
      'role': role,
      'status': status,
      'profile': profile,
    };
  }
}
