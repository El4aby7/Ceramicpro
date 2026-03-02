-- Booking_contacts_SQL.md

-- Create the bookings table
create table public.bookings (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    service_name text not null,
    booking_date date not null,
    booking_time time not null,
    car_make text,
    car_model text,
    license_plate text,
    full_name text not null,
    phone_number text not null,
    total_price text,
    status text default 'pending'
);

-- Enable Row Level Security (RLS) for bookings
alter table public.bookings enable row level security;

-- Allow anyone to insert a booking (public access)
create policy "Allow anonymous inserts to bookings"
  on public.bookings for insert
  with check ( true );

-- Allow only authenticated users to view bookings
create policy "Allow authenticated selects to bookings"
  on public.bookings for select
  using ( auth.role() = 'authenticated' );

-- Create the contacts table
create table public.contacts (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    full_name text not null,
    phone_number text,
    email_address text,
    interest text,
    message text not null,
    status text default 'unread'
);

-- Enable Row Level Security (RLS) for contacts
alter table public.contacts enable row level security;

-- Allow anyone to insert a contact message (public access)
create policy "Allow anonymous inserts to contacts"
  on public.contacts for insert
  with check ( true );

-- Allow only authenticated users to view contacts
create policy "Allow authenticated selects to contacts"
  on public.contacts for select
  using ( auth.role() = 'authenticated' );
