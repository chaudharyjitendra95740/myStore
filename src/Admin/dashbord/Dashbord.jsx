import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../features/auth/hooks/LoginContext";
import LoginForm from "../../features/auth/components/LoginForm";
import { Link } from "react-router-dom";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/Firebase";

export default function Dashboard() {
  const { isLogin, loginUser } = useContext(LoginContext);

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Users
        const usersSnapshot = await getDocs(collection(db, "signUsers"));

        const usersData = usersSnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));

        setUsers(usersData);

        // Products
        const productsSnapshot = await getDocs(collection(db, "products"));

        const productsData = productsSnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));

        setProducts(productsData);

        // Orders
        const ordersSnapshot = await getDocs(collection(db, "buyProduct"));

        const ordersData = ordersSnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));

        setOrders(ordersData);
      } catch (error) {
        console.log("Dashboard fetch error:", error);
      }
    }
    fetchDashboardData();
  }, []);

  const latestProduct = products.length > 1 ? products[1] : null;
  const latestOrder = orders.length > 0 ? orders[orders.length - 1].id : null;

  const latestOrderPrice =
    orders.length > 0 ? orders[orders.length - 1].totalAmount : 0;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending" || !order.status,
  ).length;

  const acceptedOrders = orders.filter(
    (order) => order.status === "Accepted",
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled",
  ).length;

  const totalRevenue = orders
    .filter((order) => order.status === "Accepted")
    .reduce((total, order) => total + Number(order.totalAmount || 0), 0)
    .toFixed(2);

  const total = products
    .reduce(
      (total, product) =>
        total + Number((product.price || 0) * (product.stock || 0)),
      0,
    )
    .toFixed(2);

  return (
    <>
      {isLogin ? (
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

            <p className="text-gray-500 text-sm flex items-center gap-2">
              Welcome back!
              <span className="text-2xl text-red-500 flex items-center gap-1">
                {loginUser?.name || "Admin"}

                <i
                  className="fa-solid fa-hand fa-rotate-by"
                  style={{
                    color: "brown",
                    rotate: "25deg",
                    fontSize: "25px",
                  }}
                ></i>
              </span>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="text-gray-500 text-sm">Total Users</h3>

              <p className="text-2xl font-bold text-gray-800">{users.length}</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="text-gray-500 text-sm">Products</h3>

              <p className="text-2xl font-bold text-gray-800">
                {products.length}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="text-gray-500 text-sm">Pending Orders</h3>

              <p className="text-2xl font-bold text-yellow-500">
                {pendingOrders}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="text-gray-500 text-sm">Accepted Orders</h3>

              <p className="text-2xl font-bold text-green-500">
                {acceptedOrders}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="text-gray-500 text-sm">Cancelled Orders</h3>

              <p className="text-2xl font-bold text-red-500">
                {cancelledOrders}
              </p>
            </div>
          </div>

          {/* Revenue */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-auto gap-4">
            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="text-gray-500 text-sm">
                Total Sell Product Revenue
              </h3>

              <p className="text-2xl font-bold text-green-600">
                <i className="fa-solid fa-indian-rupee-sign"></i>
                {totalRevenue}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="text-gray-500 text-sm">Total Product Revenue</h3>

              <p className="text-2xl font-bold text-blue-600">
                <i className="fa-solid fa-indian-rupee-sign"></i>
                {total}
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

              <ul className="space-y-3 text-sm text-gray-600">
                <li>User registered: {loginUser?.name || "No User"}</li>

                <li>
                  Latest product added:{" "}
                  {latestProduct?.type ||
                    latestProduct?.name ||
                    "No Product Added"}
                </li>

                <li>Latest Order placed: #{latestOrder || "No Orders"}</li>

                <li>
                  Last Payment received:
                  <i className="fa-solid fa-indian-rupee-sign text-xs ml-1"></i>
                  {latestOrderPrice}
                </li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

              <div className="flex flex-col gap-3">
                <Link
                  to="/addUser"
                  className="bg-blue-600 text-white py-2 text-center rounded-lg hover:bg-blue-700 transition"
                >
                  Add User
                </Link>

                <Link
                  to="/addProduct"
                  className="bg-green-600 text-white py-2 text-center rounded-lg hover:bg-green-700 transition"
                >
                  Add Product
                </Link>

                <Link
                  to="/viewReport"
                  className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition text-center"
                >
                  View Products Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoginForm />
      )}
    </>
  );
}
