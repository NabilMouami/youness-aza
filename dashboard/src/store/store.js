import { configureStore } from "@reduxjs/toolkit";
import DetailsSlice from "../slices/detailsProduct";
import UserInfo from "../slices/userInfo";

export const store = configureStore({
  reducer: {
    Load: DetailsSlice,
    userInfo: UserInfo,
  },
});
