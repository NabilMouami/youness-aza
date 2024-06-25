import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Col: {},
  Details: {},
};

const detaildSlice = createSlice({
  initialState,
  name: "Col",
  reducers: {
    detailsProduct: (state, action) => {
      console.log(action.payload);
      state.Col = action.payload;
    },
    loadDetailsProduct: (state, action) => {
      console.log(action.payload);
      state.Details = action.payload;
    },
  },
});

export const { detailsProduct, loadDetailsProduct } = detaildSlice.actions;

export const Col = (state) => state.Load.Col;
export const Details = (state) => state.Load.Details;

export default detaildSlice.reducer;
