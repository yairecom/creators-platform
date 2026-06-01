-- ====================================================================
-- מאגר יוצרות תוכן — סכמת מסד נתונים
-- הריצי את כל הקובץ הזה ב-Supabase: SQL Editor → New query → Run
-- ====================================================================

create table if not exists public.creators (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  role        text,   -- יוצר תוכן / שחקן / צלם / אולפן פודקאסט
  gender      text,   -- "אישה" / "גבר"
  phone       text,
  age         int,
  portfolio   text,   -- לינק לתיק עבודות
  instagram   text,   -- לינק לאינסטגרם
  price       numeric, -- מחיר בש"ח
  notes       text,   -- תוצרים שסיפקה / הערות על ההתנהלות (לעריכה בלבד)
  rating      int      -- דירוג כללי 1-5
);

-- עבור טבלאות קיימות — הוספת העמודות החדשות אם חסרות:
alter table public.creators add column if not exists role   text;
alter table public.creators add column if not exists gender text;
alter table public.creators add column if not exists notes  text;
alter table public.creators add column if not exists rating int;

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
