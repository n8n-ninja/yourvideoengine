do $$
declare
  client_id uuid;
begin
  select id into client_id from clients where slug = 'client1';

  if client_id is null then
    raise exception 'Client with slug "client1" not found';
  end if;

  execute '
    create table if not exists public.client1_testinvoice (
      id uuid primary key default gen_random_uuid(),
      client_id uuid not null references clients(id),
      created_at timestamp with time zone default now()
    );

    alter table public.client1_testinvoice enable row level security;

    create policy "Allow SELECT for client users"
      on public.client1_testinvoice
      for select to public
      using (
        EXISTS (
          SELECT 1 FROM client_users
          WHERE client_users.user_id = auth.uid()
            AND client_users.client_id = client1_testinvoice.client_id
        )
      );

    create policy "Allow INSERT for client users"
      on public.client1_testinvoice
      for insert to public
      with check (
        EXISTS (
          SELECT 1 FROM client_users
          WHERE client_users.user_id = auth.uid()
            AND client_users.client_id = client1_testinvoice.client_id
        )
      );

    create policy "Allow UPDATE for client users"
      on public.client1_testinvoice
      for update to public
      using (
        EXISTS (
          SELECT 1 FROM client_users
          WHERE client_users.user_id = auth.uid()
            AND client_users.client_id = client1_testinvoice.client_id
        )
      );

    create policy "Allow DELETE for client users"
      on public.client1_testinvoice
      for delete to public
      using (
        EXISTS (
          SELECT 1 FROM client_users
          WHERE client_users.user_id = auth.uid()
            AND client_users.client_id = client1_testinvoice.client_id
        )
      );
  ';
end $$;