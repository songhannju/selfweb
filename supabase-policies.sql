-- Run this in Supabase Dashboard > SQL Editor.
-- These policies support the current public browser-based editor.
-- Add Supabase Auth before production if only you should be able to edit.

alter table public.blog_posts enable row level security;
alter table public.blog_posts add column if not exists image_url text;

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Anyone can read blog posts" on public.blog_posts;
drop policy if exists "Anyone can publish blog posts" on public.blog_posts;
drop policy if exists "Anyone can delete blog posts" on public.blog_posts;
create policy "Anyone can read blog posts"
on public.blog_posts
for select
to anon, authenticated
using (true);

drop policy if exists "Anyone can upload blog images" on storage.objects;
drop policy if exists "Anyone can read blog images" on storage.objects;
drop policy if exists "Anyone can delete blog images" on storage.objects;

create policy "Anyone can upload blog images"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'blog-images');

create policy "Anyone can read blog images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'blog-images');

create policy "Anyone can delete blog images"
on storage.objects
for delete
to anon, authenticated
using (bucket_id = 'blog-images');

create policy "Anyone can publish blog posts"
on public.blog_posts
for insert
to anon, authenticated
with check (true);

create policy "Anyone can delete blog posts"
on public.blog_posts
for delete
to anon, authenticated
using (true);
