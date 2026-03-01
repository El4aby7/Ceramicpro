# Ceramic Pro Egypt

This is the fully functioning React application for Ceramic Pro Egypt, integrating with Supabase to provide a live-updating Admin Dashboard.

## Setup Instructions

### 1. Database Setup (Supabase)
To power the dynamic prices, links, and images, you will need to set up a free Supabase project.

1. Go to [Supabase](https://supabase.com) and create a new project.
2. In your Supabase dashboard, go to the **SQL Editor** on the left sidebar.
3. Open the `Sql.md` file provided in this repository.
4. Copy the SQL code blocks from `Sql.md` and paste them into the Supabase SQL Editor, then click **Run**.
   * *This will create the `prices`, `images`, and `links` tables, insert the default data, and setup Row Level Security (RLS) so that anyone can view the site, but only authenticated users can edit the site.*

### 2. Create an Admin User
Because the website is now protected, you must create an admin user to log into the dashboard.

1. In your Supabase dashboard, navigate to **Authentication** > **Users**.
2. Click **Add User** -> **Create New User**.
3. Enter your email and a strong password. You will use this to log into the `/admin` page of your website.

### 3. Environment Variables & GitHub Actions
To allow the frontend to communicate with your Supabase database securely, you need to provide your API keys to GitHub Actions.

1. Go to your repository settings on GitHub.
2. Navigate to **Secrets and variables > Actions**.
3. Create the following two **Repository Secrets**:
   * `VITE_SUPABASE_URL`: Your Supabase Project URL.
   * `VITE_SUPABASE_ANON_KEY`: Your Supabase `anon` public key (`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3ZHNyamFhYXdxbXV0ampleWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjM2MzEsImV4cCI6MjA4NzkzOTYzMX0.zi2PdeQmiPh-g5IZrh7WbypRVawHoACWz1p-fBxv6kw`).

Once added, the GitHub Action workflow will securely inject these into your production build on GitHub Pages!

### Local Development
If you want to run the project locally, create a `.env` file in the root of the repository and add:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3ZHNyamFhYXdxbXV0ampleWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjM2MzEsImV4cCI6MjA4NzkzOTYzMX0.zi2PdeQmiPh-g5IZrh7WbypRVawHoACWz1p-fBxv6kw
```

Then run:
```bash
npm install
npm run dev
```

## How to Update the Text and Images
Navigate to the `/admin` path of your deployed application (e.g., `https://username.github.io/repo/#/admin`). Log in using the email and password you created in Supabase Authentication.

* **Prices:** Update the numeric values in the input boxes and click "Save All Changes".
* **Social Links:** Update the URLs/Phone numbers in the Social & Contact section and click "Update Links".
* **Images:** Paste new image URLs directly into the inputs for each section (Hero, Logo, Services, etc.) and click "Save Images". Changes will be immediately reflected across the website.