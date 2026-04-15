import { createClient } from '@supabase/supabase-js'

// ─── Supabase SQL schema (run once in the Supabase SQL Editor) ───────────────
//
//  create table game_logs (
//    id           bigint primary key,
//    user_id      uuid references auth.users not null,
//    name         text not null,
//    cover_url    text,
//    release_year text,
//    status       text not null default 'Want to Play',
//    rating       smallint check (rating between 1 and 10),
//    review       text,
//    added_at     timestamptz default now(),
//    reviewed_at  timestamptz,
//    constraint game_logs_user_game_unique unique (user_id, id)
//  );
//
//  alter table game_logs enable row level security;
//
//  create policy "Users manage own logs"
//    on game_logs for all
//    using  (auth.uid() = user_id)
//    with check (auth.uid() = user_id);
//
// ─────────────────────────────────────────────────────────────────────────────

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)
