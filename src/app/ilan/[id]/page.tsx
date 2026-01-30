"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import type { Listing } from "@/types/listing";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ListingView {
  view_count: number;
}

interface OwnerProfile {
  id: string;
  full_name: string | null;
  whatsapp_number: string | null;
}

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile | null>(null);
  const [views, setViews] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (!params?.id) return;
      setLoading(true);

      const { data, error } = await supabaseBrowserClient
        .from("sbo_listings")
        .select("*")
        .eq("id", params.id)
        .maybeSingle();

      if (error) {
        console.error("İlan getirilemedi", error);
        setLoading(false);
        return;
      }

      const listingData = data as unknown as Listing;
      setListing(listingData);
      setSelectedImageIndex(0);

      if (listingData?.created_by) {
        const { data: profileData } = await supabaseBrowserClient
          .from("sbo_profiles")
          .select("id, full_name, whatsapp_number")
          .eq("id", listingData.created_by)
          .maybeSingle();
        setOwnerProfile((profileData as OwnerProfile) ?? null);
      } else {
        setOwnerProfile(null);
      }

      const { data: viewData } = await supabaseBrowserClient
        .from("sbo_listing_views")
        .select("view_count")
        .eq("listing_id", params.id)
        .maybeSingle();

      if (viewData) {
        setViews((viewData as ListingView).view_count);
      }
      setLoading(false);
    };

    fetchListing();
  }, [params?.id]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isLightboxOpen]);

  if (loading) {
    return <p className="text-sm text-slate-600">İlan yükleniyor...</p>;
  }

  if (!listing) {
    return (
      <p className="text-sm text-red-600">
        İlan bulunamadı veya pasif hale getirilmiş olabilir.
      </p>
    );
  }

  const images =
    Array.isArray(listing.images) && listing.images.length > 0
      ? listing.images
      : ["/window.svg"];

  const contactNumber = ownerProfile?.whatsapp_number ?? listing.contact_number;
  const waNumber = contactNumber
    ?.replace(/\D/g, "")
    .replace(/^0/, "");
  const waHref = waNumber ? `https://wa.me/90${waNumber}` : null;

  const goPrev = () =>
    setSelectedImageIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () =>
    setSelectedImageIndex((i) => (i + 1) % images.length);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Üst bilgi - Görüntülenme, İlan No, Tarih */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 shadow-sm">
        {views != null && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            <i className="fa-solid fa-eye text-[10px]" />
            {views.toLocaleString("tr-TR")} görüntülenme
          </span>
        )}
      
        <span className="text-xs text-slate-600">
          Yayın Tarihi: {new Date(listing.created_at).toLocaleDateString("tr-TR")}
        </span>
      </div>

      {/* Sahibinden tarzı: Sol fotoğraflar, Sağ bilgiler */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sol - Galeri */}
        <section className="flex-1 space-y-3 lg:min-w-0">
          {/* Ana fotoğraf - tıklanınca lightbox açılır */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsLightboxOpen(true)}
            onKeyDown={(e) => e.key === "Enter" && setIsLightboxOpen(true)}
            className="relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 aspect-[4/3]"
          >
            <Image
              src={images[selectedImageIndex]}
              alt={`${listing.title} - ${selectedImageIndex + 1}. fotoğraf`}
              fill
              priority
              quality={100}
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-contain"
            />
            {/* Resmin üstünde sağ/sol geçiş okları */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Önceki fotoğraf"
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-lg backdrop-blur transition hover:bg-white hover:text-emerald-600"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Sonraki fotoğraf"
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-lg backdrop-blur transition hover:bg-white hover:text-emerald-600"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail grid - PC: 6/satır, tablet: 4/satır, mobil: 3/satır */}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {images.map((src, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                  selectedImageIndex === idx
                    ? "border-emerald-500 ring-2 ring-emerald-200"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Image
                  src={src}
                  alt={`${listing.title} - ${idx + 1}. fotoğraf`}
                  fill
                  quality={85}
                  sizes="(min-width: 768px) 120px, (min-width: 640px) 80px, 100px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </section>

        {/* Lightbox - fotoğrafa tıklanınca büyük açılır */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setIsLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Fotoğraf galerisi"
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Kapat"
              className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-lg transition hover:bg-white hover:text-slate-900"
            >
              <X size={24} />
            </button>
            <div
              className="relative mx-4 h-[85vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedImageIndex]}
                alt={`${listing.title} - ${selectedImageIndex + 1}. fotoğraf`}
                fill
                quality={100}
                sizes="90vw"
                className="object-contain"
              />
            </div>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Önceki fotoğraf"
                  className="absolute left-4 top-1/2 z-50 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-lg transition hover:bg-white hover:text-emerald-600"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Sonraki fotoğraf"
                  className="absolute right-4 top-1/2 z-50 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-lg transition hover:bg-white hover:text-emerald-600"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>
        )}

        {/* Sağ - Başlık, fiyat, detaylar, emlakçı iletişimi */}
        <aside className="w-full shrink-0 space-y-4 lg:w-80 xl:w-96">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h1 className="mb-2 text-lg font-semibold text-slate-900 sm:text-xl">
              {listing.title}
            </h1>
            <p className="mb-2 text-sm text-slate-500">
              {listing.province} / {listing.district}
              {listing.neighborhood && ` / ${listing.neighborhood}`}
            </p>
            <p className="mb-4 text-2xl font-bold text-emerald-700">
              {listing.price.toLocaleString("tr-TR")} TL
            </p>

            <div className="space-y-2 text-sm text-slate-700">
              <DetailRow label="Durum" value={formatListingType(listing.type)} />
              <DetailRow label="Kategori" value={formatCategory(listing.category)} />
              <DetailRow label="Oda Sayısı" value={listing.rooms} />
              <DetailRow
                label="Brüt / Net m²"
                value={
                  listing.gross_area && listing.net_area
                    ? `${listing.gross_area} / ${listing.net_area} m²`
                    : listing.gross_area
                      ? `${listing.gross_area} m²`
                      : listing.net_area
                        ? `${listing.net_area} m²`
                        : null
                }
              />
              <DetailRow label="Bulunduğu Kat" value={listing.floor ?? null} />
              <DetailRow
                label="Bina Kat Sayısı"
                value={listing.total_floors != null ? listing.total_floors.toString() : null}
              />
              <DetailRow
                label="Banyo Sayısı"
                value={listing.bathroom_count != null ? listing.bathroom_count.toString() : null}
              />
              <DetailRow label="Isıtma Tipi" value={listing.heating} />
              <DetailRow label="Bina Yaşı" value={listing.building_age} />
              <DetailRow
                label="Otopark"
                value={listing.parking_type ? formatParking(listing.parking_type) : null}
              />
              <DetailRow label="Kullanım Durumu" value={listing.usage_status} />
              <DetailRow
                label="Aidat"
                value={listing.duess ? `${listing.duess} TL` : null}
              />
              <DetailRow
                label="Krediye Uygun"
                value={
                  listing.is_credit_eligible == null
                    ? null
                    : listing.is_credit_eligible
                      ? "Evet"
                      : "Hayır"
                }
              />
              <DetailRow label="Tapu Durumu" value={listing.deed_status} />
            </div>
          </section>

          {/* Emlakçı iletişimi - sağ sütunda */}
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-emerald-900">
              Emlakçı iletişimi
            </h2>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {contactNumber && (
                <a
                  href={`tel:${contactNumber}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <i className="fa-solid fa-phone text-sm" />
                  {contactNumber}
                </a>
              )}
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  <i className="fa-brands fa-whatsapp text-lg" />
                  WhatsApp ile iletişime geç
                </a>
              )}
            </div>
            <p className="mt-2 text-xs text-emerald-800/80">
              Detaylı adres ve randevu bilgileri için iletişim sayfasını kullanabilirsiniz.
            </p>
          </section>
        </aside>
      </div>

      {/* İlan açıklaması - tam genişlik */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-base font-semibold text-slate-900">
          İlan Açıklaması
        </h2>
        {listing.description ? (
          <div
            className="rt-content text-sm leading-relaxed text-slate-700"
            dangerouslySetInnerHTML={{ __html: listing.description }}
          />
        ) : (
          <p className="text-sm text-slate-600">İlan açıklaması eklenmemiştir.</p>
        )}
      </section>

    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 border-b border-dashed border-slate-100 pb-1">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}

function formatListingType(type: Listing["type"]) {
  if (type === "satilik") return "Satılık";
  if (type === "kiralik") return "Kiralık";
  if (type === "devren-satilik") return "Devren Satılık";
  return "-";
}

function formatCategory(category: Listing["category"]) {
  if (category === "konut") return "Konut";
  if (category === "isYeri") return "İş Yeri";
  if (category === "arsa") return "Arsa";
  return "-";
}

function formatParking(parking: NonNullable<Listing["parking_type"]>) {
  if (parking === "acik") return "Açık Otopark";
  if (parking === "kapali") return "Kapalı Otopark";
  return "Otopark Yok";
}
