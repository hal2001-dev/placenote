import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Environment variables schema
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),

  // Supabase
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),

  // JWT
  JWT_SECRET: z.string().default('82ea7317d81c805992ed08edd4989ee8b70d1b20304d5f9e8ea63563ea9b7e5'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Location
  DEFAULT_RADIUS: z.string().default('1000'),
  MAX_RADIUS: z.string().default('5000'),
});

// Validate environment variables
const env = envSchema.parse(process.env);

// Log JWT secret for debugging
console.log('JWT_SECRET from env:', env.JWT_SECRET);

export const config = {
  server: {
    env: env.NODE_ENV,
    port: parseInt(env.PORT, 10),
  },
  supabase: {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  location: {
    defaultRadius: parseInt(env.DEFAULT_RADIUS, 10),
    maxRadius: parseInt(env.MAX_RADIUS, 10),
  },
} as const; 