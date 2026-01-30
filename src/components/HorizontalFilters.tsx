"use client";

import { useState, useRef, useEffect } from "react";

export type FilterType = "satilik" | "kiralik" | "hepsi";
export type FilterCategory = "konut" | "isYeri" | "arsa" | "hepsi";

export interface HorizontalFilterState {
  type: FilterType;
  category: FilterCategory;
  /** Çoklu seçim: boş = tümü */
  rooms: string[];
  /** Çoklu seçim: boş = tümü */
  priceRanges: string[];
  province: string;
  district: string;
  neighborhood: string;
}

const ROOM_OPTIONS = ["1+0", "1+1", "2+1", "3+1", "4+1", "5+1"];

const RENTAL_PRICE_RANGES = [
  { value: "0-5000", label: "0 - 5.000 TL" },
  { value: "5000-10000", label: "5.000 - 10.000 TL" },
  { value: "10000-15000", label: "10.000 - 15.000 TL" },
  { value: "15000-20000", label: "15.000 - 20.000 TL" },
  { value: "20000-30000", label: "20.000 - 30.000 TL" },
  { value: "30000-50000", label: "30.000 - 50.000 TL" },
  { value: "50000-999999999", label: "50.000 TL üzeri" },
];

const SALE_PRICE_RANGES = [
  { value: "0-500000", label: "0 - 500.000 TL" },
  { value: "500000-1000000", label: "500.000 - 1.000.000 TL" },
  { value: "1000000-1500000", label: "1.000.000 - 1.500.000 TL" },
  { value: "1500000-2000000", label: "1.500.000 - 2.000.000 TL" },
  { value: "2000000-3000000", label: "2.000.000 - 3.000.000 TL" },
  { value: "3000000-5000000", label: "3.000.000 - 5.000.000 TL" },
  { value: "5000000-10000000", label: "5.000.000 - 10.000.000 TL" },
  { value: "10000000-999999999999", label: "10.000.000 TL üzeri" },
];

interface HorizontalFiltersProps {
  value: HorizontalFilterState;
  onChange: (next: HorizontalFilterState) => void;
}

