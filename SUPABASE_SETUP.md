# UHS Sihma Diyara — Dynamic Features Setup

This version keeps the public website on GitHub Pages and adds Supabase for database/authentication.

## Features
- Admin login
- Notice management
- Contact messages stored in database
- Alumni registration stored in database
- Admin view of contact/alumni records
- Optional email notification for contact enquiries via Supabase Edge Function + Resend

## 1. Create Supabase project
Create a project at https://supabase.com/ . Keep the project region appropriate for your expected audience.

## 2. Create database tables
Open Supabase Dashboard → SQL Editor → New query.
Paste the complete contents of `supabase-schema.sql` and Run.

## 3. Create admin user
Supabase Dashboard → Authentication → Users → Add user.
Create the official school administrator email and a strong password.
Do NOT enable public sign-up for this school admin workflow.

## 4. Copy public credentials
Supabase Dashboard → Project Settings → API.
Copy:
- Project URL
- Publishable/anon public key

Edit `assets/supabase-config.js`:

window.UHS_SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
window.UHS_SUPABASE_ANON_KEY = 'YOUR-SUPABASE-ANON-KEY';

Only the public/anon key goes in this file. NEVER put the `service_role` key in GitHub.

## 5. Test the site
Open the GitHub Pages site.
- `/notices.html` should load published notices.
- `/contact.html` should save enquiries.
- `/alumni.html` should save registrations.
- `/admin.html` should show the login screen.

Login at `/admin.html` using the administrator account created in step 3.

## 6. Email notification (optional but recommended)
The database will work without email. To send an email whenever a visitor submits the contact form, deploy the included Edge Function.

Install Supabase CLI and login, then from the project folder:

supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy contact-email
supabase secrets set RESEND_API_KEY=YOUR_RESEND_API_KEY SCHOOL_EMAIL=school@example.com

Then update `assets/forms.js` so the contact submission calls the deployed function after the database insert. Do not put the Resend key in frontend code.

### Email sender
A production sender/domain should be configured in Resend. Do not rely on a development sender for a real school deployment.

## 7. Security checklist
- Keep service_role and email API keys out of GitHub.
- Use a strong admin password and enable MFA for the administrator account where practical.
- Do not enable public admin sign-up.
- Do not store Aadhaar, APAAR IDs, student addresses, or sensitive student records in the public-facing tables.
- Review RLS policies before adding new tables.
- Add CAPTCHA/rate limiting before heavily publicising the forms.

## 8. GitHub Pages
The public frontend remains static. Upload/push the files to the repository root and keep `CNAME` as:

uhssihmadiyara.online

GitHub Pages → Settings → Pages → Deploy from branch → main → / (root).

No npm install or Node.js build is required for the public website.
