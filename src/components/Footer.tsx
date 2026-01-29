import Link from "next/link";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200/80 bg-gradient-to-t from-slate-50 via-white to-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-xs text-slate-600 md:flex-row md:items-center md:justify-between lg:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm">
            <Building2 size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900">SBO Emlak</span>
            <span className="text-[11px]">
              Yetki Belge No: <span className="font-mono">1234567</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/iletisim"
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm hover:border-emerald-500 hover:text-emerald-700"
          >
            İletişim
          </Link>
          <Link
            href="/hakkimizda"
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm hover:border-emerald-500 hover:text-emerald-700"
          >
            Hakkımızda
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-emerald-500 hover:text-emerald-600"
            >
              <i className="fa-brands fa-instagram text-sm" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-emerald-500 hover:text-emerald-600"
            >
              <i className="fa-brands fa-facebook text-sm" />
            </a>
            <a
              href="https://www.sahibinden.com"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-slate-500 hover:text-emerald-600"
            >
              Sahibinden
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="https://www.emlakjet.com"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-slate-500 hover:text-emerald-600"
            >
              Emlakjet
            </a>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} SBO Emlak. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}

