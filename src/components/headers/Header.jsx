import { NavLink } from "react-router-dom";
import LoginBtn from "../buttons/LoginBtn";
import SignupBtn from "../buttons/SignupBtn";
import BuyCart from "./BuyCart";
import Logo from "./Logo";
import { useContext, useState } from "react"; // Added useState
import { LoginContext } from "../../features/auth/hooks/LoginContext";

export default function Header() {
  const { isLogin, loginUser } = useContext(LoginContext);
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="py-5 px-8 bg-gray-300 flex flex-wrap gap-5 justify-between max-w-full sticky z-50 w-full top-0">
      <Logo />

      {/* Hamburger Button: Only shows on small screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-gray-800 focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Navigation Links and Buttons container */}
      <div
        className={`${isOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row items-center justify-center gap-5 w-full md:w-auto mt-4 md:mt-0`}
      >
        {isLogin && loginUser.role === "user" ? (
          <>
            {/* NavLinks stack vertically on mobile, horizontally on desktop */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-5">
              <NavLink
                to="/fruits"
                className={({ isActive }) =>
                  `font-semibold ${isActive ? "text-green-600" : "text-gray-800"} hover:cursor-pointer`
                }
              >
                Fruits
              </NavLink>

              <NavLink
                to="/tea"
                className={({ isActive }) =>
                  `font-semibold ${isActive ? "text-green-600" : "text-gray-800"} hover:cursor-pointer`
                }
              >
                Tea
              </NavLink>

              <NavLink
                to="/ghee"
                className={({ isActive }) =>
                  `font-semibold ${isActive ? "text-green-600" : "text-gray-800"} hover:cursor-pointer`
                }
              >
                Ghee
              </NavLink>

              <NavLink
                to="/vegetables"
                className={({ isActive }) =>
                  `font-semibold ${isActive ? "text-green-600" : "text-gray-800"} hover:cursor-pointer`
                }
              >
                Vegetables
              </NavLink>
            </div>

            {/* Buttons container for alignment */}
            <div className="flex items-center gap-5">
              <LoginBtn />
              <BuyCart />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-5">
            <LoginBtn />
            <SignupBtn />
          </div>
        )}
      </div>
    </header>
  );
}
