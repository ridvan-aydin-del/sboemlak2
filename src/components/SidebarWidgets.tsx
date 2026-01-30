"use client";

import { CreditCalculator } from "./CreditCalculator";

const GOOGLE_PLACE_URL =
  "https://search.google.com/local/writereview?placeid=ChIJ..."; // SBO Emlak Google Place ID ile güncellenmeli

export function SidebarWidgets() {
  return (
    <aside className="flex w-full flex-col gap-4 lg:w-72 lg:shrink-0">
      <CreditCalculator />

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-xs text-slate-700">
        <h3 className="mb-2 text-sm font-semibold text-slate-900">
          İletişim & Konum
        </h3>
        <p className="mb-2">
          SBO Emlak Ofisi - İstanbul, Örnek Mah. Demo Sk. No: 1
        </p>
        <p className="mb-2">
          Tel:{" "}
          <a href="tel:+905551112233" className="font-semibold text-emerald-600">
            0 (555) 111 22 33
          </a>
        </p>
        <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
          <iframe
            title="Ofis Konumu"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12039.1111!2d28.97953!3d41.015137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzU0LjUiTiAyOMKwNTgnNTYuMiJF!5e0!3m2!1str!2str!4v1700000000000"
            width="100%"
            height="170"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <a
          href="https://g.page/r/SBO-EMLAK/review"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
        >
          <i className="fa-brands fa-google text-lg" />
          Google&apos;da Puan Ver / Yorum Yap
        </a>
      </section>
    </aside>
  );
}
