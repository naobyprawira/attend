"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  loginWithPassword,
  logoutSession,
  refreshSession,
  setAuthSessionListener,
  type AuthSession,
} from "@/lib/api";

interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const PUBLIC_PATHS = ["/login", "/forgot-password", "/onboarding", "/setup-success"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

function mapSessionToState(session: AuthSession): AuthState {
  return {
    user: session.user,
    accessToken: session.accessToken,
    isLoading: false,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const loggingOutRef = useRef(false);
  const pathnameRef = useRef(pathname);
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
  });

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    let alive = true;

    setAuthSessionListener((session) => {
      if (!alive) return;
      if (!session) {
        setState({ user: null, accessToken: null, isLoading: false });
        if (!loggingOutRef.current && !isPublicPath(pathnameRef.current)) {
          router.push("/login");
        }
        return;
      }
      setState(mapSessionToState(session));
    });

    refreshSession()
      .then((session) => {
        if (!alive) return;
        if (session) {
          setState(mapSessionToState(session));
        } else {
          setState({ user: null, accessToken: null, isLoading: false });
        }
      })
      .finally(() => {
        if (alive) {
          setState((current) => ({ ...current, isLoading: false }));
        }
      });

    return () => {
      alive = false;
      setAuthSessionListener(null);
    };
  }, [router]);

  const login = useCallback(async (username: string, password: string) => {
    const session = await loginWithPassword(username, password);
    setState(mapSessionToState(session));
    router.push("/");
  }, [router]);

  const logout = useCallback(async () => {
    loggingOutRef.current = true;
    try {
      await logoutSession();
      setState({ user: null, accessToken: null, isLoading: false });
      router.push("/login");
    } finally {
      loggingOutRef.current = false;
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
