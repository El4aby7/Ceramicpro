# Ceramic Pro Egypt

This is the fully functioning website for Ceramic Pro Egypt, built with HTML, CSS (Tailwind via CDN), and JavaScript, and integrated with Supabase to provide a live-updating Admin Dashboard.

## Setup Instructions

### 1. Database Setup (Supabase)
To power the dynamic prices, links, and images, you need to set up your Supabase project.

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/jwdsrjaaawqmutjjeyan) and open the **SQL Editor** on the left sidebar.
2. Open the `Sql.md` file provided in this repository.
3. Copy the SQL code blocks from `Sql.md` and paste them into the Supabase SQL Editor, then click **Run**.
   * *This will create the `prices`, `images`, and `links` tables, insert the default data, and setup Row Level Security (RLS) so that anyone can view the site, but only authenticated users can edit the site.*

### 2. Create an Admin User
Because the website is protected, you must create an admin user to log into the dashboard.

1. In your Supabase dashboard, navigate to **Authentication** > **Users**.
2. Click **Add User** -> **Create New User**.
3. Enter your email and a strong password. You will use this to log into the `/login.html` page of your website.

### 3. Local Development
Because this project uses plain HTML/JS and relies on external CDNs (Tailwind and Supabase), there is no build step required.

To run the project locally:
1. You can simply open `index.html` in your web browser.
2. Or better yet, use a local server like `Live Server` in VSCode, or run `python -m http.server 8000` in the directory.

## How to Update the Text and Images

Navigate to the `login.html` path of your deployed application (e.g., `https://username.github.io/repo/login.html`). Log in using the email and password you created in Supabase Authentication. After successfully logging in, you will be redirected to `admin.html`.

* **Prices:** Update the numeric values in the input boxes and click "Save All Changes".
* **Social Links:** Update the URLs/Phone numbers in the Social & Contact section and click "Update Links".
* **Images:** By default, the website uses local images (`assets/images/`). To override these with dynamic images, paste the image URL (e.g., ending in `.jpg` or `.png`) directly into the inputs for each section (Logo, PPF, Nano Ceramic, etc.) in the Admin dashboard and click "Save Images". Changes will immediately be reflected across the website on the next reload. To revert back to local images, clear out the URL input and save.