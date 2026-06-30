import { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../features/auth/hooks/LoginContext";
import { Link } from "react-router-dom";

import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../utils/Firebase";

export default function Settings() {
  const { setIsLogin } = useContext(LoginContext);

  const [user, setUser] = useState({
    name: "",
    email: "",
    photo: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const q = query(
          collection(db, "loginUser"),
          orderBy("loginAt", "desc"),
          limit(1),
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const currentUser = snapshot.docs[0].data();

          setUser({
            name: currentUser.name || "",
            email: currentUser.email || "",
            photo: currentUser.photo || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCurrentUser();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setUser((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setUser((prev) => ({
      ...prev,
      photo: "",
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 px-4 h-[calc(100vh-3rem)] overflow-hidden print:bg-white print:h-auto print:overflow-visible print:p-0">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:max-w-full">
        {/* Header */}
        <div className="bg-green-600 p-6 text-center text-white">
          <h2 className="text-2xl font-bold">My Profile</h2>

          <p className="text-sm text-green-100">Account Report Details</p>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={user.photo || "https://via.placeholder.com/150"}
                alt="profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-green-500 shadow-lg"
              />
            </div>

            {/* Upload Photo */}
            <label className="mt-4 cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            {/* Remove Photo */}
            {user.photo && (
              <button
                onClick={handleRemovePhoto}
                className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition hover:cursor-pointer duration-300"
              >
                Remove Photo
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="mt-6 space-y-3 text-gray-700 text-left max-w-xs mx-auto flex flex-col">
            <p className="font-semibold">
              Name:{" "}
              <span className="font-normal">{user.name || "Guest User"}</span>
            </p>

            <p className="font-semibold">
              Email:{" "}
              <span className="font-normal">{user.email || "Not Added"}</span>
            </p>

            <div className="flex">
              <Link
                to="/loginForm"
                className="w-full font-semibold bg-red-600 text-center text-white py-2 rounded-lg hover:bg-red-700 duration-300"
                onClick={() => setIsLogin(false)}
              >
                Log Out
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
