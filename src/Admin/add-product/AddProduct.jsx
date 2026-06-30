import { useContext, useState } from "react";
import { LoginContext } from "../../features/auth/hooks/LoginContext";
import LoginForm from "../../features/auth/components/LoginForm";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../utils/Firebase";
import toast, { Toaster } from "react-hot-toast";

export default function AddProduct() {
  const { isLogin } = useContext(LoginContext);
  const [product, setProduct] = useState({
    name: "",
    type: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  const allowedTypes = ["Fruit", "Tea", "Ghee", "Vegetable"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];

  //   if (!file) return;

  //   const reader = new FileReader();

  //   reader.onloadend = () => {
  //     setProduct((prev) => ({
  //       ...prev,
  //       image: reader.result, // Base64 image save
  //     }));
  //   };

  //   reader.readAsDataURL(file);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !product.name.trim() ||
      !product.type ||
      !product.price ||
      !product.stock
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!allowedTypes.includes(product.type)) {
      toast.error("Only Fruit, Tea, Ghee and Vegetable products are allowed.");
      return;
    }

    try {
      const newProduct = {
        name: product.name,
        type: product.type,
        price: Number(product.price),
        stock: Number(product.stock),
        image: product.image,
        description: product.description,
        createdAt: new Date().toLocaleDateString(),
      };

      // 🔥 SAVE TO FIRESTORE
      await addDoc(collection(db, "products"), newProduct);

      toast.success("Product Added Successfully!");

      setProduct({
        name: "",
        type: "",
        price: "",
        stock: "",
        image: "",
        description: "",
      });

      const fileInput = document.getElementById("productImage");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

  return (
    <>
      {isLogin ? (
        <div className="min-h-screen bg-slate-100 flex justify-center items-center p-5">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Add Product</h1>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
              {/* Product Name */}
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={product.name}
                onChange={handleChange}
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              {/* Product Type */}
              <select
                name="type"
                value={product.type}
                onChange={handleChange}
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Type</option>
                <option value="Fruit">Fruit</option>
                <option value="Tea">Tea</option>
                <option value="Ghee">Ghee</option>
                <option value="Vegetable">Vegetable</option>
                {/* <option value="homePageProduct">homePageProduct</option> */}
              </select>

              {/* Price */}
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={product.price}
                onChange={handleChange}
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              {/* Stock */}
              <input
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                value={product.stock}
                onChange={handleChange}
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              {/* Image URL */}
              <input
                type="text"
                name="image"
                placeholder="Image URL (Optional)"
                value={product.image.startsWith("data:") ? "" : product.image}
                onChange={handleChange}
                className="border p-3 rounded-lg md:col-span-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              {/* Image Upload */}
              {/* <input
            id="productImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-3 rounded-lg md:col-span-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          /> */}

              {/* Preview */}
              {product.image && (
                <div className="md:col-span-2 flex justify-center">
                  <img
                    src={product.image}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg border shadow"
                  />
                </div>
              )}

              {/* Description */}
              <textarea
                name="description"
                placeholder="Product Description"
                rows="4"
                value={product.description}
                onChange={handleChange}
                className="border p-3 rounded-lg md:col-span-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              {/* Submit */}
              <button
                type="submit"
                className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition hover:cursor-pointer duration-500"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      ) : (
        <LoginForm />
      )}
      <Toaster />
    </>
  );
}
