import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  Col: {},
  Details: {},
};

const detaildSlice = createSlice({
  initialState,
  name: "Col",
  reducers: {
    detailsProduct: (state, action: PayloadAction<any>) => {
      console.log(action.payload);
      state.Col = action.payload;
    },
    loadDetailsProduct: (state, action: PayloadAction<any>) => {
      console.log(action.payload);
      state.Details = action.payload;
    },
  },
});

export const { detailsProduct, loadDetailsProduct } = detaildSlice.actions;

export const Col = (state: any) => state.Load.Col;
export const Details = (state: any) => state.Load.Details;
export const Langue = (state: any) => state.Load.Langue;

export default detaildSlice.reducer;
