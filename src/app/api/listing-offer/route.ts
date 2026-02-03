import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const NAME_MAX = 100;
const PHONE_MAX = 20;
const OFFER_MIN = 0;
const OFFER_MAX = 999_999_999_999;
const MAX_OFFERS_PER_IP = 4;
const MAX_OFFERS_PER_LISTING_PER_IP = 1;

function getClientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return req.headers.get("x-real-ip") ?? null;
}

function clampNum(val: unknown, min: number, max: number): number | null {
  if (val == null || val === "") return null;
  const n = Number(val);
  if (Number.isNaN(n) || n < min || n > max) return null;
  return n;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listing_id, customer_name, customer_phone, offer_amount } = body;

    if (!listing_id || !customer_name || !customer_phone || offer_amount == null) {
      return NextResponse.json(
        { error: "İlan, ad soyad, telefon ve teklif tutarı zorunludur." },
        { status: 400 }
      );
    }

    const name = String(customer_name).trim().slice(0, NAME_MAX);
    const phone = String(customer_phone).trim().slice(0, PHONE_MAX);
    const amount = clampNum(offer_amount, OFFER_MIN, OFFER_MAX);

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Ad soyad ve telefon boş olamaz." },
        { status: 400 }
      );
    }

    if (phone.length < 10) {
      return NextResponse.json(
        { error: "Geçerli bir telefon numarası girin." },
        { status: 400 }
      );
    }

    if (amount == null) {
      return NextResponse.json(
        { error: "Geçerli bir teklif tutarı girin." },
        { status: 400 }
      );
    }

    const ip = getClientIp(req);
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    if (ip) {
      const { count: totalCount } = await supabase
        .from("sbo_listing_offers")
        .select("*", { count: "exact", head: true })
        .eq("ip_address", ip);

      const { count: sameListingCount } = await supabase
        .from("sbo_listing_offers")
        .select("*", { count: "exact", head: true })
        .eq("ip_address", ip)
        .eq("listing_id", listing_id);

      if ((totalCount ?? 0) >= MAX_OFFERS_PER_IP) {
        return NextResponse.json(
          { error: "Toplam en fazla 4 teklif verebilirsiniz." },
          { status: 429 }
        );
      }

      if ((sameListingCount ?? 0) >= MAX_OFFERS_PER_LISTING_PER_IP) {
        return NextResponse.json(
          { error: "Bu ilana zaten bir teklif verdiniz." },
          { status: 429 }
        );
      }
    }

    const { error } = await supabase.from("sbo_listing_offers").insert({
      listing_id,
      customer_name: name,
      customer_phone: phone,
      offer_amount: amount,
      ip_address: ip || null,
    });

    if (error) {
      console.error("listing-offer insert error:", error);
      return NextResponse.json(
        { error: "Kayıt oluşturulamadı." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("listing-offer error", e);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
