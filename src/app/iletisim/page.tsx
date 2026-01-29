export default function IletisimPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 md:flex-row">
      <section className="flex-1 space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">İletişim</h1>
        <p className="text-sm text-slate-700">
          Aşağıdaki bilgiler demo amaçlıdır; gerçek ofis adresinizi, telefon ve
          e-posta bilgilerinizi burada güncelleyebilirsiniz.
        </p>
        <div className="space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-semibold">Ofis Adresi:</span> İstanbul, Örnek
            Mah. Demo Sk. No: 1
          </p>
          <p>
            <span className="font-semibold">Telefon:</span>{" "}
            <a href="tel:+905551112233" className="text-emerald-700">
              0 (555) 111 22 33
            </a>
          </p>
          <p>
            <span className="font-semibold">E-posta:</span>{" "}
            <a
              href="mailto:info@sboemlak.test"
              className="text-emerald-700 underline"
            >
              info@sboemlak.test
            </a>
          </p>
        </div>
      </section>

      <section className="flex-1 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">
          Hızlı İletişim Formu
        </h2>
        <p className="text-xs text-slate-600">
          Bu form demo amaçlıdır, arka planda gerçek bir mail gönderimi
          yapılmamaktadır. İsterseniz Supabase Edge Functions veya bir e-posta
          servisi ile kolayca entegre edebilirsiniz.
        </p>
        <form className="space-y-2 text-xs">
          <div>
            <label className="mb-1 block text-slate-600">Ad Soyad</label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Adınız Soyadınız"
            />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-slate-600">Telefon</label>
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="0 (5__) ___ __ __"
              />
            </div>
            <div>
              <label className="mb-1 block text-slate-600">E-posta</label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="ornek@mail.com"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-slate-600">Mesajınız</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="İlan numarası veya talebinizle ilgili detayları yazabilirsiniz."
            />
          </div>
          <button
            type="button"
            className="mt-1 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Gönder (Demo)
          </button>
        </form>
      </section>
    </div>
  );
}

