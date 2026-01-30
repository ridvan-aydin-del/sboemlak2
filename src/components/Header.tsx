"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type UserRole } from "@/types/profile";
import { Building2, ChevronDown, Home, LogIn, LogOut, Shield, Star, UserCheck } from "lucide-react";

interface HeaderProps {
  role: UserRole | null;
  isAuthenticated: boolean;
  onSignOut?: () => Promise<void>;
}

const navBaseClasses =
  "text-xs font-medium transition-colors hover:text-emerald-500 flex items-center gap-1 px-3 py-1.5 rounded-full border border-transparent";

function NavLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`${navBaseClasses} ${
        isActive
          ? "bg-emerald-600/10 text-emerald-700 border-emerald-500/40 shadow-sm"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function Header({ role, isAuthenticated, onSignOut }: HeaderProps) {
  const [adminOpen, setAdminOpen] = useState(false);
  const isAdmin = role === "admin";
  const isSales = role === "satis-elemani";
  const isCustomer = role === "musteri";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2.5 sm:gap-4 lg:px-6">
        {/* Sol - Menü */}
        <nav className="flex flex-1 items-center justify-start gap-1 sm:gap-2 md:flex">
          <NavLink href="/hakkimizda" label="Hakkımızda" icon={<Building2 size={14} />} />
          <NavLink href="/iletisim" label="İletişim" icon={<UserCheck size={14} />} />

          {isAdmin && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAdminOpen(!adminOpen)}
                className={`${navBaseClasses} flex items-center gap-1 ${
                  adminOpen ? "bg-emerald-600/10 text-emerald-700" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Shield size={14} />
                <span>Admin</span>
                <ChevronDown size={12} className={adminOpen ? "rotate-180" : ""} />
              </button>
              {adminOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setAdminOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                    <Link
                      href="/admin/ilanlar"
                      className="block px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      onClick={() => setAdminOpen(false)}
                    >
                      Tüm İlanlar
                    </Link>
                    <Link
                      href="/admin/kullanicilar"
                      className="block px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      onClick={() => setAdminOpen(false)}
                    >
                      Kullanıcılar
                    </Link>
                    <Link
                      href="/ilan-ekle"
                      className="block px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      onClick={() => setAdminOpen(false)}
                    >
                      İlan Ekle
                    </Link>
                    <Link
                      href="/favorilerim"
                      className="block px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      onClick={() => setAdminOpen(false)}
                    >
                      Favoriler
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}

          {isSales && (
            <>
              <NavLink href="/ilanlarim" label="İlanlarım" icon={<Building2 size={14} />} />
              <NavLink href="/ilan-ekle" label="İlan Ekle" icon={<Star size={14} />} />
            </>
          )}

          {isCustomer && (
            <NavLink href="/favorilerim" label="Favorilerim" icon={<Star size={14} />} />
          )}

          {!isAuthenticated && (
            <>
              <NavLink href="/ilan-talebi" label="İlan Talebi" icon={<UserCheck size={14} />} />
              <NavLink href="/giris" label="Giriş Yap" icon={<LogIn size={14} />} />
            </>
          )}
        </nav>

        {/* Orta - Logo */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-700 text-white shadow-sm">
            <Home size={18} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              SBO Emlak
            </span>
            <span className="text-[11px] text-slate-500">
              Yetkili · Onaylı emlak danışmanlığı
            </span>
          </div>
        </Link>

        {/* Sağ - Sosyal + Çıkış yap */}
        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          {isAuthenticated && onSignOut && (
            <button
              type="button"
              onClick={() => void onSignOut()}
              className="flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 sm:px-3"
            >
              <LogOut size={12} />
              <span className="hidden sm:inline">Çıkış Yap</span>
            </button>
          )}
          <div className="hidden items-center gap-1 sm:flex">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-emerald-500 hover:text-emerald-600"
            >
              <i className="fa-brands fa-instagram text-base" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-emerald-500 hover:text-emerald-600"
            >
              <i className="fa-brands fa-facebook text-base" />
            </a>
            <a
              href="https://www.sahibinden.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Sahibinden"
              className="inline-flex h-8 px-2 items-center justify-center rounded-full border border-yellow-400 bg-yellow-300 text-[10px] font-semibold uppercase text-black shadow-sm hover:bg-yellow-400"
            >
              sahibinden
            </a>
            <a
              href="https://www.emlakjet.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Emlakjet"
              className="inline-flex h-8 px-2 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500 text-[10px] font-semibold uppercase text-white shadow-sm hover:bg-emerald-600"
            >
              emlakjet
            </a>
          </div>

          {!isAuthenticated && (
            <Link
              href="/giris"
              className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 md:hidden"
            >
              <LogIn size={14} />
              <span>Giriş</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
