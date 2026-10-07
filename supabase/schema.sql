-- Chạy một lần trong SQL Editor của dự án Supabase.
begin;
create table if not exists public.learning_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  revision bigint not null default 0 check (revision >= 0),
  updated_at timestamptz not null default now(),
  constraint progress_object check (jsonb_typeof(payload) = 'object'),
  constraint progress_size check (octet_length(payload::text) <= 524288)
);
alter table public.learning_progress enable row level security;
revoke all on public.learning_progress from public, anon, authenticated;
grant select on public.learning_progress to authenticated;
drop policy if exists own_progress on public.learning_progress;
create policy own_progress on public.learning_progress for select to authenticated
using ((select auth.uid()) = user_id);

-- Khóa hàng và so phiên bản trong cùng giao dịch: không ghi đè thiết bị khác.
create or replace function public.save_learning_progress(p_payload jsonb, p_expected_revision bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare current_row public.learning_progress; account_id uuid := auth.uid();
begin
  if account_id is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if p_expected_revision is null or p_expected_revision < 0 or p_payload is null
    or jsonb_typeof(p_payload) <> 'object' or octet_length(p_payload::text) > 524288
    or p_payload->>'version' is distinct from '1'
    or jsonb_typeof(p_payload->'progress') is distinct from 'object'
  then raise exception 'Invalid progress document' using errcode = '22023'; end if;
  insert into public.learning_progress(user_id) values(account_id) on conflict (user_id) do nothing;
  select * into strict current_row from public.learning_progress where user_id = account_id for update;
  if current_row.revision <> p_expected_revision then
    return jsonb_build_object('ok',false,'revision',current_row.revision,'payload',current_row.payload);
  end if;
  update public.learning_progress set payload=p_payload, revision=revision+1, updated_at=now()
  where user_id=account_id returning * into current_row;
  return jsonb_build_object('ok',true,'revision',current_row.revision);
end;
$$;
revoke all on function public.save_learning_progress(jsonb,bigint) from public, anon;
grant execute on function public.save_learning_progress(jsonb,bigint) to authenticated;
commit;
