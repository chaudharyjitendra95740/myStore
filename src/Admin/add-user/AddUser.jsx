import { useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../utils/Firebase";
import toast, { Toaster } from "react-hot-toast";

export default function AddUser() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.name || !user.email || !user.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      // Check if email already exists
      const q = query(
        collection(db, "signUsers"),
        where("email", "==", user.email),
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        toast.error("Email already exists");
        return;
      }

      // Save user in Firestore
      await addDoc(collection(db, "signUsers"), {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        createdAt: serverTimestamp(),
      });

      toast.success("User Added Successfully!");

      setUser({
        name: "",
        email: "",
        password: "",
        role: "user",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add user");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-5">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Add User</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={user.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={user.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Add User
          </button>
        </form>

        <Toaster />
      </div>
    </div>
  );
}
