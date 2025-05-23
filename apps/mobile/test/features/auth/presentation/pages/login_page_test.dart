import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:placenote_mobile/features/auth/presentation/pages/login_page.dart';
import 'package:placenote_mobile/test/helpers/test_wrapper.dart';

void main() {
  group('LoginPage', () {
    testWidgets('should render login form', (WidgetTester tester) async {
      await tester.pumpWidget(
        const TestWrapper(
          child: LoginPage(),
        ),
      );

      expect(find.text('Login'), findsOneWidget);
      expect(find.byType(TextFormField), findsNWidgets(2));
      expect(find.byType(ElevatedButton), findsOneWidget);
      expect(find.text('Don\'t have an account? Sign Up'), findsOneWidget);
    });

    testWidgets('should show validation errors for empty fields',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const TestWrapper(
          child: LoginPage(),
        ),
      );

      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle();

      expect(find.text('Please enter your email'), findsOneWidget);
      expect(find.text('Please enter your password'), findsOneWidget);
    });

    testWidgets('should show validation error for invalid email',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const TestWrapper(
          child: LoginPage(),
        ),
      );

      await tester.enterText(
        find.byType(TextFormField).first,
        'invalid-email',
      );
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle();

      expect(find.text('Please enter a valid email'), findsOneWidget);
    });

    testWidgets('should show validation error for short password',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const TestWrapper(
          child: LoginPage(),
        ),
      );

      await tester.enterText(
        find.byType(TextFormField).last,
        '12345',
      );
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle();

      expect(find.text('Password must be at least 6 characters'), findsOneWidget);
    });
  });
} 