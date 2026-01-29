"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import type { UserRole } from "@/types/profile";

interface AuthContextValue {
  loading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
}

const AuthContext = createContext<AuthContextValue>({
  loading: true,
  isAuthenticated: false,
  role: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthContextValue>({
    loading: true,
    isAuthenticated: false,
    role: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabaseBrowserClient.auth.getUser();

      if (!user) {
        setState({ loading: false, isAuthenticated: false, role: null });
        return;
      }

      const { data, error } = await supabaseBrowserClient
        .from("sbo_profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Profil getirilemedi", error);
        setState({ loading: false, isAuthenticated: true, role: null });
        return;
      }

      setState({
        loading: false,
        isAuthenticated: true,
        role: (data?.role as UserRole) ?? null,
      });
    };

    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

