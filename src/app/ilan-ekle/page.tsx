"use client";

import { useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import type { ListingDetailType, ListingType } from "@/types/listing";
import RichTextEditor from "@/components/editor/RichTextEditor";
import ImageUpload from "@/components/ImageUpload";

export default function IlanEklePage() {
  const [type, setType] = useState<ListingType>("satilik");
  const [detailType, setDetailType] = useState<ListingDetailType>("daire");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [descriptionHtml, setDescriptionHtml] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setMessage(null);

    const title = formData.get("title") as string;
    const price = Number(formData.get("price") || 0);
    const province = formData.get("province") as string;
    const district = formData.get("district") as string;
    const neighborhood = formData.get("neighborhood") as string;
    const rooms = formData.get("rooms") as string;
    const gross_area = Number(formData.get("gross_area") || 0);
    const net_area = Number(formData.get("net_area") || 0);
    const total_floors = Number(formData.get("total_floors") || 0);
    const floor = formData.get("floor") as string;
    const bathroom_count = Number(formData.get("bathroom_count") || 0);
    const heating = formData.get("heating") as string;
    const building_age = formData.get("building_age") as string;
    const parking_type = formData.get("parking_type") as string;
    const usage_status = formData.get("usage_status") as string;
    const deed_status = formData.get("deed_status") as string;
    const dues = Number(formData.get("dues") || 0);
    const is_credit_eligible = formData.get("is_credit_eligible") === "on";
    const credit_limit = formData.get("credit_limit")
      ? Number(formData.get("credit_limit"))
      : null;
    const eminevim_fuzul_evim_uygun =
      formData.get("eminevim_fuzul_evim_uygun") === "on";
    const description = formData.get("description") as string;
    const contact_number = formData.get("contact_number") as string;
    const customer_name = formData.get("customer_name") as string;
    const customer_phone = formData.get("customer_phone") as string;
    const commission_type = formData.get("commission_type") as "dahil" | "haric" | null;
    const seller_note = formData.get("seller_note") as string;
    const images = imageUrls.length > 0 ? imageUrls : null;

    const {
      data: { user },
    } = await supabaseBrowserClient.auth.getUser();

    if (!user) {
      setMessage("İlan eklemek için önce giriş yapmalısınız.");
      setLoading(false);
      return;
    }

    const { error } = await supabaseBrowserClient.from("sbo_listings").insert({
      title,
      description,
      price,
      type,
      category: "konut",
      detail_type: detailType,
      images,
      created_by: user.id,
      floor,
      heating,
      building_age,
      featured: false,
      net_area,
      gross_area,
      total_floors,
      bathroom_count,
      has_balcony: formData.get("has_balcony") === "on",
      has_elevator: formData.get("has_elevator") === "on",
      parking_type: parking_type || null,
      is_furnished: formData.get("is_furnished") === "on",
      usage_status,
      is_credit_eligible,
      credit_limit: credit_limit ?? null,
      eminevim_fuzul_evim_uygun,
      deed_status,
      dues,
      rooms,
      neighborhood,
      province,
      district,
      is_active: true,
      contact_number,
      customer_name: customer_name || null,
      customer_phone: customer_phone || null,
      commission_type: commission_type || null,
      seller_note: seller_note || null,
    });

    if (error) {
      console.error(error);
      setMessage("İlan kaydedilirken bir hata oluştu.");
    } else {
      setMessage("İlan başarıyla kaydedildi.");
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">İlan Ekle</h1>
        <p className="text-sm text-slate-600">
          Bu sayfa konut &gt; satılık &gt; daire senaryosu için
          özelleştirilmiştir. Diğer türleri daha sonra benzer mantıkla
          genişletebilirsiniz.
        </p>
      </header>

      {/* Üst seçimler */}
      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs">
          <p className="mb-2 text-[11px] font-semibold text-slate-700">
            Emlak Türü
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white">
              Konut
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-500 line-through">
              İş Yeri
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-500 line-through">
              Arsa
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs">
          <p className="mb-2 text-[11px] font-semibold text-slate-700">
            Durum
          </p>
          <div className="flex flex-wrap gap-1">
            {[
              { value: "satilik", label: "Satılık" },
              { value: "kiralik", label: "Kiralık" },
              { value: "devren-satilik", label: "Devren Satılık" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value as ListingType)}
                className={`rounded-full px-3 py-1 text-[11px] ${
                  type === opt.value
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs">
          <p className="mb-2 text-[11px] font-semibold text-slate-700">
            Konut Tipi
          </p>
          <div className="flex flex-wrap gap-1">
            {[
              { value: "daire", label: "Daire" },
              { value: "rezidans", label: "Rezidans" },
              { value: "mustakil-ev", label: "Müstakil Ev" },
              { value: "villa", label: "Villa" },
              { value: "yazlik", label: "Yazlık" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDetailType(opt.value as ListingDetailType)}
                className={`rounded-full px-3 py-1 text-[11px] ${
                  detailType === opt.value
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <form
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-xs"
        action={handleSubmit}
      >
        <h2 className="text-sm font-semibold text-slate-900">İlan Detayları</h2>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-slate-700">İlan Başlığı</label>
            <input
              name="title"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Örn: Bağdat Caddesi'nde Deniz Manzaralı 3+1 Daire"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-700">Fiyat (TL)</label>
            <input
              name="price"
              type="number"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Örn: 12500000"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-slate-700">İl</label>
            <input
              name="province"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="İstanbul"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-700">İlçe</label>
            <input
              name="district"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Kadıköy"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-700">Mahalle</label>
            <input
              name="neighborhood"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Suadiye"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-slate-700">Oda Sayısı</label>
            <input
              name="rooms"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="3+1"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-700">Brüt m²</label>
            <input
              name="gross_area"
              type="number"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-700">Net m²</label>
            <input
              name="net_area"
              type="number"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-700">Bina Kat Sayısı</label>
            <input
              name="total_floors"
              type="number"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-slate-700">Bulunduğu Kat</label>
            <input
              name="floor"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="5"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-700">Banyo Sayısı</label>
            <input
              name="bathroom_count"
              type="number"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-700">Isıtma Tipi</label>
            <input
              name="heating"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Doğalgaz kombi"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-700">Bina Yaşı</label>
            <input
              name="building_age"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="0, 1-5, 5-10..."
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-slate-700">Otopark</label>
            <select
              name="parking_type"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Seçiniz</option>
              <option value="acik">Açık</option>
              <option value="kapali">Kapalı</option>
              <option value="yok">Yok</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-slate-700">Kullanım Durumu</label>
            <input
              name="usage_status"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Boş, Kiracılı..."
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-700">Tapu Durumu</label>
            <input
              name="deed_status"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Kat mülkiyeti vb."
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-700">Aidat (TL)</label>
            <input
              name="dues"
              type="number"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <label className="flex items-center gap-2 text-slate-700">
            <input type="checkbox" name="has_balcony" className="h-3 w-3" />
            Balkon
          </label>
          <label className="flex items-center gap-2 text-slate-700">
            <input type="checkbox" name="has_elevator" className="h-3 w-3" />
            Asansör
          </label>
          <label className="flex items-center gap-2 text-slate-700">
            <input type="checkbox" name="is_furnished" className="h-3 w-3" />
            Eşyalı
          </label>
          <label className="flex items-center gap-2 text-slate-700">
            <input
              type="checkbox"
              name="is_credit_eligible"
              className="h-3 w-3"
            />
            Krediye Uygun
          </label>
          <div className="flex items-center gap-2 md:col-span-2">
            <label className="text-slate-700">Kredi Limiti (TL)</label>
            <input
              name="credit_limit"
              type="number"
              min={0}
              className="w-32 rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Örn: 5000000"
            />
          </div>
          <label className="flex items-center gap-2 text-slate-700">
            <input
              type="checkbox"
              name="eminevim_fuzul_evim_uygun"
              className="h-3 w-3"
            />
            Eminevim / Fuzul Evim uygun
          </label>
        </div>

        {/* İlan açıklaması + biçimlendirme */}
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-2 text-slate-700">
            Açıklama
          </label>
          <RichTextEditor
            content={descriptionHtml}
            onChange={(html) => setDescriptionHtml(html)}
          />
          {/* FormData ile backend'e gitmesi için hidden input */}
          <input type="hidden" name="description" value={descriptionHtml} />
        </div>

        {/* Fotoğraf yükleme (drag&drop sıralama + kapak seçimi) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-2 text-slate-700">
            Fotoğraflar
          </label>
          <ImageUpload
            initialImages={imageUrls}
            onUploadComplete={(urls) => setImageUrls(urls)}
          />
          {imageUrls.length > 0 && (
            <p className="text-[11px] text-slate-500">
              {imageUrls.length} fotoğraf yüklendi. İlk fotoğraf kapak olarak
              kaydedilir.
            </p>
          )}
        </div>

      

        <h2 className="mt-6 text-sm font-semibold text-slate-900">Müşteri Bilgileri</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-slate-700">Müşteri Ad-Soyad</label>
            <input
              name="customer_name"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Örn: Ahmet Yılmaz"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-700">Müşteri Telefon No</label>
            <input
              name="customer_phone"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="0 (5__) ___ __ __"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-700">Komisyon</label>
            <div className="flex gap-2">
              {[
                { value: "dahil", label: "Dahil" },
                { value: "haric", label: "Hariç" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-1 text-slate-700">
                  <input
                    type="radio"
                    name="commission_type"
                    value={opt.value}
                    className="h-3 w-3"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-slate-700">Not</label>
            <textarea
              name="seller_note"
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Bu ilana özel notunuz (İlanlarım sayfasında görünür)"
            />
          </div>
        </div>

        {message && (
          <p className="text-xs text-emerald-700">
            {message}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Kaydediliyor..." : "İlanı Yayınla"}
          </button>
        </div>
      </form>
    </div>
  );
}

