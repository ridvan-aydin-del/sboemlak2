"use client";

import { useState } from "react";

const LIMITS = {
  customer_name: 100,
  customer_phone: 20,
  note: 500,
  budget_max: 999_999_999_999,
  budget_min: 0,
} as const;

interface LeadFormProps {
  compact?: boolean;
}

export function LeadForm({ compact = false }: LeadFormProps) {
  
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    listing_type: "satilik" as "satilik" | "kiralik",
    property_type: "konut" as "konut" | "isYeri" | "arsa",
    min_budget: "",
    max_budget: "",
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const name = form.customer_name.trim().slice(0, LIMITS.customer_name);
    const phone = form.customer_phone.trim().slice(0, LIMITS.customer_phone);
    const noteVal = form.note.trim().slice(0, LIMITS.note) || null;
    let minB: number | null = null;
    let maxB: number | null = null;
    if (form.min_budget) {
      const n = Number(form.min_budget);
      if (Number.isNaN(n) || n < LIMITS.budget_min || n > LIMITS.budget_max) {
        setError("Min. bütçe geçerli bir sayı olmalı (0 - 999.999.999.999).");
        setLoading(false);
        return;
      }
      minB = n;
    }
    if (form.max_budget) {
      const n = Number(form.max_budget);
      if (Number.isNaN(n) || n < LIMITS.budget_min || n > LIMITS.budget_max) {
        setError("Max. bütçe geçerli bir sayı olmalı (0 - 999.999.999.999).");
        setLoading(false);
        return;
      }
      maxB = n;
    }
    if (!name || !phone) {
      setError("Ad Soyad ve Telefon zorunludur.");
      setLoading(false);
      return;
    }

    const url = "/api/customer-request";    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: name,
        customer_phone: phone,
        listing_type: form.listing_type,
        property_type: form.property_type,
        min_budget: minB,
        max_budget: maxB,
        note: noteVal,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data?.error || "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      setLoading(false);
      return;
    }

    setSent(true);
    setForm({
      customer_name: "",
      customer_phone: "",
      listing_type: "satilik",
      property_type: "konut",
      min_budget: "",
      max_budget: "",
      note: "",
    });
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-800">
        <p className="font-semibold">Talebiniz alındı!</p>
        <p className="mt-1 text-xs">
          Uygun ilan olduğunda sizinle iletişime geçeceğiz.
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <h3 className="mb-3 text-sm font-semibold text-slate-900">
          İlan bulamadınız mı? Bize iletin
        </h3>
        <div className="space-y-3 text-xs">
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              required
              maxLength={LIMITS.customer_name}
              value={form.customer_name}
              onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value.slice(0, LIMITS.customer_name) }))}
              placeholder="Ad Soyad (en fazla 100 karakter)"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
            />
            <input
              required
              type="tel"
              maxLength={LIMITS.customer_phone}
              value={form.customer_phone}
              onChange={(e) => setForm((f) => ({ ...f, customer_phone: e.target.value.slice(0, LIMITS.customer_phone) }))}
              placeholder="Telefon (en fazla 20 karakter)"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <span className="font-medium text-slate-600">Satılık / Kiralık</span>
            <div className="mt-1 flex flex-wrap gap-3">
              {(["satilik", "kiralik"] as const).map((t) => (
                <label key={t} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="type"
                    checked={form.listing_type === t}
                    onChange={() => setForm((f) => ({ ...f, listing_type: t }))}
                  />
                  {t === "satilik" ? "Satılık" : "Kiralık"}
                </label>
              ))}
            </div>
          </div>
          <div>
            <span className="font-medium text-slate-600">Konut / İş Yeri / Arsa</span>
            <div className="mt-1 flex flex-wrap gap-3">
              {(["konut", "isYeri", "arsa"] as const).map((c) => (
                <label key={c} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="category"
                    checked={form.property_type === c}
                    onChange={() => setForm((f) => ({ ...f, property_type: c }))}
                  />
                  {c === "konut" ? "Konut" : c === "isYeri" ? "İş Yeri" : "Arsa"}
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              type="number"
              min={LIMITS.budget_min}
              max={LIMITS.budget_max}
              value={form.min_budget}
              onChange={(e) => setForm((f) => ({ ...f, min_budget: e.target.value }))}
              placeholder="Min. bütçe (TL)"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
            />
            <input
              type="number"
              min={LIMITS.budget_min}
              max={LIMITS.budget_max}
              value={form.max_budget}
              onChange={(e) => setForm((f) => ({ ...f, max_budget: e.target.value }))}
              placeholder="Max. bütçe (TL)"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </div>
          <textarea
            maxLength={LIMITS.note}
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value.slice(0, LIMITS.note) }))}
            placeholder={`Not (isteğe bağlı, en fazla ${LIMITS.note} karakter)`}
            rows={2}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
          />
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Gönderiliyor..." : "Gönder"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">
        İlan bulamadınız mı? Talebinizi iletin
      </h2>
      <p className="text-sm text-slate-600">
        Aradığınız kriterlere uygun ilan bulunamadıysa formu doldurun. Uygun
        ilan olduğunda sizinle iletişime geçeceğiz.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-slate-700">Ad Soyad (en fazla {LIMITS.customer_name} karakter)</label>
          <input
            required
            maxLength={LIMITS.customer_name}
            value={form.customer_name}
            onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value.slice(0, LIMITS.customer_name) }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-700">Telefon (en fazla {LIMITS.customer_phone} karakter)</label>
          <input
            required
            type="tel"
            maxLength={LIMITS.customer_phone}
            value={form.customer_phone}
            onChange={(e) => setForm((f) => ({ ...f, customer_phone: e.target.value.slice(0, LIMITS.customer_phone) }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-700">Satılık / Kiralık</label>
        <div className="flex gap-4">
          {(["satilik", "kiralik"] as const).map((t) => (
            <label key={t} className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                checked={form.listing_type === t}
                onChange={() => setForm((f) => ({ ...f, listing_type: t }))}
              />
              {t === "satilik" ? "Satılık" : "Kiralık"}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-700">
          Konut / İş Yeri / Arsa
        </label>
        <div className="flex gap-4">
          {(["konut", "isYeri", "arsa"] as const).map((c) => (
            <label key={c} className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                checked={form.property_type === c}
                onChange={() => setForm((f) => ({ ...f, property_type: c }))}
              />
              {c === "konut" ? "Konut" : c === "isYeri" ? "İş Yeri" : "Arsa"}
            </label>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
<div>
        <label className="mb-1 block text-sm text-slate-700">Min. Bütçe (TL)</label>
          <input
            type="number"
            min={LIMITS.budget_min}
            max={LIMITS.budget_max}
            value={form.min_budget}
            onChange={(e) => setForm((f) => ({ ...f, min_budget: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-700">Max. Bütçe (TL)</label>
          <input
            type="number"
            min={LIMITS.budget_min}
            max={LIMITS.budget_max}
            value={form.max_budget}
            onChange={(e) => setForm((f) => ({ ...f, max_budget: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-700">Not (en fazla {LIMITS.note} karakter)</label>
        <textarea
          maxLength={LIMITS.note}
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value.slice(0, LIMITS.note) }))}
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? "Gönderiliyor..." : "Talebi Gönder"}
      </button>
    </form>
  );
}
