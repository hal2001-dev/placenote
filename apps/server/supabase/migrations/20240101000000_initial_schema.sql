-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add password column to users table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'password'
    ) THEN
        ALTER TABLE users ADD COLUMN password TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create memo table
CREATE TABLE IF NOT EXISTS memo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial index for memo table
CREATE INDEX IF NOT EXISTS memo_location_gix ON memo USING gist(location);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE memo ENABLE ROW LEVEL SECURITY;

-- Create function to get user_id from JWT
CREATE OR REPLACE FUNCTION get_user_id_from_jwt()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (current_setting('request.jwt.claims', true)::json->>'userId')::uuid;
END;
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own memos" ON memo;
DROP POLICY IF EXISTS "Users can insert their own memos" ON memo;
DROP POLICY IF EXISTS "Users can update their own memos" ON memo;
DROP POLICY IF EXISTS "Users can delete their own memos" ON memo;

-- Create policies for users table
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (id = get_user_id_from_jwt());

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = get_user_id_from_jwt());

-- Create policies for memo table
CREATE POLICY "Users can view their own memos"
  ON memo FOR SELECT
  USING (user_id = get_user_id_from_jwt());

CREATE POLICY "Users can insert their own memos"
  ON memo FOR INSERT
  WITH CHECK (user_id = get_user_id_from_jwt());

CREATE POLICY "Users can update their own memos"
  ON memo FOR UPDATE
  USING (user_id = get_user_id_from_jwt());

CREATE POLICY "Users can delete their own memos"
  ON memo FOR DELETE
  USING (user_id = get_user_id_from_jwt()); 