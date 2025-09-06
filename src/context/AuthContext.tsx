import React, { createContext, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/rootReducer";

interface AuthCtx {
  isAuthenticated: boolean;
  role: string | null;
  user: { name: string; email: string } | null;
}

const AuthContext = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useSelector((s: RootState) => s.auth.token);
  const user = useSelector((s: RootState) => s.auth.user);
  const value = useMemo<AuthCtx>(() => ({ isAuthenticated: !!token, role: user?.role || null, user: user ? { name: user.name, email: user.email } : null }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthCtx = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthCtx must be used within AuthProvider");
  return ctx;
};

