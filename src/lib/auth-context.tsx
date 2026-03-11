'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authEvents, authStorage, type StoredAuthSnapshot } from "@/lib/auth-storage";
import { authService, type LoginPayload, type RegisterPayload } from "@/lib/services/auth";

interface AuthContextValue {
  isInitializing: boolean;
  isAuthenticated: boolean;
  user: StoredAuthSnapshot["user"] | null;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const syncFromStorage = (setSnapshot: (value: StoredAuthSnapshot | null) => void): void => {
  setSnapshot(authStorage.get());
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [snapshot, setSnapshot] = useState<StoredAuthSnapshot | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    syncFromStorage(setSnapshot);
    setIsInitializing(false);

    const onTokensUpdated = () => syncFromStorage(setSnapshot);
    const onSignedOut = () => setSnapshot(null);

    window.addEventListener(authEvents.tokensUpdated, onTokensUpdated);
    window.addEventListener(authEvents.signedOut, onSignedOut);

    return () => {
      window.removeEventListener(authEvents.tokensUpdated, onTokensUpdated);
      window.removeEventListener(authEvents.signedOut, onSignedOut);
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const data = await authService.login(payload);
    const nextSnapshot = { user: data.user, tokens: data.tokens };
    authStorage.set(nextSnapshot);
    setSnapshot(nextSnapshot);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const data = await authService.register(payload);
    const nextSnapshot = { user: data.user, tokens: data.tokens };
    authStorage.set(nextSnapshot);
    setSnapshot(nextSnapshot);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = snapshot?.tokens.refresh_token;

    if (refreshToken) {
      await authService.logout(refreshToken).catch(() => undefined);
    }

    authStorage.clear();
    setSnapshot(null);
    window.dispatchEvent(new CustomEvent(authEvents.signedOut));
  }, [snapshot?.tokens.refresh_token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isInitializing,
      isAuthenticated: Boolean(snapshot?.tokens.access_token),
      user: snapshot?.user ?? null,
      permissions: snapshot?.user.permissions ?? [],
      hasPermission: (permission: string) => (snapshot?.user.permissions ?? []).includes(permission),
      login,
      register,
      logout
    }),
    [isInitializing, login, logout, register, snapshot]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
