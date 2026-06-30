// import { useContext, useEffect, useState } from "react";
// import { LoginContext } from "../../features/auth/hooks/LoginContext";
// import LoginForm from "../../features/auth/components/LoginForm";

// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../utils/Firebase";
// export default function Users() {
//   const { isLogin } = useContext(LoginContext);

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchUsers() {
//       try {
//         const snapshot = await getDocs(collection(db, "signUsers"));

//         const users = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         setData(users);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchUsers();
//   }, []);

//   const totalUser = data.length;

//   return (
//     <>
//       {isLogin ? (
//         <div className="py-6 px-4 md:px-10 lg:px-20">
//           <h1 className="text-2xl font-bold text-center mb-6">User Report</h1>

//           {/* Summary Card */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <div className="bg-green-200 p-4 rounded shadow">
//               <h2 className="font-semibold">Total Users</h2>
//               <p className="text-2xl font-bold">{totalUser}</p>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto mb-20">
//             <table className="w-full border border-gray-300">
//               <caption className="text-lg text-gray-800 font-semibold mb-3">
//                 User Details
//               </caption>

//               <thead className="bg-gray-200">
//                 <tr>
//                   <th className="border p-2">#</th>
//                   <th className="border p-2">Name</th>
//                   <th className="border p-2">Email</th>
//                   <th className="border p-2">Password</th>
//                   <th className="border p-2">Role</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td
//                       colSpan="5"
//                       className="border p-4 text-center text-blue-500"
//                     >
//                       Loading...
//                     </td>
//                   </tr>
//                 ) : data.length > 0 ? (
//                   data.map((user, index) => (
//                     <tr key={user.id}>
//                       <td className="border p-2 font-semibold">{index + 1}</td>

//                       <td className="border p-2 font-semibold">{user.name}</td>

//                       <td className="border p-2 font-semibold">{user.email}</td>

//                       <td className="border p-2 font-semibold">
//                         {user.password}
//                       </td>

//                       <td className="border p-2 font-semibold">
//                         <span
//                           className={`px-2 py-1 rounded  ${
//                             user.role === "admin"
//                               ? "text-red-500"
//                               : "text-green-500"
//                           }`}
//                         >
//                           {user.role}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="5"
//                       className="border p-4 text-center text-gray-500"
//                     >
//                       No Users Found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <LoginForm />
//       )}
//     </>
//   );
// }

import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../features/auth/hooks/LoginContext";
import LoginForm from "../../features/auth/components/LoginForm";

import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../utils/Firebase";

export default function Users() {
  const { isLogin } = useContext(LoginContext);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const snapshot = await getDocs(collection(db, "signUsers"));

        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(users);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Active / Deactive
  const handleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "deactive" : "active";

      await updateDoc(doc(db, "signUsers", id), {
        status: newStatus,
      });

      setData((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const totalUser = data.length;

  return (
    <>
      {isLogin ? (
        <div className="py-6 px-4 md:px-10 lg:px-20">
          <h1 className="text-2xl font-bold text-center mb-6">User Report</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-200 p-4 rounded shadow">
              <h2 className="font-semibold">Total Users</h2>
              <p className="text-2xl font-bold">{totalUser}</p>
            </div>
          </div>

          <div className="overflow-x-auto mb-20">
            <table className="w-full border border-gray-300">
              <caption className="text-lg text-gray-800 font-semibold mb-3">
                User Details
              </caption>

              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">#</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Password</th>
                  <th className="border p-2">Role</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="border p-4 text-center text-blue-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((user, index) => (
                    <tr key={user.id}>
                      <td className="border p-2 font-semibold">{index + 1}</td>

                      <td className="border p-2">{user.name}</td>

                      <td className="border p-2">{user.email}</td>

                      <td className="border p-2">{user.password}</td>

                      <td className="border p-2">
                        <span
                          className={
                            user.role === "admin"
                              ? "text-blue-600 font-bold"
                              : "text-green-600 font-bold"
                          }
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="border p-2">
                        <span
                          className={
                            (user.status || "active") === "active"
                              ? "text-green-600 font-bold"
                              : "text-red-600 font-bold"
                          }
                        >
                          {user.status || "active"}
                        </span>
                      </td>

                      <td className="border p-2">
                        <button
                          onClick={() =>
                            handleStatus(user.id, user.status || "active")
                          }
                          className={`px-4 py-1 rounded text-white ${
                            (user.status || "active") === "active"
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {(user.status || "active") === "active"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="border p-4 text-center text-gray-500"
                    >
                      No Users Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <LoginForm />
      )}
    </>
  );
}
