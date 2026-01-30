"use client";

import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { ListingCard } from "@/components/ListingCard";
import {
  HorizontalFilters,
  filterListingsByHorizontalState,
  type HorizontalFilterState,
} from "@/components/HorizontalFilters";
import { SidebarWidgets } from "@/components/SidebarWidgets";
import { LeadForm } from "@/components/LeadForm";
import type { Listing } from "@/types/listing";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const defaultFilters: HorizontalFilterState = {
  type: "hepsi",
  category: "hepsi",
  rooms: [],
  priceRanges: [],
  province: "",
  district: "",
  neighborhood: "",
};

export default function Home() {
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<HorizontalFilterState>(defaultFilters);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const { data, error } = await supabaseBrowserClient
        .from("sbo_listings")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(60);

      if (error) {
        console.error("İlanlar alınamadı", error?.message ?? error, "code:", error?.code, "details:", error?.details);
        setLoading(false);
        return;
      }

      const typed = (data ?? []) as unknown as Listing[];
      setFeatured(typed.filter((l) => l.featured).slice(0, 9));
      setListings(typed);
      setLoading(false);
    };

    fetchListings();
  }, []);

  const filtered = filterListingsByHorizontalState(listings, filters);

  const hasFeatured = featured.length > 0;
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const autoTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hasFeatured || featured.length <= 1) return;
    if (isSliderPaused) return;
    autoTimerRef.current = window.setInterval(() => {
      setSliderIndex((i) => (i + 1) % featured.length);
    }, 3000);
    return () => {
      if (autoTimerRef.current) window.clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    };
  }, [featured.length, hasFeatured, isSliderPaused]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="text-sm text-slate-600">İlanlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vitrin Ürünler - Tam genişlik, öne çıkan */}
        <section className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-6 shadow-lg">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-emerald-900">
                Vitrin Ürünler
              </h1>
              <p className="text-xs text-emerald-700/80">
                S.B.O Emlak olarak sizler için öne çıkardığımız ilanlar
              </p>
            </div>
            {hasFeatured && (
              <span className="text-[11px] text-emerald-700">
                {sliderIndex + 1} / {featured.length}
              </span>
            )}
          </div>

          {!hasFeatured && (
            <p className="rounded-xl border border-dashed border-emerald-300 bg-white/60 px-4 py-3 text-sm text-emerald-800">
              Şu an vitrin ürünü bulunmuyor. Admin panelinden ilanları
              &quot;Vitrin&apos;e ekle&quot; yaparak burada gösterebilirsiniz.
            </p>
          )}

          {hasFeatured && (() => {
            const item = featured[sliderIndex];
            const cover =
              Array.isArray(item.images) && item.images.length > 0
                ? item.images[0]
                : "/window.svg";
            const wa =
              item.contact_number?.replace(/\D/g, "").replace(/^0/, "") ?? "";
            const waHref = wa ? `https://wa.me/90${wa}` : null;
            return (
              <div
                className="relative w-full"
                onMouseEnter={() => setIsSliderPaused(true)}
                onMouseLeave={() => setIsSliderPaused(false)}
              >
                <button
                  type="button"
                  onClick={() =>
                    featured.length > 1 &&
                    setSliderIndex((i) => (i - 1 + featured.length) % featured.length)
                  }
                  disabled={featured.length <= 1}
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300 bg-white/90 text-emerald-700 shadow-lg backdrop-blur hover:bg-white disabled:opacity-40"
                  aria-label="Önceki ilan"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="mx-12">
                  <article className="group overflow-hidden rounded-2xl border-2 border-emerald-200/70 bg-white shadow-md transition hover:shadow-xl">
                    <div className="flex flex-row">
                      <Link
                        href={`/ilan/${item.id}`}
                        className="relative block h-52 w-[44%] min-w-[160px] max-w-[320px] shrink-0 overflow-hidden bg-slate-100 sm:h-60 md:h-72 md:w-[48%]"
                      >
                        <Image
                          src={cover}
                          alt={item.title}
                          fill
                          priority
                          quality={90}
                          sizes="(min-width: 1024px) 360px, (min-width: 768px) 320px, 200px"
                          className="object-cover object-top-left transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
                        <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                          Vitrin
                        </span>
                      </Link>
                      <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            {item.type === "satilik"
                              ? "Satılık"
                              : item.type === "kiralik"
                                ? "Kiralık"
                                : "Devren Satılık"}{" "}
                            {item.category === "konut"
                              ? "Konut"
                              : item.category === "isYeri"
                                ? "İş Yeri"
                                : "Arsa"}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {sliderIndex + 1} / {featured.length}
                          </span>
                        </div>
                        <Link href={`/ilan/${item.id}`} className="block">
                          <h3 className="text-base font-semibold tracking-tight text-slate-900 line-clamp-2 group-hover:text-emerald-800">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.province} / {item.district}{" "}
                            {item.neighborhood && `- ${item.neighborhood}`}
                          </p>
                          <p className="mt-2 text-2xl font-semibold text-emerald-700">
                            {item.price.toLocaleString("tr-TR")} TL
                          </p>
                        </Link>
                        <div className="mt-auto flex flex-wrap gap-2 text-[11px] text-slate-600">
                          {item.rooms && (
                            <span className="rounded-full bg-slate-50 px-2 py-0.5">
                              {item.rooms}
                            </span>
                          )}
                          {(item.category === "arsa"
                            ? item.net_area
                            : item.gross_area ?? item.net_area) && (
                            <span className="rounded-full bg-slate-50 px-2 py-0.5">
                              {item.category === "arsa"
                                ? `${item.net_area} m²`
                                : `${item.gross_area ?? item.net_area} m²`}
                            </span>
                          )}
                        </div>
                        <div className="pt-1 flex flex-col gap-2 sm:flex-row">
                          {waHref && (
                            <a
                              href={waHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                            >
                              WhatsApp
                            </a>
                          )}
                          <Link
                            href={`/ilan/${item.id}`}
                            className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-900"
                          >
                            İlan Detayı <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    featured.length > 1 &&
                    setSliderIndex((i) => (i + 1) % featured.length)
                  }
                  disabled={featured.length <= 1}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300 bg-white/90 text-emerald-700 shadow-lg backdrop-blur hover:bg-white disabled:opacity-40"
                  aria-label="Sonraki ilan"
                >
                  <ChevronRight size={20} />
                </button>

                <div className="mt-3 flex justify-center gap-2">
                  {featured.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSliderIndex(i)}
                      aria-label={`İlana git: ${i + 1}`}
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        i === sliderIndex ? "bg-emerald-600" : "bg-emerald-200 hover:bg-emerald-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </section>

      {/* Yatay Filtreler - dropdown'lar ilanların üstünde görünsün diye overflow-visible */}
      <section className="relative z-20 min-h-[200px] rounded-2xl bg-slate-200">
        <div
          className="absolute inset-0 rounded-2xl bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/family.jpg)" }}
        />
        <div className="absolute inset-0 rounded-2xl bg-white/85 backdrop-blur-[1px]" />
        <div className="relative z-10 p-4 sm:p-6">
          <HorizontalFilters value={filters} onChange={setFilters} />
        </div>
      </section>

      {/* Sol: Kredi / İletişim & Konum / Google Puan — Sağ: Tüm İlanlar */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,3fr)]">
        <aside className="order-2 lg:order-1">
          <SidebarWidgets />
        </aside>
        <div className="order-1 space-y-3 lg:order-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Tüm İlanlar</h2>
            <span className="text-[11px] text-slate-500">
              {filtered.length} ilan bulundu
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.slice(0, 12).map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                href={`/ilan/${listing.id}`}
              />
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                Filtrelere uygun ilan bulunamadı. Filtreleri gevşetmeyi
                deneyebilir veya aşağıdaki form ile talebinizi iletebilirsiniz.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* İlan talep formu */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
        <LeadForm compact />
      </section>
    </div>
  );
}
