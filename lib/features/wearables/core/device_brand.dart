import 'package:flutter/material.dart';

enum DeviceBrand {
  amazfit,
  appleWatch,
  samsungGalaxy,
  googlePixel,
  fitbit,
  garmin,
  huawei,
  xiaomi,
  onePlus,
  realme,
  noise,
  boAt,
  fireBoltt,
  titan,
  ouraRing,
  whoop,
  polar,
  suunto,
  smartBottle,
  genericBle;

  String get displayName {
    switch (this) {
      case DeviceBrand.amazfit:
        return 'Amazfit';
      case DeviceBrand.appleWatch:
        return 'Apple Watch';
      case DeviceBrand.samsungGalaxy:
        return 'Samsung Galaxy Watch';
      case DeviceBrand.googlePixel:
        return 'Google Pixel Watch';
      case DeviceBrand.fitbit:
        return 'Fitbit';
      case DeviceBrand.garmin:
        return 'Garmin';
      case DeviceBrand.huawei:
        return 'Huawei Watch';
      case DeviceBrand.xiaomi:
        return 'Xiaomi / Redmi';
      case DeviceBrand.onePlus:
        return 'OnePlus Watch';
      case DeviceBrand.realme:
        return 'Realme Watch';
      case DeviceBrand.noise:
        return 'Noise';
      case DeviceBrand.boAt:
        return 'boAt';
      case DeviceBrand.fireBoltt:
        return 'Fire-Boltt';
      case DeviceBrand.titan:
        return 'Titan Smart / Fastrack';
      case DeviceBrand.ouraRing:
        return 'Oura Ring';
      case DeviceBrand.whoop:
        return 'Whoop';
      case DeviceBrand.polar:
        return 'Polar';
      case DeviceBrand.suunto:
        return 'Suunto';
      case DeviceBrand.smartBottle:
        return 'Smart Water Bottle';
      case DeviceBrand.genericBle:
        return 'Standard BLE Wearable';
    }
  }

  String get code {
    switch (this) {
      case DeviceBrand.amazfit:
        return 'AMAZFIT';
      case DeviceBrand.appleWatch:
        return 'APPLE_WATCH';
      case DeviceBrand.samsungGalaxy:
        return 'SAMSUNG';
      case DeviceBrand.googlePixel:
        return 'PIXEL_WATCH';
      case DeviceBrand.fitbit:
        return 'FITBIT';
      case DeviceBrand.garmin:
        return 'GARMIN';
      case DeviceBrand.huawei:
        return 'HUAWEI';
      case DeviceBrand.xiaomi:
        return 'XIAOMI';
      case DeviceBrand.onePlus:
        return 'ONEPLUS';
      case DeviceBrand.realme:
        return 'REALME';
      case DeviceBrand.noise:
        return 'NOISE';
      case DeviceBrand.boAt:
        return 'BOAT';
      case DeviceBrand.fireBoltt:
        return 'FIRE_BOLTT';
      case DeviceBrand.titan:
        return 'TITAN';
      case DeviceBrand.ouraRing:
        return 'OURA';
      case DeviceBrand.whoop:
        return 'WHOOP';
      case DeviceBrand.polar:
        return 'POLAR';
      case DeviceBrand.suunto:
        return 'SUUNTO';
      case DeviceBrand.smartBottle:
        return 'SMART_BOTTLE';
      case DeviceBrand.genericBle:
        return 'GENERIC_BLE';
    }
  }

  Color get brandColor {
    switch (this) {
      case DeviceBrand.amazfit:
        return const Color(0xFFF97316); // Orange
      case DeviceBrand.appleWatch:
        return const Color(0xFF1E293B); // Slate
      case DeviceBrand.samsungGalaxy:
        return const Color(0xFF2563EB); // Royal Blue
      case DeviceBrand.googlePixel:
        return const Color(0xFF34A853); // Google Green
      case DeviceBrand.fitbit:
        return const Color(0xFF00B0B9); // Teal
      case DeviceBrand.garmin:
        return const Color(0xFF007CC3); // Garmin Blue
      case DeviceBrand.huawei:
        return const Color(0xFFDC2626); // Red
      case DeviceBrand.xiaomi:
        return const Color(0xFFFF6900); // Xiaomi Orange
      case DeviceBrand.onePlus:
        return const Color(0xFFEB0029); // OnePlus Red
      case DeviceBrand.realme:
        return const Color(0xFFFFC915); // Realme Yellow
      case DeviceBrand.noise:
        return const Color(0xFF7C3AED); // Purple
      case DeviceBrand.boAt:
        return const Color(0xFFE11D48); // Rose / Crimson
      case DeviceBrand.fireBoltt:
        return const Color(0xFFF43F5E); // Bright Rose
      case DeviceBrand.titan:
        return const Color(0xFF0F766E); // Teal
      case DeviceBrand.ouraRing:
        return const Color(0xFF475569); // Slate Grey
      case DeviceBrand.whoop:
        return const Color(0xFF09090B); // Black
      case DeviceBrand.polar:
        return const Color(0xFF0284C7); // Cyan Blue
      case DeviceBrand.suunto:
        return const Color(0xFFD97706); // Amber
      case DeviceBrand.smartBottle:
        return const Color(0xFF06B6D4); // Cyan / Water
      case DeviceBrand.genericBle:
        return const Color(0xFF64748B); // Blue Grey
    }
  }

