import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../utils/Firebase";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "buyProduct"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      setOrders(data);
    });

    return () => unsubscribe();
  }, []);

  async function updateStatus(docId, status) {
    try {
      await updateDoc(doc(db, "buyProduct", docId), {
        status,
      });
    } catch (error) {
      console.error("Status update error:", error);
    }
  }

  async function removeOrder(docId) {
    try {
      await deleteDoc(doc(db, "buyProduct", docId));
    } catch (error) {
      console.error("Delete order error:", error);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-sm text-gray-500">
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Order ID</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Quantity</th>
            <th className="px-6 py-4">Total</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.docId}
              className="border-b hover:bg-gray-50 transition"
            >
              {/* Product */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <img
                    src={order.image}
                    alt={order.name}
                    className="w-14 h-14 rounded-lg object-cover border"
                  />

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {order.name}
                    </h3>

                    <p className="text-sm text-gray-500">{order.type}</p>
                  </div>
                </div>
              </td>

              {/* Order ID */}
              <td className="px-6 py-4 text-gray-500">#{order.id}</td>

              {/* Price */}
              <td className="px-6 py-4 font-medium">
                <i className="fa-solid fa-indian-rupee-sign"></i>
                {order.price}
              </td>

              {/* Quantity */}
              <td className="px-6 py-4">{order.quantity}</td>

              {/* Total */}
              <td className="px-6 py-4 font-bold text-green-600">
                <i className="fa-solid fa-indian-rupee-sign"></i>
                {order.totalAmount}
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status || "Pending"}
                </span>
              </td>

              {/* Action */}
              <td className="px-6 py-4">
                <div className="flex justify-center gap-2 ">
                  {(!order.status || order.status === "Pending") && (
                    <>
                      <button
                        onClick={() => updateStatus(order.docId, "Accepted")}
                        className="w-9 h-9 rounded-lg bg-green-500 text-white hover:bg-green-600 hover:cursor-pointer"
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>

                      <button
                        onClick={() => updateStatus(order.docId, "Cancelled")}
                        className="w-9 h-9 rounded-lg bg-red-500 text-white hover:bg-red-600 hover:cursor-pointer"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => removeOrder(order.docId)}
                    className="w-9 h-9 rounded-lg bg-gray-800 text-white hover:bg-black hover:cursor-pointer"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
