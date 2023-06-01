-- Users
create table users (
  id                           uuid references auth.users on delete cascade not null primary key,
  updated_at                   timestamp with time zone,
  full_name                    text,
  email                        text unique not null,
  avatar_url                   text,
  has_completed_onboarding     boolean not null default false,
  subscribe_to_product_updates boolean not null default false
);

-- Teams
create table public.teams (
  id                  uuid primary key default uuid_generate_v4(),
  inserted_at         timestamp with time zone default timezone('utc'::text, now()) not null,
  slug                text not null unique,
  name                text not null,
  is_personal         boolean default false,
  stripe_customer_id  text,
  stripe_price_id     text,
  is_enterprise_plan  boolean,
  billing_cycle_start timestamp with time zone,
  created_by          uuid references public.users not null
);
comment on table public.teams is 'Teams data.';

-- Memberships
create type membership_type as enum ('viewer', 'admin');

create table public.memberships (
  id            uuid primary key default uuid_generate_v4(),
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id       uuid references public.users not null,
  team_id       uuid references public.teams not null,
  type          membership_type not null
);
comment on table public.memberships is 'Memberships of a user in a team.';

-- Projects
create table public.projects (
  id                  uuid primary key default uuid_generate_v4(),
  inserted_at         timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at          timestamp with time zone not null,
  slug                text not null,
  name                text not null,
  team_id             uuid references public.teams on delete cascade not null,
  is_starter          boolean not null default false,
  created_by          uuid references public.users not null
);
comment on table public.projects is 'Projects within a team.';

-- documents
create type status_type as enum ('ready', 'trained', 'error');

create table public.documents (
  id          bigint generated by default as identity primary key,
  name        text not null,
  content     text not null,
  project_id  uuid references public.projects on delete cascade not null,
  status      status_type not null,
  updated_at  timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Document sections
create extension if not exists vector with schema public;

create table public.document_sections (
  id          bigint generated by default as identity primary key,
  document_id bigint not null references public.documents on delete cascade,
  content     text,
  metadata    jsonb,
  embedding   vector(1536)
);

-- Triggers

-- This trigger automatically creates a user entry when a new user signs up
-- via Supabase Auth.for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, email, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'email', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a function to search for document_sections
create function match_documents (
  query_embedding vector(1536),
  match_count int,
  filter jsonb DEFAULT '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (document_sections.embedding <=> query_embedding) as similarity
  from document_sections
  where metadata @> filter
  order by document_sections.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- RLS

-- Users

alter table users
  enable row level security;

create policy "Users can only see themselves." on users
  for select using (auth.uid() = id);

create policy "Users can insert their own user." on users
  for insert with check (auth.uid() = id);

create policy "Users can update own user." on users
  for update using (auth.uid() = id);

-- Memberships

alter table memberships
  enable row level security;

create policy "Users can only see their own memberships." on public.memberships
  for select using (auth.uid() = user_id);

create policy "Users can insert memberships they belong to." on public.memberships
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own memberships." on public.memberships
  for update using (auth.uid() = user_id);

create policy "Users can delete their own memberships." on public.memberships
  for delete using (auth.uid() = user_id);

-- Teams

alter table teams
  enable row level security;

create policy "Users can only see teams they are members of." on public.teams
  for select using (
    exists (
      select 1 from memberships
      where memberships.user_id = auth.uid()
      and memberships.team_id = teams.id
    )
  );

-- Note: when a user creates a team, they are not yet members. So they should
-- just be able to create teams with no limitations
create policy "Users can insert teams." on public.teams
  for insert with check (true);

create policy "Users can update teams they are members of." on public.teams
  for update using (
    exists (
      select 1 from memberships
      where memberships.user_id = auth.uid()
      and memberships.team_id = teams.id
    )
  );

create policy "Users can delete teams they are members of." on public.teams
  for delete using (
    exists (
      select 1 from memberships
      where memberships.user_id = auth.uid()
      and memberships.team_id = teams.id
    )
  );

-- Projects

alter table projects
  enable row level security;

create policy "Users can only see projects associated to teams they are members of." on public.projects
  for select using (
    exists (
      select 1 from memberships
      where memberships.user_id = auth.uid()
      and memberships.team_id = projects.team_id
    )
  );

create policy "Users can insert projects associated to teams they are members of." on public.projects
  for insert with check (
    exists (
      select 1 from memberships
      where memberships.user_id = auth.uid()
      and memberships.team_id = projects.team_id
    )
  );

create policy "Users can update projects associated to teams they are members of." on public.projects
  for update using (
    exists (
      select 1 from memberships
      where memberships.user_id = auth.uid()
      and memberships.team_id = projects.team_id
    )
  );

create policy "Users can delete projects associated to teams they are members of." on public.projects
  for delete using (
    exists (
      select 1 from memberships
      where memberships.user_id = auth.uid()
      and memberships.team_id = projects.team_id
    )
  );

-- Documents

alter table documents
  enable row level security;

create policy "Users can only see documents associated to projects they have access to." on public.documents
  for select using (
    documents.project_id in (
      select projects.id from projects
      left join memberships
      on projects.team_id = memberships.team_id
      where memberships.user_id = auth.uid()
    )
  );

create policy "Users can insert documents associated to projects they have access to." on public.documents
  for insert with check (
    documents.project_id in (
      select projects.id from projects
      left join memberships
      on projects.team_id = memberships.team_id
      where memberships.user_id = auth.uid()
    )
  );

create policy "Users can update documents associated to projects they have access to." on public.documents
  for update using (
    documents.project_id in (
      select projects.id from projects
      left join memberships
      on projects.team_id = memberships.team_id
      where memberships.user_id = auth.uid()
    )
  );

create policy "Users can delete documents associated to projects they have access to." on public.documents
  for delete using (
    documents.project_id in (
      select projects.id from projects
      left join memberships
      on projects.team_id = memberships.team_id
      where memberships.user_id = auth.uid()
    )
  );


-- Document sections

alter table document_sections
  enable row level security;

-- No policies for document_sections: they are inaccessible to the client,
-- and only edited on the server with service_role access.
