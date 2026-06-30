import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../utils/Firebase";

export default function AdminPage() {
  const [pendingOrders, setPendingOrders] = useState(0);
  const [loginUser, setLoginUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Current Login User
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "loginUser"), (snapshot) => {
      if (!snapshot.empty) {
        const user = snapshot.docs[0].data();
        setLoginUser(user);
      } else {
        setLoginUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Pending Orders
  useEffect(() => {
    const q = query(collection(db, "orders"), where("status", "==", "Pending"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingOrders(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-bold">
        Loading...
      </div>
    );
  }

  if (!loginUser || loginUser.role !== "admin") {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
      </div>
    );
  }

  return (
    <div className="flex h-fit-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="text-2xl font-bold p-5 border-b border-gray-700">
          Admin Panel
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/dashbord"
            className={({ isActive }) =>
              `block px-4 py-2 rounded font-semibold ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/authentication"
            className={({ isActive }) =>
              `block px-4 py-2 rounded font-semibold ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            Authentication
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `block px-4 py-2 rounded font-semibold ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            Users
          </NavLink>

          <NavLink
            to="/addProduct"
            className={({ isActive }) =>
              `block px-4 py-2 rounded font-semibold ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            Add Products
          </NavLink>

          <NavLink
            to="/odersPage"
            className={({ isActive }) =>
              `block px-4 py-2 rounded font-semibold ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            Orders
            {pendingOrders > 0 && (
              <sup className="ml-2 text-red-500 font-bold">{pendingOrders}</sup>
            )}
          </NavLink>

          <NavLink
            to="/messagePage"
            className={({ isActive }) =>
              `block px-4 py-2 rounded font-semibold ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            Messages
          </NavLink>

          <NavLink
            to="/settingsPage"
            className={({ isActive }) =>
              `block px-4 py-2 rounded font-semibold ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            Settings
          </NavLink>
        </nav>

        <div className="border-t border-gray-700 p-4 text-sm text-gray-400">
          Logged in as: <br />
          <span className="text-white font-semibold">{loginUser.name}</span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-screen overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
