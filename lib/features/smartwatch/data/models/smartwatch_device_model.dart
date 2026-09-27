enum SmartwatchConnectionStatus {
  notConnected,
  connecting,
  connected,
  syncing,
  synced,
  disconnected,
  error,
  unsupported;

  static SmartwatchConnectionStatus fromString(String? status) {
    switch (status?.toUpperCase()) {
      case 'CONNECTING':
        return SmartwatchConnectionStatus.connecting;
      case 'CONNECTED':
        return SmartwatchConnectionStatus.connected;
      case 'SYNCING':
        return SmartwatchConnectionStatus.syncing;
      case 'SYNCED':
        return SmartwatchConnectionStatus.synced;
      case 'DISCONNECTED':
        return SmartwatchConnectionStatus.disconnected;
      case 'ERROR':
        return SmartwatchConnectionStatus.error;
      case 'UNSUPPORTED':
        return SmartwatchConnectionStatus.unsupported;
      default:
        return SmartwatchConnectionStatus.notConnected;
    }
  }

  String toApiString() {
    switch (this) {
      case SmartwatchConnectionStatus.connecting:
        return 'CONNECTING';
      case SmartwatchConnectionStatus.connected:
        return 'CONNECTED';
      case SmartwatchConnectionStatus.syncing:
        return 'SYNCING';
      case SmartwatchConnectionStatus.synced:
        return 'SYNCED';
      case SmartwatchConnectionStatus.disconnected:
        return 'DISCONNECTED';
      case SmartwatchConnectionStatus.error:
        return 'ERROR';
      case SmartwatchConnectionStatus.unsupported:
        return 'UNSUPPORTED';
      case SmartwatchConnectionStatus.notConnected:
        return 'NOT_CONNECTED';
    }
  }
}

class SmartwatchDeviceModel {
  final int? id;
  final int? userId;
  final String deviceName;
  final String deviceModel;
  final String deviceIdentifier;
  final SmartwatchConnectionStatus connectionStatus;
  final int? batteryLevel;
  final DateTime? lastConnectedAt;
  final DateTime? lastSyncedAt;

  const SmartwatchDeviceModel({
    this.id,
    this.userId,
    this.deviceName = 'Amazfit Bip U Pro',
    this.deviceModel = 'A2008',
    required this.deviceIdentifier,
    this.connectionStatus = SmartwatchConnectionStatus.notConnected,
    this.batteryLevel,
    this.lastConnectedAt,
    this.lastSyncedAt,
  });

  factory SmartwatchDeviceModel.fromJson(Map<String, dynamic> json) {
    return SmartwatchDeviceModel(
      id: json['id'] as int?,
      userId: json['user_id'] as int?,
      deviceName: json['device_name'] as String? ?? 'Amazfit Bip U Pro',
      deviceModel: json['device_model'] as String? ?? 'A2008',
      deviceIdentifier: json['device_identifier'] as String? ?? '',
      connectionStatus: SmartwatchConnectionStatus.fromString(json['connection_status'] as String?),
      batteryLevel: json['battery_level'] as int?,
      lastConnectedAt: json['last_connected_at'] != null ? DateTime.tryParse(json['last_connected_at']) : null,
      lastSyncedAt: json['last_synced_at'] != null ? DateTime.tryParse(json['last_synced_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      if (userId != null) 'user_id': userId,
      'device_name': deviceName,
      'device_model': deviceModel,
      'device_identifier': deviceIdentifier,
      'connection_status': connectionStatus.toApiString(),
      'battery_level': batteryLevel,
      if (lastConnectedAt != null) 'last_connected_at': lastConnectedAt!.toIso8601String(),
      if (lastSyncedAt != null) 'last_synced_at': lastSyncedAt!.toIso8601String(),
    };
  }

  SmartwatchDeviceModel copyWith({
    int? id,
    int? userId,
    String? deviceName,
    String? deviceModel,
    String? deviceIdentifier,
    SmartwatchConnectionStatus? connectionStatus,
    int? batteryLevel,
    DateTime? lastConnectedAt,
    DateTime? lastSyncedAt,
  }) {
    return SmartwatchDeviceModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      deviceName: deviceName ?? this.deviceName,
      deviceModel: deviceModel ?? this.deviceModel,
      deviceIdentifier: deviceIdentifier ?? this.deviceIdentifier,
      connectionStatus: connectionStatus ?? this.connectionStatus,
      batteryLevel: batteryLevel ?? this.batteryLevel,
      lastConnectedAt: lastConnectedAt ?? this.lastConnectedAt,
      lastSyncedAt: lastSyncedAt ?? this.lastSyncedAt,
    );
  }
}
