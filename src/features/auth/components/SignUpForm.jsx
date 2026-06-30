import { useFormik } from "formik";

import * as Yup from "yup";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../utils/Firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function SignUpForm() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPass: "",
      role: "user", // default user
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "add minimum 3 character ")
        .max(20, "maximum limit 20 character")
        .required("name is required"),

      email: Yup.string()
        .email("Enter valid email")
        .required("Email is required"),

      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .max(12, "Maximum 12 characters")
        .required("Password is required"),

      confirmPass: Yup.string()
        .oneOf([Yup.ref("password"), null], "don't match password")
        .required("confirm password is required"),
    }),

    onSubmit: async (values) => {
      try {
        // Check email already exists
        const q = query(
          collection(db, "signUsers"),
          where("email", "==", values.email),
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          toast.error("Email already registered!");
          formik.resetForm();
          return;
        }

        // Save user to Firestore
        await addDoc(collection(db, "signUsers"), {
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          status: "active",
          createdAt: serverTimestamp(),
        });

        toast.success("Signup Successfully!");

        formik.resetForm();

        navigate("/loginForm");
      } catch (error) {
        console.error("Signup Error:", error);
        toast.error("Failed to Signup");
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-auto bg-gray-100 py-25">
      <div className="bg-gray-200 p-10 flex flex-col gap-8 items-center justify-center rounded-lg shadow-md">
        <h1 className="text-3xl font-bold">Sign Up Form</h1>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-5 w-64"
        >
          {/* NAME */}
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            placeholder="Enter your name"
            className="border-2 p-2 focus:outline-yellow-300 rounded-lg w-full"
          />
          {formik.errors.name && (
            <p className="text-red-500">{formik.errors.name}</p>
          )}

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder="Enter Email"
            className="border-2 p-2 focus:outline-yellow-300 rounded-lg w-full"
          />
          {formik.errors.email && (
            <p className="text-red-500">{formik.errors.email}</p>
          )}

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder="Enter Password"
            className="border-2 p-2 focus:outline-yellow-300 rounded-lg w-full"
          />
          {formik.errors.password && (
            <p className="text-red-500">{formik.errors.password}</p>
          )}

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            name="confirmPass"
            value={formik.values.confirmPass}
            onChange={formik.handleChange}
            placeholder="Enter confirm password"
            className="border-2 p-2 focus:outline-yellow-300 rounded-lg w-full"
          />
          {formik.errors.confirmPass && (
            <p className="text-red-500">{formik.errors.confirmPass}</p>
          )}

          {/* ROLE RADIO BUTTONS */}
          <div className="flex gap-5 items-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="user"
                checked={formik.values.role === "user"}
                onChange={formik.handleChange}
              />
              User
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formik.values.role === "admin"}
                onChange={formik.handleChange}
              />
              Admin
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="border border-black rounded-lg p-2 font-semibold bg-yellow-300 hover:bg-yellow-400 hover:cursor-pointer"
          >
            SignIn
          </button>
        </form>
      </div>
    </div>
  );
}
