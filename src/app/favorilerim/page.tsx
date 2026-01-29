"use client";

import { useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { ListingCard } from "@/components/ListingCard";
import type { Listing } from "@/types/listing";

// Not: Favori sistemi için Supabase tarafında
// sbo_favorites: { id, user_id, listing_id, created_at }
// gibi bir tablo oluşturmanız gerekir.

interface FavoriteRow {
  listing: Listing;
}

export default function FavorilerimPage() {
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const {
        data: { user },
      } = await supabaseBrowserClient.auth.getUser();
      if (!user) return;

      const { data, error } = await supabaseBrowserClient
        .from("sbo_favorites")
        .select("listing:sbo_listings(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      // Supabase join tipi any[] döndüğü için önce unknown'a,
      // sonra beklediğimiz tip olan FavoriteRow[]'a çeviriyoruz.
      const typed = (data ?? []) as unknown as FavoriteRow[];
      setFavorites(typed);
    };

    void fetchFavorites();
  }, []);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">Favorilerim</h1>
        <p className="text-xs text-slate-600">
          Beğendiğiniz ilanları favorilere ekleyip buradan hızlıca
          ulaşabilirsiniz. (Supabase tarafında sbo_favorites tablosu
          oluşturulduktan sonra tam çalışacaktır.)
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((fav, idx) => (
          <ListingCard
            key={idx}
            listing={fav.listing}
            href={`/ilan/${fav.listing.id}`}
          />
        ))}

        {favorites.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            Henüz favori ilanınız bulunmuyor. İlan kartlarına ekleyeceğiniz bir
            &quot;Favoriye Ekle&quot; butonu ile bu tabloyu besleyebilirsiniz.
          </p>
        )}
      </div>
    </div>
  );
}

