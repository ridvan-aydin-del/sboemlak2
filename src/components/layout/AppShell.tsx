"use client";

import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthProvider, useAuth } from "@/components/layout/AuthProvider";

function InnerShell({ children }: { children: ReactNode }) {
  const { role, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header role={role} isAuthenticated={isAuthenticated} />
      <main className="mx-auto max-w-7xl px-4 pb-10 pt-4 lg:px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <InnerShell>{children}</InnerShell>
    </AuthProvider>
  );
}

