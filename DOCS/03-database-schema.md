# 03 — Database Schema

Full SQL in `supabase/migrations/001_initial_schema.sql`.

## Tables

### `profiles`
Extends `auth.users`. One row per user, created on signup.

| Column | Type | Notes |
|---|---|---|
| id | uuid | FK to auth.users |
| name | text | Full name from signup |
| goal | text | weight_loss / energy / sleep / stress |
| past_failure_reason | text | From onboarding step 2 |
| wake_time | text | e.g. "6–7am" |
| free_window | text | morning / evening / flexible |
| onboarded_at | timestamptz | null until onboarding complete — used for redirect logic |
| expo_push_token | text | For push notifications |

### `checkins`
One row per user per day. Unique constraint on (user_id, date).

| Column | Type | Notes |
|---|---|---|
| sleep_quality | int | 1=poor, 2=ok, 3=good |
| energy_level | int | 1=low, 2=medium, 3=high |
| stress_level | int | 1=calm, 2=some, 3=high |

### `food_logs`
Multiple rows per user per day.

| Column | Type | Notes |
|---|---|---|
| meal_name | text | What they ate |
| meal_type | text | breakfast / lunch / dinner / snack |
| is_healthy | boolean | Simple self-assessment |

### `coach_messages`
All AI messages, all types.

| Column | Type | Notes |
|---|---|---|
| message_type | text | daily / checkin_48hr / comeback / insight |
| content | text | The AI-generated message text |
| response_chosen | text | Which option user tapped (48hr messages) |
| is_read | boolean | For unread badge logic |

### `plans`
Health plans. A user may have one active plan at a time.

| Column | Type | Notes |
|---|---|---|
| plan_type | text | standard / comeback |
| movement_target | text | |
| food_target | text | |
| sleep_target | text | |
| is_active | boolean | Old plans set to false when comeback plan created |

### `activity_log`
One row per user (primary key = user_id). Upserted on every app open.

| Column | Type | Notes |
|---|---|---|
| last_active_at | timestamptz | Updated every app open — used by silence detector |

## Row Level Security

All tables have RLS enabled. Policy: `auth.uid() = user_id` (or `id` for profiles).
Users can only read and write their own data.
