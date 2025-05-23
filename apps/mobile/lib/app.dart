import 'package:flutter/material.dart';
import 'package:placenote_mobile/config/theme.dart';
import 'package:placenote_mobile/routes/router.dart';

class PlaceNoteApp extends StatelessWidget {
  const PlaceNoteApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'PlaceNote',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      routerConfig: appRouter,
    );
  }
} 