import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  productList: [],
  filteredProducts: [], // filtered results

  Col: {},
  Details: {},
};

const productsSlice = createSlice({
  initialState,
  name: "productList",
  reducers: {
    loadAllProducts: (state, action) => {
      console.log(action.payload);
      state.productList = action.payload;
    },
    loadDetailsProduct: (state, action) => {
      console.log(action.payload);
      state.Details = action.payload;
    },
    searchProducts: (state, action) => {
      state.filteredProducts = state.productList.filter((product) =>
        product.name.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
  },
});

export const { loadAllProducts, loadDetailsProduct, searchProducts } =
  productsSlice.actions;

export const productList = (state) => state.Products.productList;
export const Details = (state) => state.Products.Details;

export default productsSlice.reducer;
