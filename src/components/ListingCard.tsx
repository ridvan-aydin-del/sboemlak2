import type { Listing } from "@/types/listing";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Maximize2, Bath } from "lucide-react";

interface ListingCardProps {
  listing: Listing;
  showAdminMeta?: boolean;
  href?: string;
}

export function ListingCard({ listing, showAdminMeta, href }: ListingCardProps) {
  const cover =
    Array.isArray(listing.images) && listing.images.length > 0
      ? listing.images[0]
      : "/window.svg";

  const content = (
    <article className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-lg">
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={cover}
          alt={listing.title}
          fill
          sizes="(min-width: 1024px) 320px, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {listing.featured && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold uppercase text-white shadow-sm">
            Fırsat
          </span>
        )}
        <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-slate-800 shadow-sm">
          {listing.type === "satilik"
            ? "Satılık"
            : listing.type === "kiralik"
            ? "Kiralık"
            : "Devren Satılık"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold tracking-tight text-slate-900">
            {listing.title}
          </h3>
        </div>
        <p className="flex items-center gap-1 text-[11px] text-slate-500">
          <MapPin size={12} />
          <span className="truncate">
            {listing.province} / {listing.district}{" "}
            {listing.neighborhood && `- ${listing.neighborhood}`}
          </span>
        </p>
        <p className="text-lg font-semibold text-emerald-700">
          {listing.price.toLocaleString("tr-TR")} TL
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
          {listing.rooms && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5">
              <span>{listing.rooms}</span>
            </span>
          )}
          {listing.net_area && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5">
              <Maximize2 size={11} />
              <span>{listing.net_area} m² net</span>
            </span>
          )}
          {listing.bathroom_count && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5">
              <Bath size={11} />
              <span>{listing.bathroom_count} banyo</span>
            </span>
          )}
        </div>

        {showAdminMeta && (
          <div className="mt-2 border-t border-dashed border-slate-100 pt-2 text-[11px] text-slate-500">
            <p>
              Oluşturan:{" "}
              <span className="font-medium">{listing.created_by}</span>
            </p>
            <p>
              Tarih:{" "}
              {new Date(listing.created_at).toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </article>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

