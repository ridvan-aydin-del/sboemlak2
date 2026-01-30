import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const LIMITS = {
  customer_name: 100,
  customer_phone: 20,
  note: 500,
  budget_min: 0,
  budget_max: 999_999_999_999,
} as const;

function getClientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;

  return req.headers.get("x-real-ip") ?? null;
}

function clampNum(val: unknown, min: number, max: number): number | null {
  if (val == null || val === "") return null;

  const n = Number(val);
  if (Number.isNaN(n)) return null;

  if (n < min || n > max) return null;

  return n;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      customer_name,
      customer_phone,
      listing_type,
      property_type,
      min_budget,
      max_budget,
      note,
    } = body;

    /*
    ======================
    VALIDATION
    ======================
    */

    if (!customer_name || !customer_phone || !listing_type || !property_type) {
      return NextResponse.json(
        {
          error:
            "Ad Soyad, Telefon, Satılık/Kiralık ve Konut/İş Yeri/Arsa zorunludur.",
        },
        { status: 400 }
      );
    }

    const name = String(customer_name).trim().slice(0, LIMITS.customer_name);
    const phone = String(customer_phone).trim().slice(0, LIMITS.customer_phone);

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Ad Soyad ve Telefon boş olamaz." },
        { status: 400 }
      );
    }

    if (phone.length < 10) {
      return NextResponse.json(
        { error: "Geçerli bir telefon numarası girin." },
        { status: 400 }
      );
    }

    const minB = clampNum(min_budget, LIMITS.budget_min, LIMITS.budget_max);
    const maxB = clampNum(max_budget, LIMITS.budget_min, LIMITS.budget_max);

    const noteVal =
      note != null && String(note).trim() !== ""
        ? String(note).trim().slice(0, LIMITS.note)
        : null;

    const ip = getClientIp(req);

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    /*
    ======================
    DB RATE LIMIT (ATOMIC)
    ======================
    */

    if (ip) {
      const { data, error } = await supabase.rpc(
        "check_and_increment_rate_limit",
        { user_ip: ip }
      );

      if (error) {
        console.error("Rate limit rpc error:", error);
        return NextResponse.json(
          { error: "Rate limit kontrolü başarısız." },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          { error: "10 dakika içinde en fazla 2 talep gönderebilirsiniz." },
          { status: 429 }
        );
      }
    }

    /*
    ======================
    INSERT REQUEST
    ======================
    */

    const { error: insertError } = await supabase
      .from("sbo_customer_requests")
      .insert({
        customer_name: name,
        customer_phone: phone,
        listing_type: listing_type === "kiralik" ? "kiralik" : "satilik",
        property_type:
          property_type === "isYeri"
            ? "isYeri"
            : property_type === "arsa"
            ? "arsa"
            : "konut",
        min_budget: minB,
        max_budget: maxB,
        note: noteVal,
        ip_address: ip || null,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Insert error:", insertError);

      return NextResponse.json(
        { error: "Kayıt oluşturulamadı" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("customer-request error", e);

    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}