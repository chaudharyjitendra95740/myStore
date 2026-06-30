import { createContext, useState } from "react";

const AllBuyProductContext = createContext();

export default function AllBuyProductContextProvider({ children }) {
  const [buyAllProduct, setbuyAllProduct] = useState([]);
  const value = { buyAllProduct, setbuyAllProduct };
  return (
    <AllBuyProductContext.Provider value={value}>
      {children}
    </AllBuyProductContext.Provider>
  );
}

