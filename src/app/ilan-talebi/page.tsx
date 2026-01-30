"use client";

import { LeadForm } from "@/components/LeadForm";

export default function IlanTalebiPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">İlan Talebi</h1>
        <p className="text-sm text-slate-600">
          Aradığınız kriterlere uygun ilan bulamadıysanız formu doldurun. Uygun
          ilan olduğunda sizinle iletişime geçeceğiz.
        </p>
      </header>
      <LeadForm />
    </div>
  );
}
