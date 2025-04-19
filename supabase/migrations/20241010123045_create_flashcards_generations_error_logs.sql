/*
 migration: create_flashcards_generations_error_logs
 description: creates the tables flashcards, generations, and generation_error_logs with rls policies to ensure that users can only access their own records.
 notes: each record in flashcards is associated with a user (user_id) and optionally a generation (generation_id). all tables include proper indices and foreign key constraints.
 caution: always verify rls policies in production.
 timestamp: 2024-10-10 12:30:45 (utc)
*/

-- create generations table first since it is referenced by flashcards
create table generations (
    id bigserial primary key,
    user_id uuid not null references auth.users(id),
    model varchar(50) not null,
    generated_count integer not null default 0,
    accepted_unedited_count integer not null default 0,
    accepted_edited_count integer not null default 0,
    source_text_hash text not null,
    source_text_length integer not null check (source_text_length between 1000 and 10000),
    generation_duration interval not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- create flashcards table which references generations
create table flashcards (
    id bigserial primary key,
    front varchar(200) not null,
    back varchar(500) not null,
    source varchar(20) not null check (source in ('ai-full', 'ai-edited', 'manual')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    generation_id bigint references generations(id) on delete set null,
    user_id uuid not null references auth.users(id)
);

-- create generation_error_logs table
create table generation_error_logs (
    id bigserial primary key,
    user_id uuid not null references auth.users(id),
    model varchar(50) not null,
    source_text_hash text not null,
    source_text_length integer not null check (source_text_length between 1000 and 10000),
    error_code varchar(50) not null,
    error_message text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- create indices for performance optimization
create index idx_generations_user_id on generations(user_id);

create index idx_flashcards_user_id on flashcards(user_id);
create index idx_flashcards_generation_id on flashcards(generation_id);

create index idx_generation_error_logs_user_id on generation_error_logs(user_id);

-- enable row level security (rls) on all tables
alter table generations enable row level security;
alter table flashcards enable row level security;
alter table generation_error_logs enable row level security;

-- create rls policies for generations table

-- select policies for generations table to ensure users only access their own records
create policy generations_select_anon on generations
    for select
    to anon
    using (user_id = auth.uid());

create policy generations_select_auth on generations
    for select
    to authenticated
    using (user_id = auth.uid());

-- insert policies for generations table
create policy generations_insert_anon on generations
    for insert
    to anon
    with check (user_id = auth.uid());

create policy generations_insert_auth on generations
    for insert
    to authenticated
    with check (user_id = auth.uid());

-- update policies for generations table
create policy generations_update_anon on generations
    for update
    to anon
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

create policy generations_update_auth on generations
    for update
    to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

-- delete policies for generations table
create policy generations_delete_anon on generations
    for delete
    to anon
    using (user_id = auth.uid());

create policy generations_delete_auth on generations
    for delete
    to authenticated
    using (user_id = auth.uid());

-- create rls policies for flashcards table

create policy flashcards_select_anon on flashcards
    for select
    to anon
    using (user_id = auth.uid());

create policy flashcards_select_auth on flashcards
    for select
    to authenticated
    using (user_id = auth.uid());

create policy flashcards_insert_anon on flashcards
    for insert
    to anon
    with check (user_id = auth.uid());

create policy flashcards_insert_auth on flashcards
    for insert
    to authenticated
    with check (user_id = auth.uid());

create policy flashcards_update_anon on flashcards
    for update
    to anon
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

create policy flashcards_update_auth on flashcards
    for update
    to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

create policy flashcards_delete_anon on flashcards
    for delete
    to anon
    using (user_id = auth.uid());

create policy flashcards_delete_auth on flashcards
    for delete
    to authenticated
    using (user_id = auth.uid());

-- create rls policies for generation_error_logs table

create policy generation_error_logs_select_anon on generation_error_logs
    for select
    to anon
    using (user_id = auth.uid());

create policy generation_error_logs_select_auth on generation_error_logs
    for select
    to authenticated
    using (user_id = auth.uid());

create policy generation_error_logs_insert_anon on generation_error_logs
    for insert
    to anon
    with check (user_id = auth.uid());

create policy generation_error_logs_insert_auth on generation_error_logs
    for insert
    to authenticated
    with check (user_id = auth.uid());

create policy generation_error_logs_update_anon on generation_error_logs
    for update
    to anon
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

create policy generation_error_logs_update_auth on generation_error_logs
    for update
    to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

create policy generation_error_logs_delete_anon on generation_error_logs
    for delete
    to anon
    using (user_id = auth.uid());

create policy generation_error_logs_delete_auth on generation_error_logs
    for delete
    to authenticated
    using (user_id = auth.uid()); 