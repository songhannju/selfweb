-- Run this in Supabase Dashboard > SQL Editor.
-- Records page views and pushes a daily summary to your phone through ntfy (https://ntfy.sh).
-- Replace YOUR_NTFY_TOPIC with your private topic before running. This repo is public: never commit the real topic.
-- A filled-in copy lives in supabase-page-views.local.sql, which git ignores.

create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  viewed_at timestamptz not null default now(),
  page text not null check (page in ('resume', 'blog')),
  referrer_host text check (char_length(referrer_host) <= 255)
);

alter table public.page_views enable row level security;

-- Visitors can record a view but cannot read the log (no select policy).
drop policy if exists "Anyone can record a page view" on public.page_views;
create policy "Anyone can record a page view"
on public.page_views
for insert
to anon, authenticated
with check (true);

create or replace function public.send_daily_view_summary()
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  total int;
  resume_views int;
  blog_views int;
  sources text;
begin
  select count(*), count(*) filter (where page = 'resume'), count(*) filter (where page = 'blog')
  into total, resume_views, blog_views
  from page_views
  where viewed_at >= now() - interval '24 hours';

  select string_agg(host || ' (' || views || ')', ', ' order by views desc)
  into sources
  from (
    select coalesce(referrer_host, 'direct') as host, count(*) as views
    from page_views
    where viewed_at >= now() - interval '24 hours'
    group by 1
    order by 2 desc
    limit 5
  ) top_sources;

  perform net.http_post(
    url := 'https://ntfy.sh',
    body := jsonb_build_object(
      'topic', 'YOUR_NTFY_TOPIC',
      'title', 'Website: ' || total || case when total = 1 then ' view' else ' views' end || ' today',
      'message', case
        when total = 0 then 'No visits in the last 24 hours.'
        else format(E'Resume page: %s\nBlog: %s\nFrom: %s', resume_views, blog_views, sources)
      end,
      'tags', jsonb_build_array('eyes')
    )
  );
end;
$$;

-- Keep visitors from triggering the push themselves through the API.
revoke execute on function public.send_daily_view_summary() from public, anon, authenticated;

-- Every day at 01:00 UTC (9 PM Eastern in summer, 8 PM in winter).
select cron.unschedule('daily-view-summary')
where exists (select 1 from cron.job where jobname = 'daily-view-summary');
select cron.schedule('daily-view-summary', '0 1 * * *', 'select public.send_daily_view_summary()');
