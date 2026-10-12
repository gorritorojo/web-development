create table public.loans (
  id uuid primary key default gen_random_uuid(),
  book_key text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  cover_id bigint,
  created_at timestamptz not null default now(),
  constraint loans_book_key_format check (book_key ~ '^/works/OL[0-9]+W$')
);

create index loans_user_id_idx on public.loans(user_id);

alter table public.loans enable row level security;

create policy "users can view their own loans"
  on public.loans for select
  to authenticated
  using (auth.uid() = user_id);
