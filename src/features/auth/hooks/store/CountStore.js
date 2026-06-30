import { configureStore } from "@reduxjs/toolkit";
import countSlice from "./CounterSlice";
const store = configureStore({
  reducer: {
    CountStore: countSlice,
    ProductStore: countSlice,
    resetCart: countSlice,
  },
});

export default store;
