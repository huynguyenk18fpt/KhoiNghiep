"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { demoAuthStore, type DemoUser, type GoogleLoginProfile } from "@/lib/local-store";

type AuthContextType = {
  user: DemoUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (profile: GoogleLoginProfile) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (user: DemoUser) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    demoAuthStore
      .getSession()
      .then((session) => {
        if (active) setUser(session);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login: async (email: string, password: string) => {
        const session = await demoAuthStore.login(email, password);
        setUser(session);
        router.push("/");
      },
      loginWithGoogle: async (profile: GoogleLoginProfile) => {
        const session = await demoAuthStore.loginWithGoogle(profile);
        setUser(session);
        router.push("/");
      },
      signup: async (name: string, email: string, password: string) => {
        const session = await demoAuthStore.signup(name, email, password);
        setUser(session);
        router.push("/");
      },
      updateProfile: async (nextUser: DemoUser) => {
        const session = await demoAuthStore.updateProfile(nextUser);
        setUser(session);
      },
      logout: async () => {
        await demoAuthStore.logout();
        setUser(null);
        router.push("/login");
      },
    }),
    [loading, router, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
