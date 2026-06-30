
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../../features/auth/hooks/LoginContext";

export default function AdminRoute({ children }) {
  const { loginUser, isLogin } = useContext(LoginContext);

  if (!isLogin) {
    return <Navigate to="/loginForm" replace />;
  }

  if (loginUser?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
