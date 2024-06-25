// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import DetailsSlice from "./slices/detailsProduct";
import CartSlice from "./slices/CartSlice";

export const store = configureStore({
  reducer: {
    Load: DetailsSlice,
    cart: CartSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
