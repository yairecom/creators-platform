-- ====================================================================
-- מאגר יוצרות תוכן — סכמת מסד נתונים
-- הריצי את כל הקובץ הזה ב-Supabase: SQL Editor → New query → Run
-- ====================================================================

create table if not exists public.creators (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  phone       text,
  age         int,
  portfolio   text,   -- לינק לתיק עבודות
  instagram   text,   -- לינק לאינסטגרם
  price       numeric -- מחיר בש"ח
);

-- הפעלת אבטחת שורות
alter table public.creators enable row level security;

-- מדיניות פתוחה לכלי פנימי (כל מי שיש לו את ה-anon key יכול לקרוא/לכתוב).
-- האבטחה בפועל נעשית דרך סיסמת הצוות באפליקציה + סודיות הלינק.
drop policy if exists "team full access" on public.creators;
create policy "team full access"
  on public.creators
  for all
  using (true)
  with check (true);
