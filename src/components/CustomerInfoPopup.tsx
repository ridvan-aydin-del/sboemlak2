"use client";

import type { Listing } from "@/types/listing";

interface CustomerInfoPopupProps {
  listing: Listing;
  onClose: () => void;
  /** Sadece admin görür (gizli_not) */
  showAdminNote?: boolean;
}

export function CustomerInfoPopup({
  listing,
  onClose,
  showAdminNote = false,
}: CustomerInfoPopupProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-900">Müşteri bilgisi</h3>
        <p className="mt-1 text-[11px] text-slate-500">#{listing.id.slice(0, 8)} · {listing.title?.slice(0, 40)}…</p>
        <dl className="mt-3 space-y-2 text-xs">
          <div>
            <dt className="font-medium text-slate-500">Müşteri Ad-Soyad</dt>
            <dd className="text-slate-800">{listing.customer_name || "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Müşteri Telefon</dt>
            <dd className="text-slate-800">{listing.customer_phone || "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Komisyon</dt>
            <dd className="text-slate-800">
              {listing.commission_type === "dahil"
                ? "Dahil"
                : listing.commission_type === "haric"
                  ? "Hariç"
                  : "—"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Satış danışmanı notu</dt>
            <dd className="whitespace-pre-wrap text-slate-800">
              {listing.seller_note || "—"}
            </dd>
          </div>
          {showAdminNote && (
            <div>
              <dt className="font-medium text-slate-500">Admin notu (gizli)</dt>
              <dd className="whitespace-pre-wrap text-slate-800">
                {(listing as Listing & { gizli_not?: string | null }).gizli_not || "—"}
              </dd>
            </div>
          )}
        </dl>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Kapat
          </button>
        </div>
      </div>
    </>
  );
}
