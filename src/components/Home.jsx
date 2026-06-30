

import { Outlet } from "react-router-dom";
import Header from "./headers/Header";
import Footer from "./footer/Footer";
import AdminPage from "../Admin/adminPage/AdminPage";
import { useContext } from "react";
import { LoginContext } from "../features/auth/hooks/LoginContext";

export default function Home() {
  const { isLogin, loginUser } = useContext(LoginContext);

  return (
    <>
      <Header />

      {isLogin && loginUser?.role === "admin" ? (
        <AdminPage />
      ) : (
        <>
          <Outlet />
          <div>
            <Footer />
          </div>
        </>
      )}
    </>
  );
}
