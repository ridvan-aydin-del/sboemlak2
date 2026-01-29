"use client";

import { useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, UserPlus, Phone } from "lucide-react";

export default function GirisPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Giriş yap
        const { data, error: signInError } =
          await supabaseBrowserClient.auth.signInWithPassword({
            email,
            password,
          });

        if (signInError) throw signInError;

        // Profil kontrolü - eğer yoksa oluştur
        const { data: profile } = await supabaseBrowserClient
          .from("sbo_profiles")
          .select("*")
          .eq("id", data.user?.id)
          .maybeSingle();

        if (!profile && data.user) {
          await supabaseBrowserClient.from("sbo_profiles").insert({
            id: data.user.id,
            full_name: data.user.email?.split("@")[0] || null,
            role: "musteri",
            whatsapp_number: null,
          });
        }

        router.push("/");
        router.refresh();
      } else {
        // Kayıt ol
        const { data, error: signUpError } =
          await supabaseBrowserClient.auth.signUp({
            email,
            password,
          });

        if (signUpError) throw signUpError;

        if (data.user) {
          // Profil oluştur
          await supabaseBrowserClient.from("sbo_profiles").insert({
            id: data.user.id,
            full_name: fullName || null,
            role: "musteri",
            whatsapp_number: whatsapp || null,
          });
        }

        alert(
          "Kayıt başarılı! E-posta adresinize gönderilen link ile hesabınızı doğrulayabilirsiniz."
        );
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setFullName("");
        setWhatsapp("");
      }
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-12">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-sm">
            <LogIn size={24} />
          </div>
          <h1 className="text-xl font-semibold text-slate-900">
            {isLogin ? "Giriş Yap" : "Kayıt Ol"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Ad Soyad
              </label>
              <div className="relative">
                <UserPlus
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Adınız Soyadınız"
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                WhatsApp Numarası
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="0 (5__) ___ __ __"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              E-posta
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Şifre
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading
              ? "İşleniyor..."
              : isLogin
              ? "Giriş Yap"
              : "Kayıt Ol"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-xs text-emerald-600 hover:text-emerald-700"
          >
            {isLogin
              ? "Hesabınız yok mu? Kayıt olun"
              : "Zaten hesabınız var mı? Giriş yapın"}
          </button>
        </div>
      </div>
    </div>
  );
}
