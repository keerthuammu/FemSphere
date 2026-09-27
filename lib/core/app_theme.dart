import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primaryPurple = Color(0xFF7C3AED);
  static const Color primaryPurpleHover = Color(0xFF6D28D9);
  static const Color primaryPurpleDark = Color(0xFF5B21B6);
  static const Color secondaryTeal = Color(0xFF14B8A6);
  static const Color secondaryTealLight = Color(0xFFCCFBF1);
  static const Color accentPink = Color(0xFFF472B6);
  static const Color accentPinkLight = Color(0xFFFCE7F3);
  static const Color accentRed = Color(0xFFEF4444);
  static const Color accentRedLight = Color(0xFFFEE2E2);
  static const Color accentGreen = Color(0xFF84CC16);
  static const Color accentGreenLight = Color(0xFFECFCCB);
  static const Color accentAmber = Color(0xFFF59E0B);
  static const Color accentAmberLight = Color(0xFFFEF3C7);
  static const Color accentIndigo = Color(0xFF6366F1);
  static const Color accentIndigoLight = Color(0xFFE0E7FF);
  
  static const Color backgroundLight = Color(0xFFFBF9F6);
  static const Color cardBg = Colors.white;
  static const Color borderPurple = Color(0xFFEDE9FE);
  static const Color textDark = Color(0xFF3A3135);
  static const Color textMuted = Color(0xFF7A6F75);

  // Typography helpers matching web app
  static TextStyle serifHeading({
    double fontSize = 28,
    FontWeight fontWeight = FontWeight.w600,
    Color color = textDark,
    double height = 1.15,
    FontStyle fontStyle = FontStyle.normal,
  }) {
    return GoogleFonts.playfairDisplay(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      height: height,
      fontStyle: fontStyle,
    );
  }

  static TextStyle bodyText({
    double fontSize = 14,
    FontWeight fontWeight = FontWeight.normal,
    Color color = textDark,
    double height = 1.5,
  }) {
    return GoogleFonts.plusJakartaSans(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      height: height,
    );
  }

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: backgroundLight,
      primaryColor: primaryPurple,
      textTheme: GoogleFonts.plusJakartaSansTextTheme(),
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryPurple,
        primary: primaryPurple,
        secondary: secondaryTeal,
        surface: backgroundLight,
      ),
      cardTheme: CardThemeData(
        color: cardBg,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: borderPurple, width: 1),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        iconTheme: IconThemeData(color: primaryPurple),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryPurple,
          foregroundColor: Colors.white,
          elevation: 2,
          shadowColor: primaryPurple.withValues(alpha: 0.3),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30),
          ),
          textStyle: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 14),
        ),
      ),
    );
  }
}

