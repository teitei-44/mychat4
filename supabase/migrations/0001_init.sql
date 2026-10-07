create table public.mandalarts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 100),
  core_goal   text not null check (char_length(core_goal) between 1 and 50),
  -- 길이 8의 배열: [{ "title": "세부목표", "actions": ["과제1", ..., "과제8"] }, ...]
  sub_goals   jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index mandalarts_user_id_updated_idx
  on public.mandalarts (user_id, updated_at desc);

-- updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger mandalarts_set_updated_at
before update on public.mandalarts
for each row execute function public.set_updated_at();

-- RLS: 본인 데이터만 접근
alter table public.mandalarts enable row level security;

create policy "select own" on public.mandalarts
  for select using (auth.uid() = user_id);
create policy "insert own" on public.mandalarts
  for insert with check (auth.uid() = user_id);
create policy "update own" on public.mandalarts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own" on public.mandalarts
  for delete using (auth.uid() = user_id);
