"use client";

import { useState, useEffect, useMemo } from "react";

export type FilterType = "satilik" | "kiralik" | "hepsi";
export type FilterCategory = "konut" | "isYeri" | "arsa" | "hepsi";

export interface HorizontalFilterState {
  type: FilterType;
  category: FilterCategory;
  rooms: string[];
  priceRanges: string[];
  province: string;
  district: string;
  neighborhood: string;
  /** Yakınımdaki ilanlar: km cinsinden yarıçap; null = kapalı */
  locationRadiusKm: number | null;
  userLat: number | null;
  userLng: number | null;
  locationError: string | null;
}

interface TrAddressProvince {
  name: string;
  towns: { name: string; districts: { name: string; quarters: { name: string }[] }[] }[];
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

const NEAR_ME_RADII = [
  { km: 1, label: "1 km" },
  { km: 5, label: "5 km" },
  { km: 10, label: "10 km" },
];

interface HorizontalFiltersProps {
  value: HorizontalFilterState;
  onChange: (next: HorizontalFilterState) => void;
}

export function HorizontalFilters({ value, onChange }: HorizontalFiltersProps) {
  const [addressData, setAddressData] = useState<TrAddressProvince[] | null>(null);

  useEffect(() => {
    fetch("/veri/tr-address.json")
      .then((r) => r.json())
      .then(setAddressData)
      .catch(() => setAddressData([]));
  }, []);

  const provinces = useMemo(() => addressData?.map((p) => p.name) ?? [], [addressData]);
  const districts = useMemo(() => {
    if (!addressData || !value.province) return [];
    const p = addressData.find((x) => x.name === value.province);
    return p?.towns?.map((t) => t.name) ?? [];
  }, [addressData, value.province]);
  const neighborhoods = useMemo(() => {
    if (!addressData || !value.province || !value.district) return [];
    const p = addressData.find((x) => x.name === value.province);
    const town = p?.towns?.find((t) => t.name === value.district);
    if (!town?.districts) return [];
    return town.districts.flatMap((d) => d.quarters.map((q) => q.name));
  }, [addressData, value.province, value.district]);

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

  const requestLocation = (km: number) => {
    update({ locationError: null });
    if (!navigator.geolocation) {
      update({ locationError: "Tarayıcınız konum desteklemiyor." });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        update({
          locationRadiusKm: km,
          userLat: pos.coords.latitude,
          userLng: pos.coords.longitude,
          locationError: null,
        });
      },
      () => {
        update({
          locationError: "Konum izni verilmedi veya alınamadı.",
          locationRadiusKm: null,
          userLat: null,
          userLng: null,
        });
      }
    );
  };

