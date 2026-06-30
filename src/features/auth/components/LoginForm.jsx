import { useFormik } from "formik";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { LoginContext } from "../hooks/LoginContext";

import {
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../../../utils/Firebase";
import toast, { Toaster } from "react-hot-toast";

export default function LoginForm() {
  const { setIsLogin, setLoginUser } = useContext(LoginContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter valid email")
        .required("Email is required"),

      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .max(12, "Maximum 12 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values) => {
      try {
        // Find User
        const q = query(
          collection(db, "signUsers"),
          where("email", "==", values.email),
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          toast.error("User not found!");
          navigate("/signupForm");
          return;
        }

        const userDoc = snapshot.docs[0];
        const user = userDoc.data();

        // Check Password
        if (user.password !== values.password) {
          toast.error("Invalid Password!");
          return;
        }

        //Check stattus
        if (user.status !== "active") {
          toast.error("Your account has been deactivated by Admin.");
          return;
        }

        // Context
        setIsLogin(true);
        setLoginUser({
          id: userDoc.id,
          ...user,
        });

        const loginUsers = await getDocs(collection(db, "loginUser"));

        for (const item of loginUsers.docs) {
          await deleteDoc(doc(db, "loginUser", item.id));
        }

        await setDoc(doc(db, "loginUser", userDoc.id), {
          userId: userDoc.id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
          loginAt: serverTimestamp(),
        });

        toast.success(`Welcome ${user.name}`);
        formik.resetForm();

        if (user.role === "admin") {
          navigate("/dashbord");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        toast.error("Login Failed!");
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-gray-200 p-10 rounded-lg shadow-md flex flex-col gap-8 items-center">
        <h1 className="text-3xl font-bold">Login Form</h1>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-5 w-64"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            className="border-2 p-2 rounded-lg"
          />

          {formik.errors.email && (
            <p className="text-red-500">{formik.errors.email}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            className="border-2 p-2 rounded-lg"
          />

          {formik.errors.password && (
            <p className="text-red-500">{formik.errors.password}</p>
          )}

          <p className="font-semibold">
            Forgot Password?{" "}
            <Link to="/forgotPass" className="text-blue-600">
              Forgot Now
            </Link>
          </p>

          <button
            type="submit"
            className="bg-yellow-300 rounded-lg p-2 font-semibold hover:cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>

      <Toaster />
    </div>
  );
}
