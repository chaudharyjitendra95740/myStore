// import { useEffect, useState } from "react";
// import {
//   collection,
//   deleteDoc,
//   doc,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "../../utils/Firebase";
// import toast, { Toaster } from "react-hot-toast";

// export default function ViewReport() {
//   const [products, setProducts] = useState([]);
//   const [buyProducts, setBuyProducts] = useState([]);

//   useEffect(() => {
//     async function fetchReportData() {
//       try {
//         // Products Collection
//         const productsSnapshot = await getDocs(collection(db, "products"));

//         const productsData = productsSnapshot.docs.map((doc) => ({
//           docId: doc.id,
//           ...doc.data(),
//         }));

//         setProducts(productsData);

//         // Buy Product Collection
//         const buySnapshot = await getDocs(collection(db, "buyProduct"));

//         const buyData = buySnapshot.docs.map((doc) => ({
//           docId: doc.id,
//           ...doc.data(),
//         }));

//         setBuyProducts(buyData);
//       } catch (error) {
//         console.log("Report Fetch Error:", error);
//       }
//     }
//     fetchReportData();
//   }, []);

//   const totalProducts = products.length;

//   const totalStock = products.reduce(
//     (sum, product) => sum + Number(product.stock || 0),
//     0,
//   );

//   const totalSellQuantity = buyProducts.reduce(
//     (sum, product) => sum + Number(product.quantity || 0),
//     0,
//   );

//   const availableStock = totalStock - totalSellQuantity;
//   const handleRemove = async (product) => {
//     try {
//       // Confirmation
//       const confirmDelete = window.confirm(
//         `Are you sure you want to delete ${product.name}?`,
//       );

//       if (!confirmDelete) return;

//       // Delete from products collection
//       await deleteDoc(doc(db, "products", product.docId));

//       // Find same product in buyProduct collection
//       const q = query(
//         collection(db, "buyProduct"),
//         where("name", "==", product.name),
//       );

//       const snapshot = await getDocs(q);

//       // Delete all matching documents
//       for (const document of snapshot.docs) {
//         await deleteDoc(doc(db, "buyProduct", document.id));
//       }

//       // Update UI
//       setProducts((prev) =>
//         prev.filter((item) => item.docId !== product.docId),
//       );

//       setBuyProducts((prev) =>
//         prev.filter((item) => item.name !== product.name),
//       );

//       toast.success("Product deleted successfully.");
//     } catch (error) {
//       console.log(error);
//       toast.error("Delete failed.");
//     }
//   };

//   return (
//     <>
//       <div className="py-6 px-4 md:px-10 lg:px-20">
//         <h1 className="text-2xl font-bold text-center mb-5">Product Report</h1>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-blue-100 p-4 rounded shadow">
//             <h2 className="font-semibold">Total Products</h2>
//             <p className="text-2xl">{totalProducts}</p>
//           </div>

//           <div className="bg-yellow-100 p-4 rounded shadow">
//             <h2 className="font-semibold">Total Stock</h2>
//             <p className="text-2xl">{totalStock} Kg</p>
//           </div>

//           <div className="bg-green-200 p-4 rounded shadow">
//             <h2 className="font-semibold">Total Sell Quantity</h2>
//             <p className="text-2xl">{totalSellQuantity} Kg</p>
//           </div>

//           <div className="bg-red-100 p-4 rounded shadow">
//             <h2 className="font-semibold">Available Stock</h2>
//             <p className="text-2xl">{availableStock} Kg</p>
//           </div>
//         </div>

//         {/* Product Table */}
//         <div className="overflow-x-auto mb-20 bg-white rounded-t-xl shadow ">
//           <table className="w-full border border-gray-300 ">
//             <caption className="text-lg font-semibold py-4  text-gray-800">
//               Product Details
//             </caption>

//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="border p-2">#</th>
//                 <th className="border p-2">Product Name</th>
//                 <th className="border p-2">Category</th>
//                 <th className="border p-2">Price</th>
//                 <th className="border p-2">Stock</th>
//                 <th className="border p-2">Status</th>
//                 <th className="border p-2">Remove </th>
//               </tr>
//             </thead>

//             <tbody>
//               {products.length > 0 ? (
//                 products.map((product, index) => (
//                   <tr key={product.docId}>
//                     <td className="border p-2 font-semibold">{index + 1}</td>

//                     <td className="border p-2 font-semibold">{product.name}</td>

//                     <td className="border p-2">{product.type}</td>

//                     <td className="border p-2"><i className="fa-solid fa-indian-rupee-sign"></i>{product.price}</td>

//                     <td className="border p-2">
//                       <span
//                         className={
//                           product.stock < 15
//                             ? "text-red-600 font-bold"
//                             : "text-black"
//                         }
//                       >
//                         {product.stock} Kg
//                       </span>
//                     </td>

//                     <td className="border p-2">
//                       {product.stock > 0 ? (
//                         <span className="text-green-700 font-semibold">
//                           Available
//                         </span>
//                       ) : (
//                         <span className="text-red-600 font-semibold">
//                           Out of Stock
//                         </span>
//                       )}
//                     </td>
//                     <td className="border p-2 text-center">
//                       <button
//                         onClick={() => handleRemove(product)}
//                         className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-2xl hover:cursor-pointer"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="border p-4 text-center text-gray-500"
//                   >
//                     No Products Found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       <Toaster />
//     </>
//   );
// }

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../utils/Firebase";
import toast, { Toaster } from "react-hot-toast";

