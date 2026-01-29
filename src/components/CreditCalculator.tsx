"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";

export function CreditCalculator() {
  const [amount, setAmount] = useState<string>("");
  const [term, setTerm] = useState<string>("120");
  const [rate, setRate] = useState<string>("3.2");
  const [result, setResult] = useState<{
    monthly: number;
    total: number;
  } | null>(null);

  const handleCalculate = () => {
    const principal = Number(amount);
    const months = Number(term);
    const interest = Number(rate) / 100 / 12;

    if (!principal || !months || !interest) {
      setResult(null);
      return;
    }

    const monthly =
      (principal * interest * Math.pow(1 + interest, months)) /
      (Math.pow(1 + interest, months) - 1);

    setResult({
      monthly: Math.round(monthly),
      total: Math.round(monthly * months),
    });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50/60 p-4 shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700">
          <Calculator size={16} />
        </span>
        Kredi Hesaplama
      </h3>
      <div className="space-y-2 text-xs">
        <div className="space-y-1">
          <label className="block text-slate-600">Kredi Tutarı (TL)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="Örn: 2.000.000"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1 space-y-1">
            <label className="block text-slate-600">Vade (Ay)</label>
            <input
              type="number"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="block text-slate-600">Faiz Oranı (% yıllık)</label>
            <input
              type="number"
              value={rate}
              step="0.01"
              onChange={(e) => setRate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleCalculate}
          className="mt-2 w-full rounded-full bg-emerald-600 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          Hesapla
        </button>

        {result && (
          <div className="mt-3 rounded-xl bg-white/80 px-3 py-2 text-xs text-emerald-900 ring-1 ring-emerald-100">
            <p>
              Aylık Taksit:{" "}
              <span className="font-semibold">
                {result.monthly.toLocaleString("tr-TR")} TL
              </span>
            </p>
            <p>
              Toplam Ödeme:{" "}
              <span className="font-semibold">
                {result.total.toLocaleString("tr-TR")} TL
              </span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

