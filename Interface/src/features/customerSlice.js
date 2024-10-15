import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerInfo: {},
};

const customerSlice = createSlice({
  initialState,
  name: "customerInfo",
  reducers: {
    loadCustomer: (state, action) => {
      console.log(action.payload);
      state.customerInfo = action.payload;
    },
    logout: (state) => {
      state.customerInfo = {};
    },
  },
});

export const { loadCustomer, logout } = customerSlice.actions;

export const customerInfo = (state) => state.customerInfo;

export default customerSlice.reducer;
