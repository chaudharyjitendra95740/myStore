import { createContext, useState } from "react";

const LoginContext = createContext();

export default function LoginContextProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  const [loginUser, setLoginUser] = useState([]);

  const value = {
    isLogin,
    setIsLogin,
    loginUser,
    setLoginUser,
  };
  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
}

export { LoginContext };
