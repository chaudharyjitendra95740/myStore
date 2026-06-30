import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginForm from "./features/auth/components/LoginForm.jsx";
import SignUpForm from "./features/auth/components/SignUpForm.jsx";
import LoginContextProvider from "./features/auth/hooks/LoginContext.jsx";
import HomePage from "./features/auth/Home/HomePage.jsx";
import { Provider } from "react-redux";
import store from "./features/auth/hooks/store/CountStore.js";
import BuyProduct from "./features/auth/components/BuyProduct.jsx";
import AllBuyProductContextProvider from "./features/auth/hooks/AllBuyProductContext.jsx";
import Profile from "./features/profile/Profile.jsx";
import Fruits from "./features/auth/products/Fruits.jsx";
import Tea from "./features/auth/products/Tea.jsx";
import Ghee from "./features/auth/products/Ghee.jsx";
import ViewAllProducts from "./features/auth/products/ViewAllProducts.jsx";
import AdminRoute from "./Admin/adminRoute/AdminRoute.jsx";
import AdminPage from "./Admin/adminPage/AdminPage";
import Dashboard from "./Admin/dashbord/Dashbord.jsx";
import App from "./App.jsx";
import Authentication from "./Admin/authentication/Authentication.jsx";
// import Users from "./Admin/user/Users.jsx";
import AddProduct from "./Admin/add-product/AddProduct.jsx";
import MessagePage from "./Admin/message/Message.jsx";
import SettingsPage from "./Admin/setting/Setting.jsx";
import OrdersPage from "./Admin/oders/OdersPage.jsx";
import Vegetables from "./features/auth/products/Vegetables.jsx";
import AddUser from "./Admin/add-user/AddUser.jsx";
import ForgotPass from "./features/auth/components/ForgotPass.jsx";
import ViewReport from "./Admin/view-reports/ViewReport.jsx";
import Users from "./Admin/user/Users.jsx";
import Invoice from "./features/auth/components/Invoice.jsx";
import OrderDetails from "./features/auth/components/OrderDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      { path: "/loginForm", element: <LoginForm /> },
      { path: "/signupForm", element: <SignUpForm /> },
      { path: "/buyProduct", element: <BuyProduct /> },
      { path: "/forgotPass", element: <ForgotPass /> },
      { index: "/", element: <HomePage /> },
      { path: "/userProfile", element: <Profile /> },
      { path: "/fruits", element: <Fruits /> },
      { path: "/tea", element: <Tea /> },
      { path: "/ghee", element: <Ghee /> },
      { path: "/vegetables", element: <Vegetables /> },
      { path: "/viewAllProducts", element: <ViewAllProducts /> },
      { path: "/dashbord", element: <Dashboard /> },
      { path: "/settingsPage", element: <SettingsPage /> },
      { path: "/authentication", element: <Authentication /> },
      { path: "/users", element: <Users /> },
      { path: "/addProduct", element: <AddProduct /> },
      { path: "/messagePage", element: <MessagePage /> },
      { path: "/odersPage", element: <OrdersPage /> },
      { path: "/addUser", element: <AddUser /> },
      { path: "/viewReport", element: <ViewReport /> },
      { path: "/invoice", element: <Invoice /> },
      { path: "/orderDetails", element: <OrderDetails /> },
      {
        path: "/dashbord",
        element: (
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <AllBuyProductContextProvider>
    <LoginContextProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </LoginContextProvider>
  </AllBuyProductContextProvider>,
);

// import { createRoot } from "react-dom/client";
// import "./index.css";

// import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import { Provider } from "react-redux";
// import store from "./features/auth/hooks/store/CountStore";

// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import App from "./App";

// import LoginContextProvider from "./features/auth/hooks/LoginContext";
// import AllBuyProductContextProvider from "./features/auth/hooks/AllBuyProductContext";

// // Pages
// import LoginForm from "./features/auth/components/LoginForm";
// import SignUpForm from "./features/auth/components/SignUpForm";
// import ForgotPass from "./features/auth/components/ForgotPass";

// import HomePage from "./features/auth/Home/HomePage";
// import BuyProduct from "./features/auth/components/BuyProduct";
// import Invoice from "./features/auth/components/Invoice";

// import Profile from "./features/profile/Profile";

// import Fruits from "./features/auth/products/Fruits";
// import Tea from "./features/auth/products/Tea";
// import Ghee from "./features/auth/products/Ghee";
// import Vegetables from "./features/auth/products/Vegetables";
// import ViewAllProducts from "./features/auth/products/ViewAllProducts";

// // Admin
// import Dashboard from "./Admin/dashbord/Dashbord";
// import Authentication from "./Admin/authentication/Authentication";
// import Users from "./Admin/user/Users";
// import AddProduct from "./Admin/add-product/AddProduct";
// import MessagePage from "./Admin/message/Message";
// import SettingsPage from "./Admin/setting/Setting";
// import OrdersPage from "./Admin/oders/OdersPage";
// import AddUser from "./Admin/add-user/AddUser";
// import ViewReport from "./Admin/view-reports/ViewReport";

// import AdminRoute from "./Admin/adminRoute/AdminRoute";
// import OrderDetails from "./features/auth/components/OrderDetails";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       // public
//       { index: true, element: <HomePage /> },
//       { path: "loginForm", element: <LoginForm /> },
//       { path: "signupForm", element: <SignUpForm /> },
//       { path: "forgotPass", element: <ForgotPass /> },

//       // user flow
//       { path: "buyProduct", element: <BuyProduct /> },
//       { path: "orderDetails", element: <OrderDetails /> },
//       { path: "invoice", element: <Invoice /> },
//       { path: "userProfile", element: <Profile /> },

//       // products
//       { path: "fruits", element: <Fruits /> },
//       { path: "tea", element: <Tea /> },
//       { path: "ghee", element: <Ghee /> },
//       { path: "vegetables", element: <Vegetables /> },
//       { path: "viewAllProducts", element: <ViewAllProducts /> },

//       // admin protected
//       {
//         path: "dashbord",
//         element: (
//           <AdminRoute>
//             <Dashboard />
//           </AdminRoute>
//         ),
//       },
//       {
//         path: "authentication",
//         element: (
//           <AdminRoute>
//             <Authentication />
//           </AdminRoute>
//         ),
//       },
//       {
//         path: "users",
//         element: (
//           <AdminRoute>
//             <Users />
//           </AdminRoute>
//         ),
//       },
//       {
//         path: "addProduct",
//         element: (
//           <AdminRoute>
//             <AddProduct />
//           </AdminRoute>
//         ),
//       },
//       {
//         path: "messagePage",
//         element: (
//           <AdminRoute>
//             <MessagePage />
//           </AdminRoute>
//         ),
//       },
//       {
//         path: "odersPage",
//         element: (
//           <AdminRoute>
//             <OrdersPage />
//           </AdminRoute>
//         ),
//       },
//       {
//         path: "settingsPage",
//         element: (
//           <AdminRoute>
//             <SettingsPage />
//           </AdminRoute>
//         ),
//       },
//       {
//         path: "addUser",
//         element: (
//           <AdminRoute>
//             <AddUser />
//           </AdminRoute>
//         ),
//       },
//       {
//         path: "viewReport",
//         element: (
//           <AdminRoute>
//             <ViewReport />
//           </AdminRoute>
//         ),
//       },
//     ],
//   },
// ]);

// createRoot(document.getElementById("root")).render(
//   <Provider store={store}>
//     <LoginContextProvider>
//       <AllBuyProductContextProvider>
//         <RouterProvider router={router} />
//         <ToastContainer />
//       </AllBuyProductContextProvider>
//     </LoginContextProvider>
//   </Provider>,
// );
