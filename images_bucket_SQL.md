-- images_bucket_SQL.md

-- Create a new bucket named 'images'
insert into storage.buckets (id, name, public)
values ('images', 'images', true);

-- Policy to allow public read access to images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'images' );

-- Policy to allow authenticated users to insert/upload images
create policy "Authenticated Insert"
  on storage.objects for insert
  with check ( auth.role() = 'authenticated' and bucket_id = 'images' );

-- Policy to allow authenticated users to update images
create policy "Authenticated Update"
  on storage.objects for update
  using ( auth.role() = 'authenticated' and bucket_id = 'images' );

-- Policy to allow authenticated users to delete images
create policy "Authenticated Delete"
  on storage.objects for delete
  using ( auth.role() = 'authenticated' and bucket_id = 'images' );