  const priceRangesList =
    value.type === "kiralik" ? RENTAL_PRICE_RANGES : SALE_PRICE_RANGES;

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
                province: "",
                district: "",
                neighborhood: "",
                locationRadiusKm: null,
                userLat: null,
                userLng: null,
                locationError: null,
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
                province: "",
                district: "",
                neighborhood: "",
                locationRadiusKm: null,
                userLat: null,
                userLng: null,
                locationError: null,
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
    <div className="rounded-2xl border-2 border-emerald-100 bg-white p-4 shadow-md sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() =>
            update({
              type: "hepsi",
              category: "hepsi",
              rooms: [],
              priceRanges: [],
              province: "",
              district: "",
              neighborhood: "",
              locationRadiusKm: null,
              userLat: null,
              userLng: null,
              locationError: null,
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

      {/* Kategori: Sadece Konut, İş Yeri, Arsa (Tümü yok) */}
      <p className="mb-2 text-sm font-semibold text-slate-700">Kategori</p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {(
          [
            { value: "konut" as FilterCategory, label: "Konut" },
            { value: "isYeri" as FilterCategory, label: "İş Yeri" },
            { value: "arsa" as FilterCategory, label: "Arsa" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => update({ category: opt.value })}
            className={`rounded-xl py-3 text-sm font-semibold transition sm:py-4 sm:text-base ${
              value.category === opt.value
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Oda sayısı – direkt çoklu seçim (sadece konut) */}
      {value.category === "konut" && (
        <>
          <p className="mt-4 mb-2 text-sm font-semibold text-slate-700">Oda sayısı</p>
          <div className="flex flex-wrap gap-2">
            {ROOM_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => toggleRoom(r)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  value.rooms.includes(r)
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Fiyat aralığı – direkt çoklu seçim */}
      <p className="mt-4 mb-2 text-sm font-semibold text-slate-700">Fiyat aralığı</p>
      <div className="flex flex-wrap gap-2">
        {priceRangesList.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => togglePriceRange(p.value)}
            className={`rounded-xl px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
              value.priceRanges.includes(p.value)
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* İl – İlçe – Mahalle */}
      <p className="mt-4 mb-2 text-sm font-semibold text-slate-700">Konum (İl / İlçe / Mahalle)</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs text-slate-500">İl</label>
          <select
            value={value.province}
            onChange={(e) => update({ province: e.target.value, district: "", neighborhood: "" })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">Tümü</option>
            {provinces.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">İlçe</label>
          <select
            value={value.district}
            onChange={(e) => update({ district: e.target.value, neighborhood: "" })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            disabled={!value.province}
          >
            <option value="">Tümü</option>
            {districts.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Mahalle</label>
          <select
            value={value.neighborhood}
            onChange={(e) => update({ neighborhood: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            disabled={!value.district}
          >
            <option value="">Tümü</option>
            {neighborhoods.slice(0, 500).map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
            {neighborhoods.length > 500 && (
              <option value="" disabled>+{neighborhoods.length - 500} daha</option>
            )}
          </select>
        </div>
      </div>

      {/* Yakınımdaki ilanlar */}
      <p className="mt-4 mb-2 text-sm font-semibold text-slate-700">Yakınımdaki ilanlar</p>
      <p className="mb-2 text-xs text-slate-500">
        Konum izni verirseniz seçtiğiniz yarıçaptaki ilanlar listelenir. (İlanların konum bilgisi olmalıdır.)
      </p>
      <div className="flex flex-wrap gap-2">
        {NEAR_ME_RADII.map(({ km, label }) => (
          <button
            key={km}
            type="button"
            onClick={() => (value.locationRadiusKm === km ? update({ locationRadiusKm: null, userLat: null, userLng: null }) : requestLocation(km))}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              value.locationRadiusKm === km
                ? "bg-amber-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label} çapında
          </button>
        ))}
        {value.locationRadiusKm != null && (
          <button
            type="button"
            onClick={() => update({ locationRadiusKm: null, userLat: null, userLng: null })}
            className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-300"
          >
            Kapat
          </button>
        )}
      </div>
      {value.locationError && (
        <p className="mt-2 text-sm text-red-600">{value.locationError}</p>
      )}
    </div>
  );
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function filterListingsByHorizontalState<
  T extends {
    type: string;
    category: string;
    rooms: string | null;
    price: number;
    province: string | null;
    district: string | null;
    neighborhood: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }
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
    if (filters.province && (l.province || "").trim() !== "" && (l.province || "").trim() !== filters.province)
      return false;
    if (filters.district && (l.district || "").trim() !== "" && (l.district || "").trim() !== filters.district)
      return false;
    if (filters.neighborhood && (l.neighborhood || "").trim() !== "" && (l.neighborhood || "").trim() !== filters.neighborhood)
      return false;
    if (filters.locationRadiusKm != null && filters.userLat != null && filters.userLng != null) {
      if (l.latitude == null || l.longitude == null) return false;
      const km = haversineKm(filters.userLat, filters.userLng, l.latitude, l.longitude);
      if (km > filters.locationRadiusKm) return false;
    }
    return true;
  });
}
