-- Create a table for Gallery Posts
create table if not exists public.gallery_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text, -- Description or text body
  media_url text, -- URL to the file in storage
  media_type text, -- 'image', 'video', 'file'
  author_name text default 'Anonymous',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.gallery_posts enable row level security;

-- Policy: Everyone can read
create policy "Everyone can view gallery posts" 
  on public.gallery_posts for select 
  using (true);

-- Policy: Everyone can insert (Public Board)
create policy "Everyone can create gallery posts" 
  on public.gallery_posts for insert 
  with check (true);

-- Storage: Create a bucket for 'gallery'
insert into storage.buckets (id, name, public) 
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Storage Policy: Public access
create policy "Public Access" 
  on storage.objects for select 
  using ( bucket_id = 'gallery' );

create policy "Public Upload" 
  on storage.objects for insert 
  with check ( bucket_id = 'gallery' );
