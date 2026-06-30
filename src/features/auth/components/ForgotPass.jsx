import { useFormik } from "formik";
import * as Yup from "yup";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../utils/Firebase";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPass() {
  const formik = useFormik({
    initialValues: {
      email: "",
      curruntPass: "",
      password: "",
      confirm: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter correct email")
        .required("Email is required"),

      curruntPass: Yup.string()
        .min(6, "Minimum 6 characters required")
        .required("Password is required"),

      password: Yup.string()
        .min(6, "Minimum 6 characters required")
        .required("Password is required"),

      confirm: Yup.string()
        .oneOf([Yup.ref("password")], "Confirm password does not match")
        .required("Confirm password is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const q = query(
          collection(db, "signUsers"),
          where("email", "==", values.email),
          where("password", "==", values.curruntPass),
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          toast.error("User email not found! && currunt pass not match");
          return;
        }

        const userDoc = querySnapshot.docs[0];

        await updateDoc(doc(db, "signUsers", userDoc.id), {
          password: values.password,
        });

        toast.success("Password updated successfully!");

        resetForm();
      } catch (error) {
        console.error("Password update error:", error);
        toast.error("Failed to update password");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-4 border-2 p-6 rounded-lg w-[90%] sm:w-[80%] md:w-100 "
      >
        <h2 className="text-2xl md:text-3xl text-gray-800 font-semibold text-center">
          Forgot Password
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="border p-2 rounded w-full focus:outline-blue-700"
        />

        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm">{formik.errors.email}</p>
        )}

        <input
          type="password"
          name="curruntPass"
          placeholder="Currunt Password"
          value={formik.values.curruntPass}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="border p-2 rounded w-full focus:outline-blue-700"
        />

        {formik.touched.curruntPass && formik.errors.curruntPass && (
          <p className="text-red-500 text-sm">{formik.errors.curruntPass}</p>
        )}

        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="border p-2 rounded w-full focus:outline-blue-700"
        />

        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-sm">{formik.errors.password}</p>
        )}

        <input
          type="password"
          name="confirm"
          placeholder="Confirm Password"
          value={formik.values.confirm}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="border p-2 rounded w-full focus:outline-blue-700"
        />

        {formik.touched.confirm && formik.errors.confirm && (
          <p className="text-red-500 text-sm">{formik.errors.confirm}</p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition hover:cursor-pointer"
        >
          Reset Password
        </button>
      </form>
      <Toaster />
    </div>
  );
}
