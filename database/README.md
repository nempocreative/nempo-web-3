# Salinan database NEMPO Garut

File `nempo-database.sql` is a complete copy of the site's database, taken from the
database that is running now. It carries everything the site needs to work on a new
host: the 24 tables, their keys and indexes, the two helper functions, row-level
security turned on for every table, all 46 access rules, the access rights for
visitors / signed-in users / the site's own service, the MusiComedy Night event row,
and the trigger that hands admin access to allowlisted emails.

## What is not inside

- **Accounts.** The database currently has 0 accounts, so no login was carried over.
  After the copy is installed, sign up through the CMS page, then put that email in
  `public.admin_allowlist` — the trigger in section 11 makes it an admin once the
  email is confirmed.
- **Storage files.** Photos uploaded to the private "yearbook-moments" bucket are
  files, not database rows, so they are not in this copy.
- **Any data added after this copy was taken.** Every table except `events` was
  empty when the copy was made.

## Pushing to GitHub

The repository is connected from the Lovable side, not from here:

1. Open **Project settings → Git** and connect a GitHub account. This creates a new
   private repository and syncs this project's code into it, `database/` included.
2. Pushes to the synced branch carry the code only — the database itself never rides
   along, which is why this file exists.

## Installing the copy on a new host

1. Create an empty database (a new Supabase project, or an empty PostgreSQL).
2. Run `nempo-database.sql` in it, top to bottom, in one pass (SQL Editor or `psql`).
3. Point the app at the new database by setting `VITE_SUPABASE_URL`,
   `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_SUPABASE_PROJECT_ID`, then build again.
4. Check the site: `/api/events` should answer with MusiComedy Night, `/program`
   should still open both proposals, and the CMS should open for an allowlisted admin.

## Notes worth knowing

- Section 11 (`CREATE TRIGGER on_auth_user_confirmed_grant_admin`) is **not present in
  the running database right now** — the function it calls is there, the trigger is
  not. Running that section on the current database restores automatic admin granting;
  running it on a fresh install is what makes the CMS usable.
- Anonymous visitors can read the public content tables and submit the community
  application and partnership proposal forms. `berita`, `media_archive`,
  `site_settings`, `admin_allowlist`, `user_roles` and `yearbook_photo_submissions`
  are not readable without signing in.
- `docs/schema-baseline/` keeps the older step-by-step version of the same schema;
  this file is the single-file, verified copy of what the database actually holds.
