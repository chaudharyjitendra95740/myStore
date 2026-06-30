import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../features/auth/hooks/LoginContext";
import { useDispatch } from "react-redux";
import { resetCart } from "../../features/auth/hooks/store/CounterSlice";

export default function LoginBtn() {
  const dispatch = useDispatch();
  const { isLogin, loginUser, setIsLogin } = useContext(LoginContext);

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);

  function handleClick() {
    navigate("/loginForm");
  }

  function handleProfile() {
    navigate("/userProfile");

    setShowMenu(false);
  }

  function handleLogout() {
    setIsLogin(false);

    localStorage.removeItem("AddFruits");
    localStorage.removeItem("AddTea");
    localStorage.removeItem("AddGhee");

    navigate("/loginForm");
    dispatch(resetCart());
  }

  return (
    <div className="relative">
      {isLogin === true ? (
        <>
          {/* PROFILE BUTTON */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow hover:shadow-lg duration-300  hover:cursor-pointer"
          >
            <i className="fa-regular fa-user text-xl text-green-700"></i>

            <span className="font-semibold text-gray-700">
              {loginUser?.name}
            </span>

            <i className="fa-solid fa-angle-down text-sm"></i>
          </button>

          {/* DROPDOWN */}
          {showMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
              {/* USER INFO */}
              <div className="p-4 border-b">
                <h3 className="font-bold text-gray-800 ">{loginUser?.name}</h3>

                <p className="text-sm text-gray-500">{loginUser?.email}</p>
              </div>

              <div className="flex flex-col">
                <button
                  variant="contained"
                  onClick={handleProfile}
                  className="text-left px-5 py-3 hover:bg-gray-100 duration-300 hover:cursor-pointer"
                >
                  <i className="fa-solid fa-user text-blue-600"></i> My Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="text-left px-5 py-3 text-red-500 hover:bg-red-50 duration-300 hover:cursor-pointer"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>{" "}
                  Logout
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <button
          className="bg-green-500 py-2.5 px-5 rounded-lg text-gray-800 font-semibold hover:cursor-pointer hover:bg-green-600 duration-300"
          onClick={handleClick}
        >
          Login
        </button>
      )}
    </div>
  );
}
