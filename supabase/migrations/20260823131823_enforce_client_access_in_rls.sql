-- Finding #2 (security audit 2026-08-23): RLS policies checked has_module_access()
-- but never client_access, so a collaborator restricted to specific clients could
-- still read/write every row in clients/transactions/contracts/client_status_history
-- by calling PostgREST directly, bypassing the app's own (client-side only) filtering.

create or replace function public.has_client_access(target_client_id text)
returns boolean
language sql
stable
set search_path to ''
as $$
  select public.is_admin() or exists (
    select 1 from public.collaborators c
    where c.email = (auth.jwt() ->> 'email')
      and c.status = 'approved'
      and (
        c.client_access = '"all"'::jsonb
        or (target_client_id is not null and c.client_access ? target_client_id)
      )
  );
$$;

drop policy if exists "clientes module access" on public.clients;
create policy "clientes module access" on public.clients
  for all
  to authenticated
  using (public.has_module_access('clientes') and public.has_client_access(id))
  with check (public.has_module_access('clientes') and public.has_client_access(id));

drop policy if exists "financeiro module access" on public.transactions;
create policy "financeiro module access" on public.transactions
  for all
  to authenticated
  using (public.has_module_access('financeiro') and public.has_client_access(client_id))
  with check (public.has_module_access('financeiro') and public.has_client_access(client_id));

drop policy if exists "contratos module access" on public.contracts;
create policy "contratos module access" on public.contracts
  for all
  to authenticated
  using (public.has_module_access('contratos') and public.has_client_access(client_id))
  with check (public.has_module_access('contratos') and public.has_client_access(client_id));

drop policy if exists "clientes module access" on public.client_status_history;
create policy "clientes module access" on public.client_status_history
  for all
  to authenticated
  using (public.has_module_access('clientes') and public.has_client_access(client_id))
  with check (public.has_module_access('clientes') and public.has_client_access(client_id));
