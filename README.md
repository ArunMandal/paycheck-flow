# Paycheck Flow

Personal paycheck distribution and debt prioritization app, with React, TypeScript, Supabase and GitHub Pages.

## What works

- Generate biweekly paychecks for approximately three years from a chosen starting date.
- For each paycheck, allocate bills due from that payday **inclusive** to the next payday **exclusive** (including bills at month boundaries).
- View allocated amount, paycheck remainder, and cumulative running cash forecast.
- Add/edit/delete/disable recurring bills and loans; all generated **future and historical projections** immediately recalculate. **Important:** removal currently changes all projections, including earlier periods; use backups before deleting records that have payment history.
- Edit the amount or paid/unpaid status of an individual scheduled bill.
- Compare loan payoff priorities (highest APR, custom priority, lowest balance) and view an optional extra-payment suggestion when an outstanding balance is supplied.
- Export/import JSON backup.
- Email/password authentication and a single-user workspace in Supabase, protected by Row Level Security.
- Local demo mode when Supabase environment values are omitted. **Local demo is not a secure multi-device sync.**

## Setup

```bash
npm install
cp .env.example .env
# Add your Supabase project URL and publishable key to .env
npm run dev
```

Run `supabase/schema.sql` in the Supabase SQL editor. Enable email/password authentication in Supabase; for local development allow `http://localhost:5173` as a redirect URL. Do not commit `.env` files. Only the Supabase **publishable** key belongs in the client; never use a secret/service-role key there.

## Deploy to GitHub Pages

1. Create a new GitHub repository and push this project to `main`.
2. Add repository **Actions secrets** `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
3. Under **Settings → Pages**, choose **GitHub Actions** as the build/deploy source.
4. Push to `main` to trigger `.github/workflows/deploy.yml`.
5. Configure your GitHub Pages site URL in Supabase Auth URL configuration.

Note: The Github Actions workflow uses `npm ci`; commit the generated `package-lock.json` after running `npm install`.

## Essential limitations before using for real money decisions

- This is a first working prototype, **not an accounting ledger**. The paid status is not deducted again (it is already allocated), but no real checking balance or automatic bank synchronization is available.
- Date range is about three years, not an exact three-year leap-day aware cutoff; pay periods are generated at 14-day intervals.
- The loan forecast includes monthly minimums indefinitely until a loan is manually archived or removed. It **does not yet compute amortization, interest accrual, automatic loan payoff, transaction-level payment history, or historical snapshots**. A modified/deleted recurring loan changes all displayed periods. A proper immutable historical ledger and effective-dated change records should be added before using this as an authoritative record.
- An extra payment recommendation is based on projected running cash, chosen reserve, and strategy; it does not execute or register a payment. Verify actual funds and upcoming obligations first.
- Multi-tab/multi-device write conflicts are not merged: the most recent saved workspace can overwrite other edits. A future version should split workspace entities into separate tables with version control.
- Free Supabase projects may pause when inactive. Periodic JSON backups are advisable.
- Default loan APR and outstanding balance are placeholder `0` until you enter them. Credit cards have **not** been added; add them as loans when desired.
