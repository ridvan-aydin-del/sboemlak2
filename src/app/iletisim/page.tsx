export default function IletisimPage() {
  const address = "Eyüp Sultan, Merkez Sk. No:20/B, 34885 Sancaktepe/İstanbul";
  const directionsUrl =
    "https://www.google.com/maps/dir/?api=1&origin=Sancaktepe+Samandıra+Metro+Durağı,+Sancaktepe,+İstanbul&destination=Eyüp+Sultan,+Merkez+Sk.+No:20/B,+34885+Sancaktepe/İstanbul";
  const mapEmbedQuery = encodeURIComponent("Eyüp Sultan, Merkez Sk. No:20/B, 34885 Sancaktepe İstanbul");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">İletişim</h1>
        <p className="text-sm text-slate-700">
          Ofisimize Sancaktepe Samandıra metro durağından ulaşabilirsiniz.
          Aşağıdaki haritadan konumumuzu görebilir veya yol tarifi alabilirsiniz.
        </p>
        <div className="space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-semibold">Ofis Adresi:</span> {address}
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
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          <i className="fa-solid fa-location-arrow" />
          Samandıra Metro&apos;dan yol tarifi al
        </a>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <h2 className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900">
          Konum – Google Haritalar
        </h2>
        <div className="relative h-[320px] w-full">
          <iframe
            title="SBO Emlak ofis konumu"
            src={`https://www.google.com/maps?q=${mapEmbedQuery}&output=embed`}
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <p className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-500">
          Samandıra metro durağından ofisimize nasıl ulaşacağınızı görmek için
          &quot;Samandıra Metro&apos;dan yol tarifi al&quot; butonuna tıklayın.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