export function HorizontalFilters({ value, onChange }: HorizontalFiltersProps) {
  const [roomsOpen, setRoomsOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const roomsRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        roomsRef.current && !roomsRef.current.contains(e.target as Node) &&
        priceRef.current && !priceRef.current.contains(e.target as Node)
      ) {
        setRoomsOpen(false);
        setPriceOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const update = (patch: Partial<HorizontalFilterState>) => {
    onChange({ ...value, ...patch });
  };

  const toggleRoom = (r: string) => {
    const next = value.rooms.includes(r)
      ? value.rooms.filter((x) => x !== r)
      : [...value.rooms, r];
    update({ rooms: next });
  };

  const togglePriceRange = (v: string) => {
    const next = value.priceRanges.includes(v)
      ? value.priceRanges.filter((x) => x !== v)
      : [...value.priceRanges, v];
    update({ priceRanges: next });
  };

  const priceRangesList =
    value.type === "kiralik" ? RENTAL_PRICE_RANGES : SALE_PRICE_RANGES;

  const roomsLabel =
    value.rooms.length === 0
      ? "Tümü"
      : value.rooms.length <= 2
        ? value.rooms.join(", ")
        : `${value.rooms.length} oda seçili`;

  const priceLabel =
    value.priceRanges.length === 0
      ? "Tümü"
      : value.priceRanges.length <= 2
        ? value.priceRanges
            .map((v) => priceRangesList.find((p) => p.value === v)?.label ?? v)
            .join(", ")
        : `${value.priceRanges.length} aralık seçili`;

  if (value.type === "hepsi") {
    return (
      <div className="rounded-2xl border-2 border-emerald-100 bg-white p-6 shadow-md">
        <p className="mb-5 text-center text-base font-semibold text-slate-700">
          Ne arıyorsunuz?
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() =>
              update({
                type: "satilik",
                category: "hepsi",
                rooms: [],
                priceRanges: [],
              })
            }
            className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 py-8 text-xl font-bold text-emerald-800 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-100 active:scale-[0.98]"
          >
            Satılık
          </button>
          <button
            type="button"
            onClick={() =>
              update({
                type: "kiralik",
                category: "hepsi",
                rooms: [],
                priceRanges: [],
              })
            }
            className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 py-8 text-xl font-bold text-emerald-800 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-100 active:scale-[0.98]"
          >
            Kiralık
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-emerald-100 bg-white p-6 shadow-md">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() =>
            update({
              type: "hepsi",
              category: "hepsi",
              rooms: [],
              priceRanges: [],
            })
          }
          className="text-sm font-medium text-slate-500 underline hover:text-emerald-600"
        >
          ← Başa dön
        </button>
        <span className="text-sm font-medium text-emerald-700">
          Seçili: {value.type === "satilik" ? "Satılık" : "Kiralık"}
        </span>
      </div>

      <p className="mb-3 text-sm font-semibold text-slate-700">Kategori seçin</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { value: "hepsi" as FilterCategory, label: "Tümü" },
          { value: "konut" as FilterCategory, label: "Konut" },
          { value: "isYeri" as FilterCategory, label: "İş Yeri" },
          { value: "arsa" as FilterCategory, label: "Arsa" },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => update({ category: opt.value })}
            className={`rounded-xl py-4 text-base font-semibold transition ${
              value.category === opt.value
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Oda + Fiyat yan yana, tam genişlik, dropdown'lar yüksek z-index */}
      <div className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {value.category === "konut" && (
          <div
            ref={roomsRef}
            className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-sm font-medium text-slate-600">Oda sayısı</span>
            <div className="relative w-full sm:flex-1 sm:max-w-[280px]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setRoomsOpen(!roomsOpen);
                  setPriceOpen(false);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:border-emerald-400"
              >
                {roomsLabel} ▾
              </button>
              {roomsOpen && (
                <div
                  className="absolute left-0 right-0 top-full z-[100] mt-1 rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {ROOM_OPTIONS.map((r) => (
                      <label
                        key={r}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={value.rooms.includes(r)}
                          onChange={() => toggleRoom(r)}
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        {r}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div
          ref={priceRef}
          className={`flex w-full flex-col gap-2 sm:flex-row sm:items-center ${value.category === "konut" ? "sm:justify-between" : "sm:col-span-2 sm:justify-center"} ${value.category !== "konut" ? "sm:col-span-2" : ""}`}
        >
          <span className="text-sm font-medium text-slate-600">Fiyat aralığı</span>
          <div className={`relative w-full sm:max-w-[320px] ${value.category === "konut" ? "sm:flex-1" : "sm:mx-auto"}`}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPriceOpen(!priceOpen);
                setRoomsOpen(false);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:border-emerald-400"
            >
              {priceLabel} ▾
            </button>
            {priceOpen && (
              <div
                className="absolute left-0 right-0 top-full z-[100] mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {priceRangesList.map((p) => (
                    <label
                      key={p.value}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={value.priceRanges.includes(p.value)}
                        onChange={() => togglePriceRange(p.value)}
                        className="h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="truncate">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function filterListingsByHorizontalState<
  T extends { type: string; category: string; rooms: string | null; price: number }
>(items: T[], filters: HorizontalFilterState): T[] {
  return items.filter((l) => {
    if (filters.type !== "hepsi" && l.type !== filters.type) return false;
    if (filters.category !== "hepsi" && l.category !== filters.category)
      return false;
    if (filters.rooms.length > 0 && (l.rooms || "") !== "" && !filters.rooms.includes(l.rooms!))
      return false;
    if (filters.priceRanges.length > 0) {
      const inAnyRange = filters.priceRanges.some((rangeStr) => {
        const parts = rangeStr.split("-");
        const min = Number(parts[0]) || 0;
        const max = Number(parts[1]) ?? 999999999999;
        return l.price >= min && l.price <= max;
      });
      if (!inAnyRange) return false;
    }
    return true;
  });
}
