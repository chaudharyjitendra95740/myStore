import { useContext } from "react";
import { LoginContext } from "../../features/auth/hooks/LoginContext";
import { useNavigate } from "react-router-dom";

export default function SignupBtn() {
  const { isLogin } = useContext(LoginContext);

  const navigate = useNavigate();

  if (isLogin) return null;

  return (
    <button
      className="bg-green-500 py-2.5 px-5 rounded-lg text-gray-800 font-semibold hover:bg-green-600 duration-300 hover:cursor-pointer"
      onClick={() => navigate("/signupForm")}
    >
      Sign Up
    </button>
  );
}
