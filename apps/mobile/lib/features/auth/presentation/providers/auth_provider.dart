import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:placenote_mobile/features/auth/domain/models/user.dart';

final authProvider = StateNotifierProvider<AuthNotifier, AsyncValue<User?>>((ref) {
  return AuthNotifier();
});

class AuthNotifier extends StateNotifier<AsyncValue<User?>> {
  AuthNotifier() : super(const AsyncValue.data(null));

  Future<void> signIn(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      // TODO: Implement actual sign in logic
      await Future.delayed(const Duration(seconds: 1)); // Simulated delay
      state = AsyncValue.data(User(
        id: '1',
        email: email,
        name: 'Test User',
      ));
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> signUp(String email, String password, String name) async {
    state = const AsyncValue.loading();
    try {
      // TODO: Implement actual sign up logic
      await Future.delayed(const Duration(seconds: 1)); // Simulated delay
      state = AsyncValue.data(User(
        id: '1',
        email: email,
        name: name,
      ));
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> signOut() async {
    state = const AsyncValue.loading();
    try {
      // TODO: Implement actual sign out logic
      await Future.delayed(const Duration(seconds: 1)); // Simulated delay
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
} 