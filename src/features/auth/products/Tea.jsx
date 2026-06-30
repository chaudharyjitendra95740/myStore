import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { increment } from "../hooks/store/CounterSlice";
import { LoginContext } from "../hooks/LoginContext";
import toast, { Toaster } from "react-hot-toast";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../../utils/Firebase";

export default function Tea() {
  const [teaList, setTeaList] = useState([]);

  const dispatch = useDispatch();
  const { isLogin } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));

        const teas = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((item) => item.type.toLowerCase() === "tea");

        setTeaList(teas);
      } catch (error) {
        console.error("Error fetching fruits:", error);
      }
    };
    fetchTeas();
  }, []);

  async function handleClick(item) {
    if (!isLogin) {
      navigate("/loginForm");
      return;
    }

    try {
      // Reference to AddCart collection
      const addCartRef = collection(db, "AddCart");

      // Check duplicate product
      const q = query(addCartRef, where("id", "==", item.id));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("Product already added to cart");
        return;
      }

      const cartItem = {
        id: item.id,
        name: item.name,
        type: item.type,
        price: item.price,
        stock: item.stock,
        image: item.image,
        description: item.description,
        quantity: 1,
        // total: Number(item.price),
        createdAt: serverTimestamp(),
      };

      // Save to Firestore
      await addDoc(addCartRef, cartItem);

      dispatch(increment());

      toast.success("Product Added To Cart");
    } catch (error) {
      console.error("Error saving cart item:", error);
      toast.error("Failed to save cart item");
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 pt-10 pb-20 px-4 md:px-8">
        <div className="px-10 mx-auto">
          <h1 className="text-4xl font-bold text-green-600 mb-10">
            Indian Tea
          </h1>

          {teaList.length === 0 ? (
            <div className="text-center text-gray-500 text-xl">
              No Tea Products Available
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {teaList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden  transition-all duration-300 max-w-65 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="h-45 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-md text-gray-800">
                        {item.name}
                      </h3>

                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        {item.type}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500  min-h-10">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-md font-bold text-green-600">
                        <i className="fa-solid fa-indian-rupee-sign"></i>
                        {item.price}
                      </span>
                      {item.stock > 0 ? (
                        <span className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          Stock in
                        </span> 
                      ) : (
                        <span className="text-sm bg-red-200 text-red-600 px-2 py-1 rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleClick(item)}
                      className={`w-full text-white py-1.5 rounded-xl font-semibold transition hover:cursor-pointer ${
                        item.stock > 0
                          ? "bg-linear-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                          : "cursor-not-allowed bg-gray-400"
                      }`}
                      disabled={item.stock <= 0} // Blocks clicks when out of stock
                    >
                      {item.stock > 0 ? "Add To Cart" : "Out Of Stock"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  );
}
