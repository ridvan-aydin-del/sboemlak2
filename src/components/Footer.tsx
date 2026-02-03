import Link from "next/link";
import Image from "next/image";
import bankalar from "../../public/bankalar.gif";
export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200/80 bg-gradient-to-t from-slate-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-slate-600 lg:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex min-w-0 shrink-0 items-center gap-2">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
              <Image src="/logo.png" alt="S.B.O Gayrimenkul" fill className="object-contain" sizes="40px" />
            </div>
            <div className="min-w-0">
              <span className="block font-semibold text-slate-900">S.B.O Gayrimenkul</span>
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

          <p className="shrink-0 text-[11px] text-slate-400 md:order-last">
            © {new Date().getFullYear()} SBO Emlak. Tüm hakları saklıdır.
          </p>
        </div>
        <div className="mt-4 w-full border-t border-slate-200 pt-4">
          <p className="mb-2 text-center text-[11px] font-medium text-slate-600">
            Anlaşmalı bankalar
          </p>
          <div className="flex justify-center">
            <img
              src={bankalar.src}
              alt="Anlaşmalı bankalar"
              className="h-auto max-h-14 w-auto object-contain sm:max-h-16"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

