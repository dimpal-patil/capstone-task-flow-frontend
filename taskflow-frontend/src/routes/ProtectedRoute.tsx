import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useContext(AuthContext);

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;