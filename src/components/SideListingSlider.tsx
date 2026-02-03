"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types/listing";

const VISIBLE = 4;
const INTERVAL_MS = 4000;

function getWindow<T>(arr: T[], start: number, count: number): T[] {
  if (arr.length === 0) return [];
  const out: T[] = [];
  for (let i = 0; i < count; i++) {
    out.push(arr[(start + i) % arr.length]);
  }
  return out;
}

interface SideListingSliderProps {
  listings: Listing[];
  /** left: 0, right: 4 farkı için offset farkı */
  offsetShift?: number;
}

export function SideListingSlider({ listings, offsetShift = 0 }: SideListingSliderProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (listings.length <= 1) return;
    const t = setInterval(() => {
      setOffset((o) => (o + 1) % listings.length);
    }, INTERVAL_MS);
    return () => clearInterval(t);
  }, [listings.length]);

  const window = getWindow(listings, (offset + offsetShift) % Math.max(listings.length, 1), VISIBLE);

  if (listings.length === 0) return null;

  return (
    <div className="hidden flex-col gap-2 overflow-hidden lg:flex lg:w-[160px] xl:w-[180px]">
      {window.map((listing, i) => {
        const cover =
          Array.isArray(listing.images) && listing.images.length > 0
            ? listing.images[0]
            : "/window.svg";
        return (
          <Link
            key={`${(offset + offsetShift) % Math.max(listings.length, 1)}-${i}-${listing.id}`}
            href={`/ilan/${listing.id}`}
            className="group flex shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-md"
          >
            <div className="relative h-24 w-full bg-slate-100">
              <Image
                src={cover}
                alt={listing.title}
                fill
                sizes="180px"
                className="object-cover transition group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-0.5 p-2">
              <span className="line-clamp-2 text-[11px] font-medium text-slate-800">
                {listing.title}
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                {listing.price.toLocaleString("tr-TR")} TL
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
