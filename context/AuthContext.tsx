"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderContent({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (initialized) return;
    
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem("token");

        if (savedToken) {
          setToken(savedToken);
          await fetchProfile(savedToken);
        }

        if (savedToken) {
          setToken(savedToken);
          await fetchProfile(savedToken);
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setLoading(false);
        setInitialized(true); // ← MARK là đã init
      }
    };

    initAuth();
  }, [initialized]);

  const fetchProfile = async (token: string) => {
    try {
      const res = await axios.get("http://localhost:5000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
    await fetchProfile(token);
    router.push("/"); // redirect sau login
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
      <AuthProviderContent>{children}</AuthProviderContent>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
