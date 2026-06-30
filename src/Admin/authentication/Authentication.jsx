import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
import { LoginContext } from "../../features/auth/hooks/LoginContext";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../utils/Firebase";
import toast, { Toaster } from "react-hot-toast";

export default function AuthenticationPage() {
  const { loginUser, setLoginUser } = useContext(LoginContext);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),

      newPassword: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("New password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm password is required"),
    }),

    onSubmit: async (values) => {
      try {
        if (!loginUser?.email) {
          toast.error("User not found");
          return;
        }

        const q = query(
          collection(db, "signUsers"),
          where("email", "==", loginUser.email),
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          toast.error("User not found");
          return;
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        if (userData.password !== values.currentPassword) {
          toast.error("Current password is incorrect");
          return;
        }

        await updateDoc(doc(db, "signUsers", userDoc.id), {
          password: values.newPassword,
        });

        setLoginUser({
          ...loginUser,
          password: values.newPassword,
        });

        toast.success("Password updated successfully");

        formik.resetForm();
      } catch (error) {
        console.error(error);
        toast.error("Failed to update password");
      }
    },
  });

  return (
    <>
      <div className="flex items-center justify-center bg-gray-100 px-4 h-[calc(100vh-3rem)] overflow-hidden">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="hidden md:flex flex-col justify-center bg-green-600 text-white p-10">
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>

            <p className="text-lg text-green-100 leading-relaxed">
              Login to manage your products, orders, users and dashboard.
            </p>
          </div>

          <div className="p-8 md:p-12">
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>

                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Enter current password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.currentPassword}
                />

                {formik.touched.currentPassword &&
                  formik.errors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.currentPassword}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.newPassword}
                />

                {formik.touched.newPassword && formik.errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                />

                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition  hover:cursor-pointer duration-500"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
