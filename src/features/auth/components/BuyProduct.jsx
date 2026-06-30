import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addproduct,
  decrement,
  removeproduct,
} from "../hooks/store/CounterSlice";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
// import { LoginContext } from "../hooks/LoginContext";

import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../utils/Firebase";
export default function BuyProduct() {
  const [cartItems, setCartItems] = useState([]);
  const dispatch = useDispatch();
  // const { isLogin } = useContext(LoginContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "AddCart"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      setCartItems(items);
    });

    return () => unsubscribe();
  }, []);

  async function deleteItem(docId) {
    try {
      await deleteDoc(doc(db, "AddCart", docId));

      dispatch(decrement());

      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error(error);
    }
  }

  async function addItemQuantity(item) {
    try {
      if (item.stock <= 0) return;

      // Update AddCart
      await updateDoc(doc(db, "AddCart", item.docId), {
        quantity: (item.quantity || 1) + 1,
        stock: item.stock - 1,
      });

      // Update Products
      await updateDoc(doc(db, "products", item.id), {
        stock: item.stock - 1,
      });

      dispatch(addproduct());
    } catch (error) {
      console.error(error);
    }
  }
  async function removeItemQuantity(item) {
    try {
      if ((item.quantity || 1) <= 1) return;

      // Update AddCart
      await updateDoc(doc(db, "AddCart", item.docId), {
        quantity: item.quantity - 1,
        stock: item.stock + 1,
      });

      // Update Products
      await updateDoc(doc(db, "products", item.id), {
        stock: item.stock + 1,
      });

      dispatch(removeproduct());
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="px-4 md:px-8 lg:px-12 py-8 bg-slate-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          <i className="fa-solid fa-basket-shopping mr-2 text-green-600"></i>
          Shopping Cart
        </h1>

        <div className="space-y-3">
          {cartItems.map((item) => (
            <div
              key={item.docId}
              className="grid grid-cols-6 items-center bg-white rounded-xl shadow-sm px-5 py-4"
            >
              {/* Product */}
              <div className="flex items-center gap-4 col-span-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                />

                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>

                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>

              <div>
                <p
                  className={`font-semibold ${
                    item.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.stock > 0 ? "Stock In" : "Stock Out"}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex justify-center">
                <div className="flex items-center border rounded-full overflow-hidden ">
                  <button
                    onClick={() => removeItemQuantity(item)}
                    className="w-8 h-8 hover:bg-gray-100 hover:cursor-pointer"
                  >
                    -
                  </button>

                  <span className="px-4 font-medium">{item.quantity || 1}</span>

                  <button
                    onClick={() => addItemQuantity(item)}
                    className="w-8 h-8 hover:bg-gray-100 hover:cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="text-center font-semibold text-lg">
                <i className="fa-solid fa-indian-rupee-sign"></i>
                {item.price * (item.quantity || 1)}
              </div>

              {/* Delete */}
              <div className="flex justify-center">
                <button
                  onClick={() => deleteItem(item.docId)}
                  className="text-red-500 hover:text-red-700 hover:cursor-pointer"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-4 mt-10 flex items-end flex-col gap-2 ">
          <Link
            to="/invoice"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg duration-300"
          >
            Get Invoice
            <i className="fa-solid fa-arrow-right ml-2"></i>
          </Link>
          <Link
            to="/viewAllProducts"
            className="bg-gray-900 hover:bg-gray-950 text-white font-semibold px-5.5 py-3 rounded-xl shadow-lg duration-300"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back Products
          </Link>
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
