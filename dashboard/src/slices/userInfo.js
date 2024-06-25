import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  User: {},
};

const detaildSlice = createSlice({
  initialState,
  name: "User",
  reducers: {
    detailsUser: (state, action) => {
      console.log(action.payload);
      state.User = action.payload;
    },
  },
});

export const { detailsUser } = detaildSlice.actions;

export const User = (state) => state.userInfo.User;

export default detaildSlice.reducer;
