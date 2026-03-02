-- images_table_SQL.md

-- Create the images table to store image URLs
create table public.images (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    image_key text unique not null,
    url text
);

-- Insert the default image keys so they can be updated from the admin dashboard
insert into public.images (image_key, url)
values
    ('logo', null),
    ('ppf', null),
    ('nano', null),
    ('correction', null),
    ('interior', null),
    ('headlights', null)
on conflict (image_key) do nothing;

-- Enable Row Level Security (RLS)
alter table public.images enable row level security;

-- Policy to allow public read access to images table
create policy "Allow public selects to images"
  on public.images for select
  using ( true );

-- Policy to allow authenticated users to update images table
create policy "Allow authenticated updates to images"
  on public.images for update
  using ( auth.role() = 'authenticated' );

-- Policy to allow authenticated users to insert to images table (if needed)
create policy "Allow authenticated inserts to images"
  on public.images for insert
  with check ( auth.role() = 'authenticated' );
