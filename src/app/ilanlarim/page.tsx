"use client";

import { useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import type { Listing } from "@/types/listing";
import { ListingCard } from "@/components/ListingCard";
import { CustomerInfoPopup } from "@/components/CustomerInfoPopup";

export default function IlanlarimPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [customerPopupListing, setCustomerPopupListing] = useState<Listing | null>(null);

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
          <div key={listing.id} className="flex flex-col gap-2">
            <ListingCard
              listing={listing}
              showSellerNote
              href={`/ilan/${listing.id}`}
            />
            <button
              type="button"
              onClick={() => setCustomerPopupListing(listing)}
              className="w-full rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100"
            >
              Müşteri bilgisi
            </button>
          </div>
        ))}
        {listings.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            Henüz ilanınız bulunmuyor. &quot;İlan Ekle&quot; sayfasından yeni
            ilan oluşturabilirsiniz.
          </p>
        )}
      </div>

      {customerPopupListing && (
        <CustomerInfoPopup
          listing={customerPopupListing}
          onClose={() => setCustomerPopupListing(null)}
        />
      )}
    </div>
  );
}

