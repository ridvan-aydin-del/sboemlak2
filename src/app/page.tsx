"use client";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { ListingCard } from "@/components/ListingCard";
import {
  ListingFilters,
  type ListingFilterState,
} from "@/components/ListingFilters";
import type { Listing } from "@/types/listing";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ListingFilterState>({
    type: "hepsi",
    category: "hepsi",
    province: "",
    district: "",
    neighborhood: "",
  });

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      let query = supabaseBrowserClient
        .from("sbo_listings")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(60);

      const { data, error } = await query;

      if (error) {
        console.error("İlanlar alınamadı", error);
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

  const filtered = listings.filter((l) => {
    if (filters.type !== "hepsi" && l.type !== filters.type) return false;
    if (filters.category !== "hepsi" && l.category !== filters.category)
      return false;
    if (
      filters.province &&
      !l.province?.toLowerCase().includes(filters.province.toLowerCase())
    )
      return false;
    if (
      filters.district &&
      !l.district?.toLowerCase().includes(filters.district.toLowerCase())
    )
      return false;
    if (
      filters.neighborhood &&
      !l.neighborhood
        ?.toLowerCase()
        .includes(filters.neighborhood.toLowerCase())
    )
      return false;
    return true;
  });

  const hasFeatured = featured.length > 0;
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const autoTimerRef = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!hasFeatured || featured.length <= 1) return;
    if (isSliderPaused) return;

    // otomatik geçiş
    autoTimerRef.current = window.setInterval(() => {
      setSliderIndex((i) => (i + 1) % featured.length);
    }, 3000);

    return () => {
      if (autoTimerRef.current) window.clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    };
  }, [featured.length, hasFeatured, isSliderPaused]);

  // Sadece carousel track'i yatay kaydır, sayfa scroll'unu değiştirme
  useEffect(() => {
    if (!hasFeatured || !trackRef.current) return;
    const el = itemRefs.current[sliderIndex];
    if (!el) return;
    const track = trackRef.current;
    const slideLeft = el.offsetLeft;
    const slideWidth = el.offsetWidth;
    const trackWidth = track.offsetWidth;
    const scrollTarget = slideLeft - (trackWidth - slideWidth) / 2;
    track.scrollTo({ left: Math.max(0, scrollTarget), behavior: "smooth" });
  }, [hasFeatured, sliderIndex]);

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
      {/* Fırsat İlanlar - Slider */}
      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Fırsat İlanlar
            </h1>
            <p className="text-xs text-slate-500">
              S.B.O Emlak olarak sizler için öne çıkardığımız ilanlar
            </p>
          </div>
          {hasFeatured && (
            <div className="text-[11px] text-slate-500">
              <span>
                {sliderIndex + 1} / {featured.length}
              </span>
            </div>
          )}
        </div>

        {!hasFeatured && (
          <p className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-900">
            Şu an için öne çıkarılmış ilan bulunmuyor. Admin panelinden ilanları
            &quot;Öne Çıkar&quot; yaparak burada gösterebilirsiniz.
          </p>
        )}

        {hasFeatured && (
          <div
            className="relative"
            onMouseEnter={() => setIsSliderPaused(true)}
            onMouseLeave={() => setIsSliderPaused(false)}
          >
            {/* Oklar */}
            <button
              type="button"
              onClick={() =>
                featured.length > 1 &&
                setSliderIndex(
                  (i) => (i - 1 + featured.length) % featured.length
                )
              }
              disabled={featured.length <= 1}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-lg backdrop-blur hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Önceki ilan"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Track */}
            <div
              ref={trackRef}
              className="mx-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 rounded-2xl pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {featured.map((item, idx) => {
                const cover =
                  Array.isArray(item.images) && item.images.length > 0
                    ? item.images[0]
                    : "/window.svg";
                const wa =
                  item.contact_number?.replace(/\D/g, "").replace(/^0/, "") ??
                  "";
                const waHref = wa ? `https://wa.me/90${wa}` : null;

                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    className="w-full shrink-0 snap-center md:w-[880px]"
                  >
                    <article className="group overflow-hidden rounded-2xl border border-emerald-200/50 bg-white shadow-sm ring-1 ring-emerald-100 transition hover:shadow-lg">
                      <div className="flex flex-row">
                        {/* Sol: Fotoğraf - her zaman solda */}
                        <Link
                          href={`/ilan/${item.id}`}
                          className="relative block h-48 w-[45%] min-w-[140px] shrink-0 bg-slate-100 sm:h-56 md:h-64 md:w-[50%]"
                        >
                          <Image
                            src={cover}
                            alt={item.title}
                            fill
                            priority={idx === 0}
                            quality={90}
                            sizes="(min-width: 1024px) 640px, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
                          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                            Fırsat
                          </span>
                        </Link>

                        {/* Sağ: İlan bilgileri - her zaman sağda */}
                        <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
                          <div className="flex items-center justify-between">
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                              {item.type === "satilik"
                                ? "Satılık"
                                : item.type === "kiralik"
                                ? "Kiralık"
                                : "Devren Satılık"}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {idx + 1} / {featured.length}
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
                            {item.bathroom_count && (
                              <span className="rounded-full bg-slate-50 px-2 py-0.5">
                                {item.bathroom_count} banyo
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
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                featured.length > 1 &&
                setSliderIndex((i) => (i + 1) % featured.length)
              }
              disabled={featured.length <= 1}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-lg backdrop-blur hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Sonraki ilan"
            >
              <ChevronRight size={20} />
            </button>

            {/* Noktalar */}
            <div className="mt-3 flex justify-center gap-2">
              {featured.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSliderIndex(i)}
                  aria-label={`İlana git: ${i + 1}`}
                  className={[
                    "h-2.5 w-2.5 rounded-full transition",
                    i === sliderIndex
                      ? "bg-emerald-600"
                      : "bg-slate-200 hover:bg-slate-300",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Liste + Filtre */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,320px)]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Tüm İlanlar
            </h2>
            <span className="text-[11px] text-slate-500">
              {filtered.length} ilan bulundu
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {filtered.slice(0, 9).map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                href={`/ilan/${listing.id}`}
              />
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                Filtrelere uygun ilan bulunamadı. Filtreleri gevşetmeyi
                deneyebilirsiniz.
              </p>
            )}
          </div>
          {/* Basit sayfalama placeholder; sonra server-side sayfalama eklenebilir */}
          <div className="mt-2 flex justify-center gap-1">
            <button className="rounded-full border border-slate-200 px-3 py-1 text-[11px] text-slate-600 hover:border-emerald-500 hover:text-emerald-700">
              1
            </button>
            <button className="rounded-full border border-slate-200 px-3 py-1 text-[11px] text-slate-600 hover:border-emerald-500 hover:text-emerald-700">
              2
            </button>
            <button className="rounded-full border border-slate-200 px-3 py-1 text-[11px] text-slate-600 hover:border-emerald-500 hover:text-emerald-700">
              Sonraki &gt;
            </button>
          </div>
        </div>

        <ListingFilters value={filters} onChange={setFilters} />
      </section>
    </div>
  );
}
