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

// RATE LIMIT AYARLARI
const RATE_LIMIT = {
  maxRequests: 2,
  windowMinutes: 10,
  blockHours: 5,
};

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

    if (!customer_name || !customer_phone || !listing_type || !property_type) {
      return NextResponse.json(
        { error: "Ad Soyad, Telefon, Satılık/Kiralık ve Konut/İş Yeri/Arsa zorunludur." },
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

    if (min_budget != null && min_budget !== "" && minB === null) {
      return NextResponse.json(
        { error: "Min. bütçe geçerli bir sayı olmalı." },
        { status: 400 }
      );
    }

    if (max_budget != null && max_budget !== "" && maxB === null) {
      return NextResponse.json(
        { error: "Max. bütçe geçerli bir sayı olmalı." },
        { status: 400 }
      );
    }

    const noteVal =
      note != null && String(note).trim() !== ""
        ? String(note).trim().slice(0, LIMITS.note)
        : null;

    const ip = getClientIp(req);
    console.log("IP:", ip);
console.log("Headers:", Object.fromEntries(req.headers));
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    /*
     ======================
     RATE LIMIT KONTROLÜ
     ======================
    */

    if (ip) {
      const now = new Date();

      const windowStart = new Date(
        now.getTime() - RATE_LIMIT.windowMinutes * 60 * 1000
      );

      const blockStart = new Date(
        now.getTime() - RATE_LIMIT.blockHours * 60 * 60 * 1000
      );

      // Son 10 dakika kontrol
      const { count: recentCount } = await supabase
        .from("sbo_customer_requests")
        .select("*", { count: "exact", head: true })
        .eq("ip_address", ip)
        .gte("created_at", windowStart.toISOString());

      if ((recentCount ?? 0) >= RATE_LIMIT.maxRequests) {
        // 5 saat blok kontrolü
        const { count: blockCount } = await supabase
          .from("sbo_customer_requests")
          .select("*", { count: "exact", head: true })
          .eq("ip_address", ip)
          .gte("created_at", blockStart.toISOString());

        if ((blockCount ?? 0) >= RATE_LIMIT.maxRequests) {
          return NextResponse.json(
            {
              error:
                "Çok fazla talep gönderdiniz. Lütfen 5 saat sonra tekrar deneyin.",
            },
            { status: 429 }
          );
        }
      }
    }

    /*
     ======================
     INSERT
     ======================
    */

    const { error } = await supabase.from("sbo_customer_requests").insert({
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
    });

    if (error) {
      console.error("customer-request insert error", error);
      return NextResponse.json({ error: "Kayıt oluşturulamadı" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("customer-request error", e);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
