# Deployment Notes

## Required Supabase setup

1. Create a Supabase project.
2. Run migrations in `supabase/migrations`.
3. Run `supabase/seed.sql` for starter categories/products.
4. Deploy Edge Functions:
   - `create-phonepe-payment`
   - `verify-phonepe-payment`
   - `phonepe-webhook`
   - `create-checkout-session`
   - `estimate-shipping`
   - `track-shipment`
   - `retry-failed-operations`
5. Set Edge Function secrets:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FRONTEND_URL`
   - `PHONEPE_BASE_URL`
   - `PHONEPE_CLIENT_ID`
   - `PHONEPE_CLIENT_SECRET`
   - `PHONEPE_CLIENT_VERSION`
   - `PHONEPE_CALLBACK_URL`
   - `PHONEPE_CALLBACK_USERNAME` and `PHONEPE_CALLBACK_PASSWORD` or `PHONEPE_SALT_KEY` and `PHONEPE_SALT_INDEX`
   - `SHIPROCKET_BASE_URL`
   - `SHIPROCKET_EMAIL`
   - `SHIPROCKET_PASSWORD`
   - `SHIPROCKET_PICKUP_POSTCODE`
   - `SHIPROCKET_PICKUP_LOCATION`
   - `SHIPROCKET_CHANNEL_ID`
   - `SHIPROCKET_DEFAULT_WEIGHT_KG`
   - `SHIPROCKET_PACKAGE_LENGTH_CM`
   - `SHIPROCKET_PACKAGE_BREADTH_CM`
   - `SHIPROCKET_PACKAGE_HEIGHT_CM`
   - `SHIPROCKET_FULFILLMENT_MODE` (`full` assigns AWB; `order_only` creates the Shiprocket order without AWB assignment or wallet deduction)
   - `SHIPROCKET_SKIP_AWB_ASSIGNMENT` (optional emergency/test override: `true` skips AWB assignment)
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `EMAIL_FROM_NAME`
   - `SUPPORT_EMAIL`
   - `CRON_SECRET`

## Transactional email setup

1. Verify the sending domain in Resend.
2. Set `RESEND_API_KEY` and `EMAIL_FROM` for Supabase Edge Functions.
3. Order confirmation and shipping confirmation emails are sent idempotently through `email_events`.
4. Copy `supabase/email-templates/password-reset.html` into Supabase Dashboard > Authentication > Email Templates > Reset Password.

## Webhooks

Configure PhonePe to call:

```text
https://YOUR_PROJECT_REF.supabase.co/functions/v1/phonepe-webhook
```

Use either basic callback credentials or x-verify salt secrets, matching the secrets listed above.

## Reliability notes

- `finalize_paid_checkout_session` atomically validates/decrements inventory and creates exactly one order per checkout session.
- PhonePe success-page verification and PhonePe webhooks both use the same finalization path.
- `phonepe_webhook_events`, `email_events`, and shipment retry fields store processing state, retry counts, and failure reasons.
- Failed Shiprocket syncs keep the order confirmed and store retry metadata for a later manual or scheduled retry.
- For live checkout tests where the Shiprocket wallet should not be charged, set `SHIPROCKET_FULFILLMENT_MODE=order_only` before deploying the functions. The checkout order and Shiprocket order are still created, but AWB assignment is skipped.
- Schedule `retry-failed-operations` from Supabase cron or an external monitor with header `x-cron-secret: CRON_SECRET`; it retries failed PhonePe processing, Shiprocket syncs, and failed Resend email events.

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
npm run test
```

The app is Vite SPA-ready. Configure hosting rewrites so all routes serve `index.html`.