  IconData get iconData {
    switch (this) {
      case DeviceBrand.smartBottle:
        return Icons.water_drop_outlined;
      case DeviceBrand.appleWatch:
        return Icons.watch_outlined;
      case DeviceBrand.garmin:
      case DeviceBrand.samsungGalaxy:
        return Icons.watch;
      case DeviceBrand.ouraRing:
        return Icons.radio_button_checked;
      default:
        return Icons.watch_outlined;
    }
  }

  static DeviceBrand detectFromName(String name) {
    final lower = name.toLowerCase();

    // Audio earbuds, headphones, speakers should NOT be identified as wearable health trackers
    if (lower.contains('buds') ||
        lower.contains('earbuds') ||
        lower.contains('headphone') ||
        lower.contains('earphone') ||
        lower.contains('airpods') ||
        lower.contains('airdopes') ||
        lower.contains('neckband') ||
        lower.contains('speaker') ||
        lower.contains('tws') ||
        lower.contains('audio')) {
      return DeviceBrand.genericBle;
    }

    if (lower.contains('bottle') || lower.contains('water') || lower.contains('hidrate') || lower.contains('hydration') || lower.contains('h2o')) {
      return DeviceBrand.smartBottle;
    }
    if (lower.contains('amazfit') || lower.contains('bip') || lower.contains('gtr') || lower.contains('gts') || lower.contains('a2008')) {
      return DeviceBrand.amazfit;
    }
    if (lower.contains('apple') || lower.contains('watch os')) {
      return DeviceBrand.appleWatch;
    }
    if (lower.contains('galaxy') || lower.contains('samsung') || lower.contains('gear')) {
      return DeviceBrand.samsungGalaxy;
    }
    if (lower.contains('pixel') || lower.contains('google watch')) {
      return DeviceBrand.googlePixel;
    }
    if (lower.contains('fitbit') || lower.contains('charge') || lower.contains('sense') || lower.contains('versa')) {
      return DeviceBrand.fitbit;
    }
    if (lower.contains('garmin') || lower.contains('forerunner') || lower.contains('fenix') || lower.contains('venu')) {
      return DeviceBrand.garmin;
    }
    if (lower.contains('huawei') || lower.contains('honor')) {
      return DeviceBrand.huawei;
    }
    if (lower.contains('xiaomi') || lower.contains('redmi') || lower.contains('mi band') || lower.contains('mi watch')) {
      return DeviceBrand.xiaomi;
    }
    if (lower.contains('oneplus')) {
      return DeviceBrand.onePlus;
    }
    if (lower.contains('realme') || lower.contains('dizo')) {
      return DeviceBrand.realme;
    }
    if (lower.contains('noise') || lower.contains('colorfit')) {
      return DeviceBrand.noise;
    }
    if (lower.contains('boat') || lower.contains('wave') || lower.contains('storm') || lower.contains('xtend')) {
      return DeviceBrand.boAt;
    }
    if (lower.contains('fire-boltt') || lower.contains('fireboltt') || lower.contains('boltt') || lower.contains('ninja')) {
      return DeviceBrand.fireBoltt;
    }
    if (lower.contains('titan') || lower.contains('fastrack') || lower.contains('reflex')) {
      return DeviceBrand.titan;
    }
    if (lower.contains('oura')) {
      return DeviceBrand.ouraRing;
    }
    if (lower.contains('whoop')) {
      return DeviceBrand.whoop;
    }
    if (lower.contains('polar')) {
      return DeviceBrand.polar;
    }
    if (lower.contains('suunto')) {
      return DeviceBrand.suunto;
    }
    return DeviceBrand.genericBle;
  }
}
