import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:placenote_mobile/features/auth/presentation/pages/login_page.dart';
import 'package:placenote_mobile/features/auth/presentation/pages/signup_page.dart';
import 'package:placenote_mobile/features/auth/presentation/providers/auth_provider.dart';
import 'package:placenote_mobile/features/home/presentation/pages/home_page.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  redirect: (context, state) {
    final authState = ProviderScope.containerOf(context).read(authProvider);
    final isAuth = authState.value != null;
    final isAuthRoute = state.matchedLocation == '/login' || state.matchedLocation == '/signup';

    if (!isAuth && !isAuthRoute) {
      return '/login';
    }

    if (isAuth && isAuthRoute) {
      return '/';
    }

    return null;
  },
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomePage(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginPage(),
    ),
    GoRoute(
      path: '/signup',
      builder: (context, state) => const SignUpPage(),
    ),
  ],
); 