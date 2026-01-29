"use client";

import { useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import type { Listing } from "@/types/listing";
import { ListingCard } from "@/components/ListingCard";

export default function IlanlarimPage() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabaseBrowserClient.auth.getUser();
      if (!user) return;

      const { data, error } = await supabaseBrowserClient
        .from("sbo_listings")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setListings((data ?? []) as Listing[]);
    };

    void fetchData();
  }, []);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">İlanlarım</h1>
        <p className="text-xs text-slate-600">
          Satış elemanı rolündeki kullanıcılar kendi oluşturdukları ilanları bu
          ekrandan görebilir.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            href={`/ilan/${listing.id}`}
          />
        ))}
        {listings.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            Henüz ilanınız bulunmuyor. &quot;İlan Ekle&quot; sayfasından yeni
            ilan oluşturabilirsiniz.
          </p>
        )}
      </div>
    </div>
  );
}

