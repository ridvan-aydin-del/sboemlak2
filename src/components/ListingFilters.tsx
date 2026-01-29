"use client";

import { useState } from "react";
import { CreditCalculator } from "./CreditCalculator";

export type FilterType = "satilik" | "kiralik" | "devren-satilik" | "hepsi";
export type FilterCategory = "konut" | "isYeri" | "arsa" | "hepsi";

export interface ListingFilterState {
  type: FilterType;
  category: FilterCategory;
  province: string;
  district: string;
  neighborhood: string;
}

interface ListingFiltersProps {
  value: ListingFilterState;
  onChange: (next: ListingFilterState) => void;
}

export function ListingFilters({ value, onChange }: ListingFiltersProps) {
  const [local, setLocal] = useState<ListingFilterState>(value);

  const update = (patch: Partial<ListingFilterState>) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onChange(next);
  };

  return (
    <aside className="flex flex-col gap-4">
      <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">
          İlan Filtreleri
        </h3>

        {/* Tip */}
        <div className="mb-3 space-y-1 text-xs">
          <div className="text-slate-600">İlan Durumu</div>
          <div className="mt-1 grid grid-cols-2 gap-1">
            {[
              { value: "hepsi", label: "Tümü" },
              { value: "satilik", label: "Satılık" },
              { value: "kiralik", label: "Kiralık" },
              { value: "devren-satilik", label: "Devren Satılık" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ type: opt.value as FilterType })}
                className={`rounded-full border px-2 py-1 text-[11px] ${
                  local.type === opt.value
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-emerald-400/70"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Kategori */}
        <div className="mb-3 space-y-1 text-xs">
          <div className="text-slate-600">Kategori</div>
          <div className="mt-1 grid grid-cols-3 gap-1">
            {[
              { value: "hepsi", label: "Tümü" },
              { value: "konut", label: "Konut" },
              { value: "isYeri", label: "İş Yeri" },
              { value: "arsa", label: "Arsa" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ category: opt.value as FilterCategory })}
                className={`rounded-full border px-2 py-1 text-[11px] ${
                  local.category === opt.value
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-emerald-400/70"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Konum - Türkiye illeri / ilçeler / mahalleler basit text input olarak bırakıldı;
            istersen hazır JSON ile sonra doldurabiliriz. */}
        <div className="space-y-2 text-xs">
          <div>
            <label className="mb-1 block text-slate-600">İl</label>
            <input
              value={local.province}
              onChange={(e) => update({ province: e.target.value })}
              placeholder="Örn: İstanbul"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-600">İlçe</label>
            <input
              value={local.district}
              onChange={(e) => update({ district: e.target.value })}
              placeholder="Örn: Kadıköy"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-600">Mahalle</label>
            <input
              value={local.neighborhood}
              onChange={(e) => update({ neighborhood: e.target.value })}
              placeholder="Örn: Suadiye"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </section>

      <CreditCalculator />

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-xs text-slate-700">
        <h3 className="mb-2 text-sm font-semibold text-slate-900">
          İletişim & Konum
        </h3>
        <p className="mb-2">
          SBO Emlak Ofisi - İstanbul, Örnek Mah. Demo Sk. No: 1
        </p>
        <p className="mb-2">
          Tel: <a href="tel:+905551112233" className="font-semibold">0 (555) 111 22 33</a>
        </p>
        <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
          {/* Basit Google Maps embed; SSR ile aynı kalması için sabit src kullanıyoruz */}
          <iframe
            title="Ofis Konumu"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12039.1111!2d28.97953!3d41.015137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzU0LjUiTiAyOMKwNTgnNTYuMiJF!5e0!3m2!1str!2str!4v1700000000000"
            width="100%"
            height="170"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </aside>
  );
}

