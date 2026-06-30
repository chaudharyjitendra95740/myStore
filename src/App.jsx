// import AdminPage from "./Admin/adminPage/AdminPage";
import { useEffect } from "react";
import "./App.css";
import Home from "./components/Home";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/Firebase";

export default function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User Logged In:", user);
      } else {
        console.log("User Logged Out");
      }
    });

    return () => unsubscribe();
  }, []);

  return <Home />;
}
