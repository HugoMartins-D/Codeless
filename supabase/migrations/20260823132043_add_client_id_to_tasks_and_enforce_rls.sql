-- tasks had no client_id (only a free-text "client" name column), so clientAccess
-- could not be enforced at the database level for that table — see finding #1/#2 of
-- the security audit. Adds a real client_id + backfills it by matching the existing
-- free-text client name, then updates the demandas RLS policies to require
-- has_client_access(client_id), same as the other client-scoped tables.
--
-- Product decision: tasks with no client_id are hidden from collaborators whose
-- client_access is restricted to specific clients (has_client_access(null) = false
-- unless client_access = "all" or the collaborator is admin).

alter table public.tasks add column if not exists client_id text references public.clients(id);

update public.tasks t
set client_id = c.id
from public.clients c
where t.client_id is null
  and lower(trim(t.client)) = lower(trim(c.name));

drop policy if exists "demandas view" on public.tasks;
create policy "demandas view" on public.tasks
  for select
  to authenticated
  using (public.has_module_access('demandas') and public.has_client_access(client_id));

drop policy if exists "demandas update" on public.tasks;
create policy "demandas update" on public.tasks
  for update
  to authenticated
  using (public.has_module_access('demandas') and public.has_client_access(client_id))
  with check (public.has_module_access('demandas') and public.has_client_access(client_id));

drop policy if exists "demandas delete" on public.tasks;
create policy "demandas delete" on public.tasks
  for delete
  to authenticated
  using (public.has_module_access('demandas') and public.has_client_access(client_id));

drop policy if exists "demandas insert" on public.tasks;
create policy "demandas insert" on public.tasks
  for insert
  to authenticated
  with check (public.can_create_demandas() and public.has_client_access(client_id));
