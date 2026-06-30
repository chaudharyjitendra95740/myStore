import { useContext, useState } from "react";
import { LoginContext } from "../auth/hooks/LoginContext";
import { resetCart } from "../../features/auth/hooks/store/CounterSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { setIsLogin, loginUser } = useContext(LoginContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profileImg, setProfileImg] = useState(
    localStorage.getItem("ProfileImg") || null,
  );

  function handleLogOut() {
    setIsLogin(false);

    localStorage.removeItem("AddFruits");
    localStorage.removeItem("AddTea");
    localStorage.removeItem("AddGhee");

    dispatch(resetCart());

    navigate("/loginForm");
  }

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      localStorage.setItem("ProfileImg", imageUrl);
      setProfileImg(imageUrl);

      e.target.value = "";
    }
  }

  function handleRemoveImage() {
    setProfileImg(null);
    localStorage.removeItem("ProfileImg");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-6 sm:p-8 flex flex-col items-center gap-5">
        {/* USER IMAGE */}
        <div className="flex items-center flex-col  gap-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full m-auto bg-gray-200 overflow-hidden flex items-center justify-center">
            {profileImg ? (
              <img src={profileImg} className="w-full h-full object-cover" />
            ) : (
              <p className="text-gray-400 text-sm">No Image</p>
            )}
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            id="upload-photo"
            className="hidden"
            onChange={handleImageChange}
          />
          {profileImg === null ? (
            <label
              htmlFor="upload-photo"
              className="bg-green-500 p-2 rounded-xl cursor-pointer text-white "
            >
              Add Photo
            </label>
          ) : (
            <button
              onClick={handleRemoveImage}
              className="bg-red-500 p-2 rounded-xl text-white"
            >
              Remove
            </button>
          )}
        </div>

        {/* USER INFO */}
        <div className="text-justify">
          <h2 className="text-2xl font-bold mb-5 text-gray-800 text-center">
            {loginUser?.name}
          </h2>

          <p className="text-gray-600">
            <span className="font-semibold">Email:</span> {loginUser?.email}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold">Password:</span>{" "}
            {loginUser?.password}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold">User Role:</span> {loginUser?.role}
          </p>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogOut}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold hover:cursor-pointer"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