export default function ViewReport() {
  const [products, setProducts] = useState([]);
  const [buyProducts, setBuyProducts] = useState([]);

  // Stock Update States
  const [editId, setEditId] = useState(null);
  const [addStock, setAddStock] = useState("");

  useEffect(() => {
    async function fetchReportData() {
      try {
        // Products
        const productsSnapshot = await getDocs(collection(db, "products"));

        const productsData = productsSnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));

        setProducts(productsData);

        // Buy Products
        const buySnapshot = await getDocs(collection(db, "buyProduct"));

        const buyData = buySnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));

        setBuyProducts(buyData);
      } catch (error) {
        console.log(error);
      }
    }

    fetchReportData();
  }, []);

  // Summary
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) => sum + Number(product.stock || 0),
    0,
  );

  const totalSellQuantity = buyProducts.reduce(
    (sum, product) => sum + Number(product.quantity || 0),
    0,
  );

  const availableStock = totalStock - totalSellQuantity;

  // Delete Product
  const handleRemove = async (product) => {
    try {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete ${product.name}?`,
      );

      if (!confirmDelete) return;

      await deleteDoc(doc(db, "products", product.docId));

      const q = query(
        collection(db, "buyProduct"),
        where("name", "==", product.name),
      );

      const snapshot = await getDocs(q);

      for (const document of snapshot.docs) {
        await deleteDoc(doc(db, "buyProduct", document.id));
      }

      setProducts((prev) =>
        prev.filter((item) => item.docId !== product.docId),
      );

      setBuyProducts((prev) =>
        prev.filter((item) => item.name !== product.name),
      );

      toast.success("Product deleted successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Delete failed.");
    }
  };

  // Add Stock
  const handleAddStock = async (product) => {
    if (!addStock || Number(addStock) <= 0) {
      toast.error("Enter valid stock");
      return;
    }

    try {
      const newStock = Number(product.stock) + Number(addStock);

      await updateDoc(doc(db, "products", product.docId), {
        stock: newStock,
      });

      setProducts((prev) =>
        prev.map((item) =>
          item.docId === product.docId ? { ...item, stock: newStock } : item,
        ),
      );

      toast.success("Stock Updated Successfully");

      setEditId(null);
      setAddStock("");
    } catch (error) {
      console.log(error);
      toast.error("Stock Update Failed");
    }
  };

  return (
    <>
      <div className="py-6 px-4 md:px-10 lg:px-20">
        <h1 className="text-2xl font-bold text-center mb-5">Product Report</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded shadow">
            <h2 className="font-semibold">Total Products</h2>
            <p className="text-2xl">{totalProducts}</p>
          </div>

          <div className="bg-yellow-100 p-4 rounded shadow">
            <h2 className="font-semibold">Total Stock</h2>
            <p className="text-2xl">{totalStock} Kg</p>
          </div>

          <div className="bg-green-200 p-4 rounded shadow">
            <h2 className="font-semibold">Total Sell Quantity</h2>
            <p className="text-2xl">{totalSellQuantity} Kg</p>
          </div>

          <div className="bg-red-100 p-4 rounded shadow">
            <h2 className="font-semibold">Available Stock</h2>
            <p className="text-2xl">{availableStock} Kg</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mb-20 bg-white rounded-t-xl shadow">
          <table className="w-full border border-gray-300">
            <caption className="text-lg font-semibold py-4 text-gray-800">
              Product Details
            </caption>

            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">#</th>
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Stock</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product.docId}>
                    <td className="border p-2">{index + 1}</td>

                    <td className="border p-2 font-semibold">{product.name}</td>

                    <td className="border p-2">{product.type}</td>

                    <td className="border p-2">
                      <i className="fa-solid fa-indian-rupee-sign"></i>
                      {product.price}
                    </td>

                    <td className="border p-2">
                      <span
                        className={
                          product.stock < 15
                            ? "text-red-600 font-bold"
                            : "text-black"
                        }
                      >
                        {product.stock} Kg
                      </span>
                    </td>

                    <td className="border p-2">
                      {product.stock > 0 ? (
                        <span className="text-green-600 font-semibold">
                          Available
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Out of Stock
                        </span>
                      )}
                    </td>

                    <td className="border p-2">
                      {editId === product.docId ? (
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            value={addStock}
                            onChange={(e) => setAddStock(e.target.value)}
                            placeholder="Stock"
                            className="border rounded px-2 py-1 w-20"
                          />

                          <button
                            onClick={() => handleAddStock(product)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>

                          <button
                            onClick={() => {
                              setEditId(null);
                              setAddStock("");
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setEditId(product.docId)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded hover:cursor-pointer"
                          >
                            Add Stock
                          </button>

                          <button
                            onClick={() => handleRemove(product)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded hover:cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="border p-4 text-center text-gray-500"
                  >
                    No Products Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Toaster />
    </>
  );
}
