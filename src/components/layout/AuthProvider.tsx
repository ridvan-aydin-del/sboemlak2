"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import type { UserRole } from "@/types/profile";

interface AuthContextValue {
  loading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  loading: true,
  isAuthenticated: false,
  role: null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthContextValue>({
    loading: true,
    isAuthenticated: false,
    role: null,
    signOut: async () => {},
  });

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabaseBrowserClient.auth.getUser();

    if (!user) {
      setState((s) => ({
        ...s,
        loading: false,
        isAuthenticated: false,
        role: null,
      }));
      return;
    }

    const { data, error } = await supabaseBrowserClient
      .from("sbo_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error(
        "Profil getirilemedi",
        error?.message ?? error,
        "code:",
        error?.code,
        "details:",
        error?.details
      );
      setState((s) => ({
        ...s,
        loading: false,
        isAuthenticated: true,
        role: null,
      }));
      return;
    }

    setState({
      loading: false,
      isAuthenticated: true,
      role: (data?.role as UserRole) ?? null,
      signOut: state.signOut,
    });
  };

  const signOut = async () => {
    await supabaseBrowserClient.auth.signOut();
    setState({ loading: false, isAuthenticated: false, role: null, signOut });
  };

  useEffect(() => {
    fetchProfile();

    const {
      data: { subscription },
    } = supabaseBrowserClient.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setState((s) => ({
          ...s,
          loading: false,
          isAuthenticated: false,
          role: null,
        }));
      } else {
        void fetchProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
