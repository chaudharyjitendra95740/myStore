import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { count } from "../hooks/store/CounterSlice";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../../utils/Firebase";

const Invoice = () => {
  const [allCartItems, setAllCartItems] = useState([]);
  useEffect(() => {
    async function fetchCartItems() {
      try {
        const snapshot = await getDocs(collection(db, "AddCart"));

        const items = snapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));

        setAllCartItems(items);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCartItems();
  }, []);

  const inputRef = useRef(null);
  const cupenCode = "FRESH25";
  const [discount, setDiscount] = useState(0);
  const dispatch = useDispatch();

  // Calculate subtotal efficiently in one place

  const subTotalInvoice = allCartItems.reduce((sum, item) => {
    return sum + item.price * (item.quantity || 1);
  }, 0);

  const Tax = (subTotalInvoice * 8) / 100;

  function UseCode() {
    const userValue = inputRef.current.value;
    if (userValue === cupenCode) {
      const updateDiscount = subTotalInvoice * 0.1;
      setDiscount(updateDiscount);
    } else {
      setDiscount(0);
    }
    inputRef.current.value = "";
  }

  const paybleTotal = Number(subTotalInvoice + Tax - discount).toFixed(2);

  async function saveOrder() {
    if (allCartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    try {
      for (const product of allCartItems) {
        await addDoc(collection(db, "buyProduct"), {
          id: product.id,
          name: product.name,
          type: product.type || "General",
          quantity: product.quantity || 1,
          price: product.price,
          tax: Number((product.price * (product.quantity || 1) * 8) / 100),
          totalAmount:
            product.price * (product.quantity || 1) +
            (product.price * (product.quantity || 1) * 8) / 100,
          image: product.image,
          description: product.description || "",
          stock: product.stock || 0,
          date: new Date().toLocaleString(),
        });

        // Delete from AddCart
        await deleteDoc(doc(db, "AddCart", product.docId));
      }

      setAllCartItems([]);

      dispatch(count());

      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Order Error:", error);
      toast.error("Failed to place order");
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-10 pb-20">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-3xl font-bold text-black mb-6">Order Summary</h2>

          <div className="border-t border-gray-200 pt-6 space-y-5">
            <div className="flex justify-between text-gray-600 text-xl">
              <span>Subtotal</span>
              <span>
                <i className="fa-solid fa-indian-rupee-sign"></i>
                {subTotalInvoice}
              </span>
            </div>

            <div className="flex justify-between text-gray-600 text-xl">
              <span>Tax (8%)</span>
              <span>
                <i className="fa-solid fa-indian-rupee-sign"></i>
                {Tax.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-gray-600 text-xl">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>

          <div className="border-t border-gray-200 my-8 pt-6">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Use Promo code"
                className="flex-1 border border-gray-300 rounded-md px-4 py-3 focus:outline-black"
                ref={inputRef}
              />
              <button
                className="font-semibold text-black px-4 cursor-pointer border rounded-md hover:bg-gray-400 duration-700"
                onClick={UseCode}
              >
                Apply
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-3xl font-bold">Total</span>
              <span className="text-4xl font-bold">
                <i className="fa-solid fa-indian-rupee-sign"></i>
                {paybleTotal}
              </span>
            </div>

            <Link
              to={"/orderDetails"}
              className="w-full bg-black text-white py-4 rounded-lg text-lg font-semibold hover:bg-gray-900 transition flex items-center justify-center gap-2 cursor-pointer"
              onClick={saveOrder}
            >
              Proceed to Checkout
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
            <Link
              to={"/buyProduct"}
              className="w-full bg-black text-white py-4 rounded-lg text-lg font-semibold hover:bg-gray-900 transition flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              <i className="fa-solid fa-arrow-left"></i> Go Back
            </Link>

            <div className="flex items-center justify-center gap-2 mt-5 text-emerald-500 font-medium">
              <span>
                <i
                  className="fa-solid fa-shield"
                  style={{ color: "rgb(100,120,255)" }}
                ></i>
              </span>
              <span>Secure Checkout Guaranteed</span>
            </div>
          </div>
        </div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  );
};

export default Invoice;
