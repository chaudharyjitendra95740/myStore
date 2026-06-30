  import { createSlice } from "@reduxjs/toolkit";

  const countSlice = createSlice({
    name: "CountSlice",
    initialState: {
      count: 0,
      product: 1,
      reset: "",
    },
    reducers: {
      count: (state) => {
        state.count = 0;
      },
      increment: (state) => {
        state.count += 1;
      },
      decrement: (state) => {
        if (state.count > 0) {
          state.count -= 1;
        }
      },
      addproduct: (state) => {
        state.product += 1;
      },
      removeproduct: (state) => {
        if (state.product > 1) {
          state.product -= 1;
        }
      },
      resetCart: (state) => {
        state.product = "";
      },

      
    },
  });

  export const {
    increment,
    decrement,
    addproduct,
    removeproduct,
    resetCart,
    count,
    resetCount,
  } = countSlice.actions;
  export default countSlice.reducer;
