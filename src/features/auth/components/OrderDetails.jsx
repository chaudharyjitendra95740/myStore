import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../utils/Firebase";

export default function OrderDetails() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "buyProduct"));

        const data = snapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));

        setOrders(data);
      } catch (err) {
        console.log("Orders detail not fetch:", err);
      }
    };

    fetchOrders();
  }, []);
  return (
    <>
      <div className=" w-full bg-amber-50 p-10 pb-20 ">
        <div className="border-2 border-blue-600 w-full  h-auto m-auto flex flex-col justify-center items-center rounded-2xl overflow-hidden">
          <div className="bg-blue-600 p-3 w-full text-center">
            <h2 className="font-semibold text-white">ORDER DETAILS</h2>
          </div>
          <div className="w-full py-5 px-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {orders.map((item) => {
              return (
                <>
                  <div
                    key={item.docId}
                    className="my-3 border-2 border-gray-200 rounded-2xl p-4 w-full bg-white shadow-sm hover:shadow-lg duration-300"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-5">
                      {/* Left Side */}
                      <div className="flex items-center gap-4 w-full md:w-2/3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 rounded-2xl object-cover border"
                        />

                        <div className="flex flex-col md:flex-row justify-between w-full gap-4">
                          {/* Product Info */}
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">
                              {item.name}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              Item: {item.quantity}
                            </p>
                            <p className="text-gray-600 text-sm max-w-xs">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="flex flex-col items-center md:items-end gap-2 min-w-45">
                        <p className="text-sm text-gray-500">{item.date}</p>

                        <strong className="text-lg">
                          Price :
                          <span className="text-green-600 ml-2">
                            <i className="fa-solid fa-indian-rupee-sign"></i>
                            {item.totalAmount ||
                              item.price * (item.quantity || 1)}
                          </span>
                        </strong>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
          <div className="mb-5 flex ">
            <Link
              to={"/"}
              className="min-w-full bg-blue-500 text-white font-semibold hover:cursor-pointer hover:bg-blue-600 px-10 py-1 rounded-lg duration-500"
            >
              close
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
