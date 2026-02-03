"use client";

import { useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import Link from "next/link";
import { Heart, HandCoins } from "lucide-react";

interface FavoriteRow {
  id: string;
  listing_id: string;
  customer_name: string;
  customer_phone: string;
  created_at: string;
  listing_title?: string;
}

interface OfferRow {
  id: string;
  listing_id: string;
  customer_name: string;
  customer_phone: string;
  offer_amount: number;
  created_at: string;
  listing_title?: string;
}

type Tab = "favoriler" | "teklifler";

export default function AdminFavorilerTekliflerPage() {
  const [tab, setTab] = useState<Tab>("favoriler");
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data, error } = await supabaseBrowserClient
        .from("sbo_listing_favorites")
        .select("id, listing_id, customer_name, customer_phone, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) {
        console.error(error);
        setFavorites([]);
        return;
      }
      const rows = (data ?? []) as FavoriteRow[];
      const ids = [...new Set(rows.map((r) => r.listing_id))];
      if (ids.length > 0) {
        const { data: listings } = await supabaseBrowserClient
          .from("sbo_listings")
          .select("id, title")
          .in("id", ids);
        const map = new Map((listings ?? []).map((l: { id: string; title: string }) => [l.id, l.title]));
        rows.forEach((r) => { (r as FavoriteRow).listing_title = map.get(r.listing_id) ?? "-"; });
      }
      setFavorites(rows);
    };

    const fetchOffers = async () => {
      const { data, error } = await supabaseBrowserClient
        .from("sbo_listing_offers")
        .select("id, listing_id, customer_name, customer_phone, offer_amount, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) {
        console.error(error);
        setOffers([]);
        return;
      }
      const rows = (data ?? []) as OfferRow[];
      const ids = [...new Set(rows.map((r) => r.listing_id))];
      if (ids.length > 0) {
        const { data: listings } = await supabaseBrowserClient
          .from("sbo_listings")
          .select("id, title")
          .in("id", ids);
        const map = new Map((listings ?? []).map((l: { id: string; title: string }) => [l.id, l.title]));
        rows.forEach((r) => { r.listing_title = map.get(r.listing_id) ?? "-"; });
      }
      setOffers(rows);
    };

    setLoading(true);
    Promise.all([fetchFavorites(), fetchOffers()]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Favori & Teklif Talepleri</h1>
      <p className="text-sm text-slate-600">
        İlan detay sayfasından &quot;Favoriye Ekle&quot; ve &quot;Teklif Ver&quot; ile gelen bilgiler.
      </p>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setTab("favoriler")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition ${
            tab === "favoriler"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Heart size={18} />
          Favoriye Ekle ({favorites.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("teklifler")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition ${
            tab === "teklifler"
              ? "border-amber-600 text-amber-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <HandCoins size={18} />
          Teklif Ver ({offers.length})
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Yükleniyor...</p>
      ) : tab === "favoriler" ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-700">Tarih</th>
                <th className="px-4 py-3 font-medium text-slate-700">İlan</th>
                <th className="px-4 py-3 font-medium text-slate-700">Ad Soyad</th>
                <th className="px-4 py-3 font-medium text-slate-700">Telefon</th>
              </tr>
            </thead>
            <tbody>
              {favorites.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    Henüz favori talebi yok.
                  </td>
                </tr>
              ) : (
                favorites.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {new Date(r.created_at).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/ilan/${r.listing_id}`}
                        className="text-emerald-700 hover:underline"
                      >
                        {(r as FavoriteRow).listing_title ?? "-"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{r.customer_name}</td>
                    <td className="px-4 py-3">
                      <a href={`tel:${r.customer_phone}`} className="text-emerald-700 hover:underline">
                        {r.customer_phone}
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-700">Tarih</th>
                <th className="px-4 py-3 font-medium text-slate-700">İlan</th>
                <th className="px-4 py-3 font-medium text-slate-700">Ad Soyad</th>
                <th className="px-4 py-3 font-medium text-slate-700">Telefon</th>
                <th className="px-4 py-3 font-medium text-slate-700">Teklif (TL)</th>
              </tr>
            </thead>
            <tbody>
              {offers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Henüz teklif yok.
                  </td>
                </tr>
              ) : (
                offers.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {new Date(r.created_at).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/ilan/${r.listing_id}`}
                        className="text-amber-700 hover:underline"
                      >
                        {r.listing_title ?? "-"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{r.customer_name}</td>
                    <td className="px-4 py-3">
                      <a href={`tel:${r.customer_phone}`} className="text-amber-700 hover:underline">
                        {r.customer_phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {r.offer_amount.toLocaleString("tr-TR")} TL
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
