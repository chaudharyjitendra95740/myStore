import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../hooks/LoginContext";
import { useDispatch } from "react-redux";
import { increment } from "../hooks/store/CounterSlice";
import toast, { Toaster } from "react-hot-toast";

import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../../utils/Firebase";

export default function ViewAllProducts() {
  const { isLogin } = useContext(LoginContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);

  const offerOff = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  async function handleClick(product) {
    if (!isLogin) {
      navigate("/loginForm");
      return;
    }

    try {
      // Save product in Firestore
      await setDoc(doc(db, "AddCart", product.id), {
        ...product,
        quantity: 1,
      });

      dispatch(increment());

      toast.success("Product Added To Cart");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-10 pb-20">
      <section className="px-14">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Featured Products
        </h2>

        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-45 w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white">
                  New
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between flex-wrap overflow-hidden">
                  <h3 className="mb-2 truncate text-sm font-bold text-gray-800">
                    {product.name}
                  </h3>

                  <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white animate-pulse">
                    Offer {offerOff}% off
                  </span>
                </div>

                <p className="mb-3 line-clamp-2 text-xs text-gray-500">
                  {product.description}
                </p>

                <div className="mb-4 flex items-center justify-between flex-wrap">
                  <span className="text-sm font-bold text-green-600">
                    <i className="fa-solid fa-indian-rupee-sign"></i>
                    {product.price}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      product.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <button
                  onClick={() => handleClick(product)}
                  disabled={product.stock <= 0}
                  className={`w-full rounded-xl py-1.5 font-semibold text-white transition-all duration-300  ${
                    product.stock > 0
                      ? "bg-linear-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 hover:cursor-pointer"
                      : "cursor-not-allowed bg-gray-400"
                  }`}
                >
                  {product.stock > 0 ? "Add To Cart" : "Out Of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Toaster position="top-center" />
    </div>
  );
}
