import { configureStore } from "@reduxjs/toolkit";
import DetailsSlice from "../slices/detailsProduct";
import UserInfo from "../slices/userInfo";
import DetailsOrder from "../slices/order";

export const store = configureStore({
  reducer: {
    Load: DetailsSlice,
    userInfo: UserInfo,
    Order: DetailsOrder,
  },
});
