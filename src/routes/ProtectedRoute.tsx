import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { Role } from "@/app/slices/authSlice";
import type { RootState } from "@/app/rootReducer";

interface Props {
  roles?: Role[];
}

const ProtectedRoute: React.FC<Props> = ({ roles }) => {
  const token = useSelector((s: RootState) => s.auth.token);
  const role = useSelector((s: RootState) => s.auth.user?.role);

  if (!token) return <Navigate to="/login" replace />;
  if (roles && role && !roles.includes(role)) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute;

