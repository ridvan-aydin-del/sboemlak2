"use client";

import { useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { ListingCard } from "@/components/ListingCard";
import type { Listing } from "@/types/listing";

interface DateFilter {
  start: string;
  end: string;
}

export default function AdminIlanlarPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [dates, setDates] = useState<DateFilter>({
    start: "",
    end: "",
  });

  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    void fetchListings();
  }, []);

  const fetchListings = async () => {
    let query = supabaseBrowserClient
      .from("sbo_listings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (dates.start) {
      query = query.gte("created_at", dates.start);
    }
    if (dates.end) {
      query = query.lte("created_at", dates.end);
    }

    const { data, error } = await query;
    if (error) {
      console.error(error);
      return;
    }
    setListings((data ?? []) as unknown as Listing[]);
  };

  const handleUpdateStatus = async (
    id: string,
    patch: Partial<Pick<Listing, "is_active" | "featured">>,
  ) => {
    const { error } = await supabaseBrowserClient
      .from("sbo_listings")
      .update(patch)
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    void fetchListings();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabaseBrowserClient
      .from("sbo_listings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    void fetchListings();
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Tüm İlanlar</h1>
          <p className="text-xs text-slate-600">
            Admin için tüm portföy listesi. Tarih aralığına göre filtreleyip,
            ilanları pasife alabilir, öne çıkarabilir veya silebilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-2 text-xs">
          <div className="flex flex-col">
            <label className="mb-1 text-slate-700">Başlangıç Tarihi</label>
            <input
              type="date"
              value={dates.start}
              onChange={(e) => setDates((d) => ({ ...d, start: e.target.value }))}
              className="rounded-lg border border-slate-200 px-2 py-1 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-slate-700">Bitiş Tarihi</label>
            <input
              type="date"
              value={dates.end}
              onChange={(e) => setDates((d) => ({ ...d, end: e.target.value }))}
              className="rounded-lg border border-slate-200 px-2 py-1 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <button
            type="button"
            onClick={() => void fetchListings()}
            className="h-8 rounded-full bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Uygula
          </button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className={`flex flex-col gap-2 rounded-2xl border p-2 shadow-sm ${
              listing.is_active
                ? "border-slate-200 bg-white"
                : "border-slate-200 bg-slate-50 opacity-80"
            }`}
          >
            <div className="flex items-center justify-between px-1 text-[11px]">
              <span className="font-mono text-slate-400">#{listing.id.slice(0, 8)}</span>
              {!listing.is_active && (
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-700">
                  Pasif İlan
                </span>
              )}
            </div>
            <ListingCard
              listing={listing}
              showAdminMeta
              href={`/ilan/${listing.id}`}
            />
            {/* Not alanı - şimdilik sadece UI, veritabanında kolon olmadığı için persist edilmiyor */}
            <textarea
              rows={2}
              className="mt-1 w-full rounded-lg border border-dashed border-slate-200 px-2 py-1 text-[11px] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Bu ilana özel admin notu (veritabanına bağlamak için sbo_listings tablosuna bir kolon ekleyebilirsiniz)..."
            />
            <div className="flex flex-wrap gap-1 text-[11px]">
              <button
                type="button"
                className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
              >
                Kaydet
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
              >
                Düzenle
              </button>
              {listing.is_active ? (
                <button
                  type="button"
                  onClick={() => setConfirmId(listing.id)}
                  className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-amber-800 hover:bg-amber-100"
                >
                  Pasife Al
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    void handleUpdateStatus(listing.id, { is_active: true })
                  }
                  className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-800 hover:bg-emerald-100"
                >
                  Aktifleştir
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  void handleUpdateStatus(listing.id, { featured: !listing.featured })
                }
                className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-800 hover:bg-emerald-100"
              >
                {listing.featured ? "Öne Çıkarma" : "Öne Çıkar"}
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(listing.id)}
                className="ml-auto rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-100"
              >
                Sil
              </button>
            </div>
          </div>
        ))}

        {listings.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            Seçilen tarih aralığında ilan bulunamadı.
          </p>
        )}
      </div>

      {confirmId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="mb-2 text-sm font-semibold text-slate-900">
              İlanı pasife almak istediğinize emin misiniz?
            </h2>
            <p className="mb-4 text-xs text-slate-600">
              Bu işlem ilanı yayından kaldırır. Daha sonra tekrar{" "}
              <span className="font-semibold">Aktifleştir</span> butonu ile
              yayına alabilirsiniz.
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600 hover:border-slate-300"
              >
                Hayır
              </button>
              <button
                type="button"
                onClick={() => {
                  void handleUpdateStatus(confirmId, { is_active: false });
                  setConfirmId(null);
                }}
                className="rounded-full border border-amber-300 bg-amber-500 px-3 py-1.5 font-semibold text-white hover:bg-amber-600"
              >
                Evet, pasife al
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

