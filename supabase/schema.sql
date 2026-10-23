-- Run in the SQL editor of your Supabase project. Never store secret keys in frontend code.
create table if not exists public.finance_workspaces (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now()
);
alter table public.finance_workspaces enable row level security;
create policy "Owner can read workspace" on public.finance_workspaces for select to authenticated using (auth.uid() = user_id);
create policy "Owner can create workspace" on public.finance_workspaces for insert to authenticated with check (auth.uid() = user_id);
create policy "Owner can update workspace" on public.finance_workspaces for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Owner can delete workspace" on public.finance_workspaces for delete to authenticated using (auth.uid() = user_id);
create index if not exists finance_workspaces_updated_at on public.finance_workspaces(updated_at);
