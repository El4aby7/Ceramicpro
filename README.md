# Ceramic Pro Egypt

This is the fully functioning website for Ceramic Pro Egypt, built with HTML, CSS (Tailwind via CDN), and JavaScript, and integrated with Supabase to provide a live-updating Admin Dashboard.

## Setup Instructions

### 1. Database Setup (Supabase)
To power the dynamic prices, links, and images, you need to set up your Supabase project.

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/jwdsrjaawqmutjeyan) and open the **SQL Editor** on the left sidebar.
2. Run the following SQL to set up the database tables and security:

```sql
-- Create prices table
CREATE TABLE prices (
    id SERIAL PRIMARY KEY,
    service_key VARCHAR(50) UNIQUE NOT NULL,
    amount VARCHAR(50) NOT NULL
);

-- Create links table
CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) UNIQUE NOT NULL,
    url TEXT NOT NULL
);

-- Create images table
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    image_key VARCHAR(50) UNIQUE NOT NULL,
    url TEXT NOT NULL
);

-- Insert default prices
INSERT INTO prices (service_key, amount) VALUES
('ppf', '15,000'),
('nano', '8,000'),
('correction', '4,500'),
('interior', '2,000'),
('headlights', '800');

-- Insert default links
INSERT INTO links (platform, url) VALUES
('facebook', 'https://facebook.com/ceramicproegypt'),
('instagram', 'https://instagram.com/ceramicpro_eg'),
('phone', '+20 100 123 4567'),
('email', 'info@ceramicpro.eg');

-- Insert default images
INSERT INTO images (image_key, url) VALUES
('logo', ''),
('hero', ''),
('ppf', ''),
('nano', ''),
('correction', ''),
('interior', ''),
('headlights', '');

-- Set up Row Level Security (RLS)
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access for prices" ON prices FOR SELECT USING (true);
CREATE POLICY "Public read access for links" ON links FOR SELECT USING (true);
CREATE POLICY "Public read access for images" ON images FOR SELECT USING (true);

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update prices" ON prices FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update links" ON links FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update images" ON images FOR UPDATE USING (auth.role() = 'authenticated');
```

### 2. Create an Admin User
Because the website is protected, you must create an admin user to log into the dashboard.

1. In your Supabase dashboard, navigate to **Authentication** > **Users**.
2. Click **Add User** -> **Create New User**.
3. Enter your email and a strong password. You will use this to log into the `/admin.html` page of your website.

### 3. Local Development
Because this project uses plain HTML/JS and relies on external CDNs (Tailwind and Supabase), there is no build step required.

To run the project locally:
1. You can simply open `index.html` in your web browser.
2. Or better yet, use a local server like `Live Server` in VSCode, or run `python -m http.server 8000` in the directory.

## How to Update the Text and Images

Navigate to the `admin.html` path of your deployed application (e.g., `https://username.github.io/repo/admin.html`). Log in using the email and password you created in Supabase Authentication. After successfully logging in, you will be able to access the admin dashboard.

* **Prices:** Update the numeric values in the input boxes and click "Save All Changes".
* **Social Links:** Update the URLs/Phone numbers in the Social & Contact section and click "Update Links".
* **Images:** By default, the website uses local images (`assets/images/`). To override these with dynamic images, paste the image URL (e.g., ending in `.jpg` or `.png`) directly into the inputs for each section (Logo, PPF, Nano Ceramic, etc.) in the Admin dashboard and click "Save Images". Changes will immediately be reflected across the website on the next reload. To revert back to local images, clear out the URL input and save.