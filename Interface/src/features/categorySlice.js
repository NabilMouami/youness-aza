import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryList: [],
};
const categorySlice = createSlice({
  initialState,
  name: "categoryList",
  reducers: {
    loadAllCategories: (state, action) => {
      state.categoryList = action.payload;
    },
  },
});

export const { loadAllCategories } = categorySlice.actions;

export const categoryList = (state) => state.Categories.categoryList;

export default categorySlice.reducer;
