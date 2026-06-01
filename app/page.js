"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase, isConfigured } from "../lib/supabase";

const EMPTY = {
  name: "",
  phone: "",
  age: "",
  portfolio: "",
  instagram: "",
  price: "",
};

export default function Home() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");

  const appPassword = process.env.NEXT_PUBLIC_APP_PASSWORD || "";

  useEffect(() => {
    if (!appPassword) {
      setAuthed(true);
      return;
    }
    if (typeof window !== "undefined" && localStorage.getItem("cp_authed") === "1") {
      setAuthed(true);
    }
  }, [appPassword]);

  function tryLogin(e) {
    e.preventDefault();
    if (pwInput === appPassword) {
      localStorage.setItem("cp_authed", "1");
      setAuthed(true);
    } else {
      setPwError("סיסמה שגויה");
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <form
          onSubmit={tryLogin}
          className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-4"
        >
          <h1 className="text-2xl font-bold text-center">כניסת צוות</h1>
          <p className="text-sm text-slate-500 text-center">
            הזיני את סיסמת הצוות כדי לגשת למאגר היוצרות
          </p>
          <input
            type="password"
            autoFocus
            value={pwInput}
            onChange={(e) => {
              setPwInput(e.target.value);
              setPwError("");
            }}
            placeholder="סיסמה"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
          />
          {pwError && <p className="text-sm text-red-500">{pwError}</p>}
          <button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl py-3 transition">
            כניסה
          </button>
        </form>
      </div>
    );
  }

  return <Dashboard />;
}

function Dashboard() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("created_desc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    if (!isConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("creators")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    setCreators(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setError("");
    setModalOpen(true);
  }

  function openEdit(c) {
    setEditing(c);
    setForm({
      name: c.name || "",
      phone: c.phone || "",
      age: c.age ?? "",
      portfolio: c.portfolio || "",
      instagram: c.instagram || "",
      price: c.price ?? "",
    });
    setError("");
    setModalOpen(true);
  }

  async function save(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("חובה להזין שם יוצרת");
      return;
    }
    if (!isConfigured) {
      setError("מסד הנתונים לא מחובר עדיין. ראי הוראות התקנה ב-README.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      age: form.age === "" ? null : Number(form.age),
      portfolio: form.portfolio.trim() || null,
      instagram: form.instagram.trim() || null,
      price: form.price === "" ? null : Number(form.price),
    };
    let res;
    if (editing) {
      res = await supabase.from("creators").update(payload).eq("id", editing.id);
    } else {
      res = await supabase.from("creators").insert(payload);
    }
    setSaving(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    setModalOpen(false);
    load();
  }

  async function remove(c) {
    if (!confirm(`למחוק את "${c.name}"?`)) return;
    await supabase.from("creators").delete().eq("id", c.id);
    load();
  }

  const filtered = useMemo(() => {
    let list = creators.filter((c) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        (c.name || "").toLowerCase().includes(q) ||
        (c.phone || "").toLowerCase().includes(q) ||
        (c.instagram || "").toLowerCase().includes(q)
      );
    });
    if (sort === "price_asc") list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === "price_desc") list = [...list].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    if (sort === "name") list = [...list].sort((a, b) => (a.name || "").localeCompare(b.name || "", "he"));
    return list;
  }, [creators, search, sort]);

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white grid place-items-center text-lg font-bold">
              ✦
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold leading-tight">
                מאגר יוצרות תוכן
              </h1>
              <p className="text-xs text-slate-400">{creators.length} יוצרות במאגר</p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition shadow-sm"
          >
            + הוספת יוצרת
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {!isConfigured && (
          <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">
            מסד הנתונים עדיין לא מחובר. הגדירי את המשתנים{" "}
            <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> ו-
            <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (ראי README).
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם / טלפון / אינסטגרם…"
            className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-slate-300 rounded-xl px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="created_desc">הכי חדשות</option>
            <option value="name">לפי שם (א-ת)</option>
            <option value="price_asc">מחיר: נמוך לגבוה</option>
            <option value="price_desc">מחיר: גבוה לנמוך</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">טוען…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">אין יוצרות עדיין</p>
            <button onClick={openAdd} className="mt-3 text-brand-600 font-semibold">
              הוסיפי את היוצרת הראשונה →
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <CreatorCard key={c.id} c={c} onEdit={() => openEdit(c)} onDelete={() => remove(c)} />
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <form onSubmit={save} className="space-y-4">
            <h2 className="text-xl font-bold">
              {editing ? "עריכת יוצרת" : "הוספת יוצרת חדשה"}
            </h2>

            <Field label="שם יוצרת *">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
                placeholder="לדוגמה: נועה כהן"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="מספר טלפון">
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputCls}
                  placeholder="050-0000000"
                  dir="ltr"
                />
              </Field>
              <Field label="גיל">
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className={inputCls}
                  placeholder="24"
                />
              </Field>
            </div>

            <Field label="לינק לאינסטגרם">
              <input
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className={inputCls}
                placeholder="https://instagram.com/username"
                dir="ltr"
              />
            </Field>

            <Field label="תיק עבודות (לינק)">
              <input
                value={form.portfolio}
                onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                className={inputCls}
                placeholder="לינק לדרייב / יוטיוב / סרטון"
                dir="ltr"
              />
            </Field>

            <Field label="מחיר (₪)">
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputCls}
                placeholder="500"
              />
            </Field>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                disabled={saving}
                className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold rounded-xl py-3 transition"
              >
                {saving ? "שומר…" : editing ? "שמירת שינויים" : "הוספה"}
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 rounded-xl border border-slate-300 font-semibold hover:bg-slate-50"
              >
                ביטול
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

const inputCls =
  "w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-500";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-600 mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-20 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function CreatorCard({ c, onEdit, onDelete }) {
  const initial = (c.name || "?").trim().charAt(0);
  const waLink = c.phone
    ? `https://wa.me/${c.phone.replace(/[^0-9]/g, "").replace(/^0/, "972")}`
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-3 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 grid place-items-center text-xl font-bold shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-lg leading-tight truncate">{c.name}</h3>
          {c.age != null && <p className="text-xs text-slate-400">גיל {c.age}</p>}
        </div>
        {c.price != null && (
          <div className="mr-auto text-left">
            <div className="text-brand-700 font-bold text-lg">₪{Number(c.price).toLocaleString()}</div>
            <div className="text-[10px] text-slate-400">מחיר</div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {c.phone && (
          <a
            href={waLink}
            target="_blank"
            className="inline-flex items-center gap-1 bg-green-50 text-green-700 rounded-lg px-2.5 py-1 font-medium hover:bg-green-100"
          >
            וואטסאפ
          </a>
        )}
        {c.instagram && (
          <a
            href={c.instagram}
            target="_blank"
            className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 rounded-lg px-2.5 py-1 font-medium hover:bg-pink-100"
          >
            אינסטגרם
          </a>
        )}
        {c.portfolio && (
          <a
            href={c.portfolio}
            target="_blank"
            className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 rounded-lg px-2.5 py-1 font-medium hover:bg-blue-100"
          >
            תיק עבודות
          </a>
        )}
      </div>

      {c.phone && <p className="text-xs text-slate-400" dir="ltr">{c.phone}</p>}

      <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100">
        <button onClick={onEdit} className="flex-1 text-sm font-medium text-slate-600 hover:text-brand-700 py-1">
          עריכה
        </button>
        <button onClick={onDelete} className="flex-1 text-sm font-medium text-slate-400 hover:text-red-500 py-1">
          מחיקה
        </button>
      </div>
    </div>
  );
}
