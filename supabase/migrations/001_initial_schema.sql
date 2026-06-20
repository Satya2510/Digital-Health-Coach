-- Health-First: Initial database schema
-- Run this once: paste into Supabase SQL Editor → Run
-- Or via CLI: supabase db push

-- Extends Supabase auth.users
create table profiles (
  id uuid references auth.users primary key,
  name text,
  age int,
  city text,
  goal text,                        -- 'weight_loss' | 'energy' | 'sleep' | 'stress'
  past_failure_reason text,         -- captured during onboarding
  wake_time text,                   -- e.g. '06:30'
  free_window text,                 -- e.g. 'evening'
  onboarded_at timestamptz,         -- null until onboarding complete
  expo_push_token text,             -- for push notifications
  created_at timestamptz default now()
);

-- Daily check-ins (one per user per day)
create table checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  date date default current_date,
  sleep_quality int check (sleep_quality between 1 and 3),
  energy_level int check (energy_level between 1 and 3),
  stress_level int check (stress_level between 1 and 3),
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- Food logs (multiple per day)
create table food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  date date default current_date,
  meal_name text not null,
  meal_type text check (meal_type in ('breakfast','lunch','dinner','snack')),
  is_healthy boolean,
  created_at timestamptz default now()
);

-- AI coach messages (all types)
create table coach_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  message_type text check (message_type in ('daily','checkin_48hr','comeback','insight')),
  content text not null,
  response_chosen text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Active health plans
create table plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  plan_type text check (plan_type in ('standard','comeback')),
  movement_target text,
  food_target text,
  sleep_target text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Activity tracking (for 48hr silence detector)
-- One row per user, upserted on every app open
create table activity_log (
  user_id uuid references profiles(id) on delete cascade primary key,
  last_active_at timestamptz default now()
);

-- Row Level Security: users can only see their own data
alter table profiles enable row level security;
alter table checkins enable row level security;
alter table food_logs enable row level security;
alter table coach_messages enable row level security;
alter table plans enable row level security;
alter table activity_log enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "own checkins" on checkins for all using (auth.uid() = user_id);
create policy "own food_logs" on food_logs for all using (auth.uid() = user_id);
create policy "own coach_messages" on coach_messages for all using (auth.uid() = user_id);
create policy "own plans" on plans for all using (auth.uid() = user_id);
create policy "own activity" on activity_log for all using (auth.uid() = user_id);
