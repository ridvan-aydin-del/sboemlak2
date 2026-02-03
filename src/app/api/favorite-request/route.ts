import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const NAME_MAX = 100;
const PHONE_MAX = 20;

function getClientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return req.headers.get("x-real-ip") ?? null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listing_id, customer_name, customer_phone } = body;

    if (!listing_id || !customer_name || !customer_phone) {
      return NextResponse.json(
        { error: "İlan, ad soyad ve telefon zorunludur." },
        { status: 400 }
      );
    }

    const name = String(customer_name).trim().slice(0, NAME_MAX);
    const phone = String(customer_phone).trim().slice(0, PHONE_MAX);

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

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase.from("sbo_listing_favorites").insert({
      listing_id,
      customer_name: name,
      customer_phone: phone,
      ip_address: getClientIp(req) || null,
    });

    if (error) {
      console.error("favorite-request insert error:", error);
      return NextResponse.json(
        { error: "Kayıt oluşturulamadı." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("favorite-request error", e);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
