import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../hooks/LoginContext";
import { useDispatch } from "react-redux";
import { increment } from "../hooks/store/CounterSlice";
import {
  fruit9,
  greenVagitable,
  heroImg,
  tea5,
  vagitable1,
} from "../../../../public/image";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../utils/Firebase";
import toast from "react-hot-toast";

export default function HomePage() {
  const { isLogin } = useContext(LoginContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = [
    {
      id: 1,
      name: "Fresh Apples",
      price: 120,
      image: fruit9,
      stock: 100,
    },
    {
      id: 2,
      name: "Organic Tomato",
      price: 60,
      image: vagitable1,
      stock: 100,
    },
    {
      id: 3,
      name: "Tea",
      price: 35,
      image: tea5,
      stock: 100,
    },
    {
      id: 4,
      name: "Green Vegetables",
      price: 90,
      image: greenVagitable,
      stock: 100,
    },
  ];

  async function handleClick(product) {
    if (isLogin === false) {
      navigate("/loginForm");
      return;
    }

    try {
      const cartRef = collection(db, "AddCart");

      // check if already exists
      const q = query(cartRef, where("id", "==", product.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error("Product already added to cart");
        return;
      }

      await addDoc(cartRef, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        quantity: 1,
        createdAt: new Date(),
      });

      toast.success("Added to cart");

      dispatch(increment());
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* ================= HERO SECTION ====================== */}
      <section className="grid items-center gap-10 px-10 py-16 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-5xl font-bold leading-tight text-gray-800">
            Fresh Groceries Delivered To Your Door
          </h2>

          <p className="mb-8 text-lg text-gray-600">
            Buy fresh fruits, vegetables, dairy products, and daily essentials
            at the best prices.
          </p>

          <Link
            to={"/viewAllProducts"}
            className="rounded-2xl bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-green-700 hover:cursor-pointer"
          >
            Shop Now
          </Link>
        </div>

        <div>
          <img
            src={heroImg}
            alt="Groceries"
            className="rounded-3xl shadow-2xl"
          />
        </div>
      </section>

      {/* ======================== CATEGORY ====================== */}
      <section className="px-10 py-10">
        <h2 className="mb-8 text-3xl font-bold text-gray-800">
          Shop By Category
        </h2>

        <div className="grid gap-6 md:grid-cols-4">
          {["Fruits", "Tea", "Ghee", "Vegetables"].map((item, index) => (
            <div
              key={index}
              className="rounded-3xl bg-white p-8 text-center shadow-md transition hover:-translate-y-2 duration-700 hover:shadow-xl"
            >
              <h3 className="text-2xl font-semibold text-green-700">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ================ FEATURED PRODUCTS ========================== */}
      <section className="px-10 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">
            Featured Products
          </h2>

          <Link
            to={"/viewAllProducts"}
            className="font-semibold text-green-600 hover:underline hover:text-green-800 duration-500  "
          >
            View All
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-3xl bg-white shadow-md transition  hover:shadow-2xl"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-60 w-full object-cover hover:scale-105 transition duration-500"
              />

              <div className="p-5">
                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between">
                  <p className="mb-4 text-md ">
                    Quntity: {product.quntity || 1}
                  </p>

                  <p className="mb-4 text-lg font-bold text-green-600">
                    <i className="fa-solid fa-indian-rupee-sign"></i>
                    {product.price}
                  </p>
                </div>

                <button
                  className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 hover:cursor-pointer"
                  onClick={() => handleClick(product)}
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ OFFER BANER ================= */}
      <section className="mx-10 mt-14 rounded-3xl bg-green-600 px-10 py-16 text-center text-white shadow-xl">
        <h2 className="mb-4 text-4xl font-bold">
          Get 10% Off By Use Promo Code
        </h2>

        <p className="mb-8 text-lg text-green-100">Use Promo Code: FRESH25</p>

        <Link
          to={"/viewAllProducts"}
          className="rounded-2xl bg-yellow-400 px-8 py-4 text-lg font-bold text-black transition hover:bg-yellow-300"
        >
          Order Now
        </Link>
      </section>
    </div>
  );
}
