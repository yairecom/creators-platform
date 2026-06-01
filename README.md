# פלטפורמת יוצרות תוכן 🎬

מאגר משותף לניהול יוצרות תוכן עבור הצוות. כל חברת צוות נכנסת מלינק אחד ורואה את אותו המידע בזמן אמת.

לכל יוצרת: **שם · טלפון (עם כפתור וואטסאפ) · גיל · תיק עבודות · אינסטגרם · מחיר**.

---

## הקמה ב-3 שלבים (כ-5 דקות)

### 1️⃣ מסד נתונים — Supabase (חינם)
1. כנסי ל-[supabase.com](https://supabase.com) → **New project** (בחרי שם וסיסמה, אזור Frankfurt).
2. אחרי שהפרויקט עולה: בתפריט → **SQL Editor** → **New query**.
3. העתיקי את כל התוכן של [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
4. עברי ל-**Project Settings → API** והעתיקי:
   - `Project URL`  → זה ה-`NEXT_PUBLIC_SUPABASE_URL`
   - `anon public`  → זה ה-`NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2️⃣ פריסה — Vercel
1. כנסי ל-[vercel.com/new](https://vercel.com/new) → **Import** את הריפו הזה מ-GitHub.
2. לפני Deploy, פתחי **Environment Variables** והדביקי:
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | ה-URL מסעיף 1 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ה-anon key מסעיף 1 |
   | `NEXT_PUBLIC_APP_PASSWORD` | סיסמה לצוות (לבחירתך) |
3. **Deploy**. בסיום תקבלי לינק — זה הלינק שמשתפים עם הצוות.

### 3️⃣ זהו!
שלחי לצוות את הלינק + הסיסמה. כולם נכנסים, רואים ומוסיפים יוצרות.

---

## הרצה מקומית (אופציונלי)
```bash
npm install
cp .env.example .env.local   # מלאי את הערכים
npm run dev                  # http://localhost:3000
```

## הערות
- **שינוי הסיסמה:** Vercel → Settings → Environment Variables → ערכי את `NEXT_PUBLIC_APP_PASSWORD` ו-Redeploy.
- הכלי מיועד לשימוש פנימי. הסיסמה + סודיות הלינק הם שכבת ההגנה. אם תרצי הרשאות אמיתיות לכל משתמש — אפשר להוסיף Supabase Auth בהמשך.
