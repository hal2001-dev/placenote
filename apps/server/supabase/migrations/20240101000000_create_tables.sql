-- Enable PostGIS extension
create extension if not exists postgis;

-- Create users table
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  nickname text not null,
  created_at timestamp with time zone default now()
);

-- Create memo table
create table if not exists public.memo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  content text not null,
  location geography(Point, 4326) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes
create index if not exists memo_location_gix on memo using gist(location);
create index if not exists memo_user_id_idx on memo(user_id);

-- Enable Row Level Security
alter table users enable row level security;
alter table memo enable row level security;

-- Create RLS policies for users table
create policy "Users can view all profiles"
on users for select
using (true);

create policy "Users can update their own profile"
on users for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Create RLS policies for memo table
create policy "Users can view all memos"
on memo for select
using (true);

create policy "Users can insert their own memos"
on memo for insert
with check (auth.uid() = user_id);

create policy "Users can update their own memos"
on memo for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own memos"
on memo for delete
using (auth.uid() = user_id); 