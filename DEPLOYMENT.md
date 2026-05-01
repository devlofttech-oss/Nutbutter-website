# Deployment Notes

## Required Supabase setup

1. Create a Supabase project.
2. Run migrations in `supabase/migrations`.
3. Run `supabase/seed.sql` for starter categories/products.
4. Deploy Edge Functions:
   - `create-phonepe-payment`
   - `verify-phonepe-payment`
5. Set Edge Function secrets:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FRONTEND_URL`
   - `PHONEPE_BASE_URL`
   - `PHONEPE_CLIENT_ID`
   - `PHONEPE_CLIENT_SECRET`
   - `PHONEPE_CLIENT_VERSION`

## Frontend environment

Set these for the deployed React app:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_URL=
```

## First admin

After creating your first user, insert their user id into `admin_roles`:

```sql
insert into public.admin_roles (user_id, role)
values ('USER_UUID_HERE', 'admin');
```

## Build

```bash
npm install
npm run build
```

The app is Vite SPA-ready. Configure hosting rewrites so all routes serve `index.html`.
