-- Helper RPC function used by the Railway cron silence detector.
-- Returns users inactive for 48+ hours who haven't received a check-in message recently.

create or replace function get_inactive_users()
returns table (
  id uuid,
  name text,
  expo_push_token text,
  last_active_at timestamptz,
  sleep int,
  energy int,
  stress int
)
language sql
security definer
as $$
  select
    p.id,
    p.name,
    p.expo_push_token,
    a.last_active_at,
    c.sleep_quality as sleep,
    c.energy_level as energy,
    c.stress_level as stress
  from activity_log a
  join profiles p on p.id = a.user_id
  left join lateral (
    select sleep_quality, energy_level, stress_level
    from checkins
    where user_id = a.user_id
    order by date desc
    limit 1
  ) c on true
  where a.last_active_at < now() - interval '48 hours'
  and p.id not in (
    select user_id from coach_messages
    where message_type = 'checkin_48hr'
    and created_at > now() - interval '48 hours'
  );
$$;
