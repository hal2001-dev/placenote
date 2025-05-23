import 'package:flutter_test/flutter_test.dart';
import 'package:placenote_mobile/features/auth/domain/models/user.dart';

void main() {
  group('User', () {
    test('should create a User instance with correct values', () {
      const user = User(
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      );

      expect(user.id, equals('1'));
      expect(user.email, equals('test@example.com'));
      expect(user.name, equals('Test User'));
    });

    test('should create a User instance from JSON', () {
      final json = {
        'id': '1',
        'email': 'test@example.com',
        'name': 'Test User',
      };

      final user = User.fromJson(json);

      expect(user.id, equals('1'));
      expect(user.email, equals('test@example.com'));
      expect(user.name, equals('Test User'));
    });

    test('should convert User instance to JSON', () {
      const user = User(
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      );

      final json = user.toJson();

      expect(json['id'], equals('1'));
      expect(json['email'], equals('test@example.com'));
      expect(json['name'], equals('Test User'));
    });
  });
} 