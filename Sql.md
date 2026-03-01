# Supabase Database Setup

Run the following SQL in your Supabase SQL Editor to set up the necessary tables, insert default values, and enable Row Level Security (RLS) so that only authenticated users can modify the content.

```sql
-- Create prices table
CREATE TABLE IF NOT EXISTS prices (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL
);

-- Create links table
CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL
);

-- Insert default prices
INSERT INTO prices (id, name, price, description) VALUES
    ('ppf', 'PPF Protection', '15000', 'High-gloss Paint Protection Film to prevent scratches and chips.'),
    ('nano', 'Nano Ceramic', '8000', '9H ceramic coating for extreme gloss and hydrophobic effect.'),
    ('correction', 'Paint Correction', '4500', 'Multi-stage polishing to remove swirls and oxidation.'),
    ('detailing', 'Interior Detailing', '2000', 'Deep cleaning and leather protection for your cabin.'),
    ('headlights', 'Headlights Polish', '800', 'Restore clarity and brightness to foggy headlights.')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price;

-- Insert default links
INSERT INTO links (id, name, url) VALUES
    ('facebook', 'Facebook', 'https://facebook.com/ceramicproegypt'),
    ('instagram', 'Instagram', 'https://instagram.com/ceramicpro_eg'),
    ('whatsapp', 'WhatsApp', '+201001234567'),
    ('tiktok', 'TikTok', 'https://tiktok.com/@ceramicpro_eg'),
    ('email', 'Email', 'info@ceramicpro.eg'),
    ('phone', 'Phone', '+20 100 123 4567')
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

-- Insert default images
INSERT INTO images (id, name, url) VALUES
    ('logo', 'Main Logo', 'https://image2url.com/r2/default/images/1772357315074-6c79bbf0-f81e-4143-9278-05ed53fe942d.jpg'),
    ('hero', 'Hero Section Background', 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop'),
    ('ppf', 'PPF Service', 'https://lh3.googleusercontent.com/aida-public/AB6AXuARbjdw0VQLFxPqsbetNok42_Lg9CoPzLn3qPlXNypICciUNpkh4SDkQ5uXOgE1wxXzFxIeWIYXD7koMZvE3eNCbBro2Dj6J7cZ0peDhPH2TumDwORgaB0JAqk4U8T5k0lqePg9uey_2beC1gGTrHDKdaMvPr2MEhqQEvYDydj8e1iI4_fS_CUvpfAg45bHqS6Y0jc_40_F2cvb2bcsnfVqTaomIVeXUshnFaZHMOUImo8_JB67YE-ZyFM697YrsCrYPgN0z9s6rFE'),
    ('nano', 'Nano Ceramic Service', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjYNOYyZc4tZoC0yUrPtOmb7_wzuYPQ3LFAQeaIR7DAsIUIRVGV_vp4DIOY6bCSF1WGLCjfGQ2v0VvLrhRhkB9pambNF-_v3LWNQcShzcAjC-EYPoPaBURrPJoIAW5CydOED8xZ8FzZkwS_OrCKVZAefJCSYpkY8X3DUfe6GqlFc3LWDzoSUKuIkbwJpnlIOoDOkl6OkK6lHp9JzlY71kKm8bwOa7AuRgLmyoFa89qYKgCQxL0JuukSCt4om7i-BOaoRe8YI7oDcI'),
    ('correction', 'Paint Correction Service', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX0p9WW8qS96VYFNgWQ7H_aQknkAPLR5zx1RRlQQHxehgnhwoJu_eh0Gj8RTr048TiJ1VyGzQq-P8rnc676E7k8kCtZeMjGdYFL64Iig_0eHw9r-zGvvAN27tZ3UpkJrQIGXZOeOt2iAUBBLeXQCSIzsFyv0rVHi5xS_C7SnSMUaZwCqoC3jEdrEKTIGJ6H_FaFVxB4MSGIunlsDGUhQ0REwtU_5UUXjIaxTq7hyVFJdCZvkc1tJ7aOlDoiLx30wjPHovqJ3XmnSs'),
    ('detailing', 'Interior Detailing Service', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXwsoS1X13s7VCm8bMeh6KnjA_6A5-ahVti5VoYVKQFiEpBqhxJhe31uc_StaUmqPXKApwWX0i_wy0wekpKY45mhbLTf5MNSSSBnnHZFizUr5FKT-Cvq4x4ici9maFlTALjcmgGsxwxS1XuFsQPuQN1edPpcVZ8U41xFdVmv3lqEYwKtWJnLkQZs4D6r1qr1yQ3zkNQ286_QsYLCgWxqot8yEoI7Vd-LPlK0THeKx2zGNdtsc9hYkZI7dqnthGynBTiMS8TSHqvFY'),
    ('headlights', 'Headlights Service', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDusA7wrEn7HDkF4H2L80Mu4jb8f9TWkhCrmU0EbUvzO2YTJ-Leos261UxZDbpwLBXSB5KH-bAIfl75cNQD8odp8oMcWUvYnYnf0djpU3wQU7kGDF62EqxApV7nAm3yjq6Cb7ERfGK39c9G1XSvHVEG1zIifKRGty4gyq9K5zxKAIvXIDwKbtlUT6COPNnZ78GsJvvyQnpZ8CmLNKYlqGJY4ZNa-0I47UCw7N4hPGt90VNHOwbJ9pA7bRvgtfqMrbfMho14VW_DftY')
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

-- Enable Row Level Security (RLS)
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all users (authenticated and anonymous)
CREATE POLICY "Allow public read access to prices" ON prices FOR SELECT USING (true);
CREATE POLICY "Allow public read access to images" ON images FOR SELECT USING (true);
CREATE POLICY "Allow public read access to links" ON links FOR SELECT USING (true);

-- Allow write access ONLY to authenticated users
CREATE POLICY "Allow write access to prices for authenticated users" ON prices FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access to images for authenticated users" ON images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access to links for authenticated users" ON links FOR ALL USING (auth.role() = 'authenticated');
```