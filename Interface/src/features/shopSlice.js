import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  cart: [],
};

export const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    addCart: (state, { payload }) => {
      const isCartExist = state.cart.some(
        (item) => item.id === payload.product.id
      );
      if (!isCartExist) {
        state.cart.push({
          ...payload.product,
        });
        toast.success("This item added to cart.");
      } else {
        toast.error("This item is already in the cart.");
      }
      localStorage.setItem("local-cart", JSON.stringify(state.cart));
    },
    addCartWithSize: (state, { payload }) => {
      const { item, size } = payload.product;

      // Check if the product with the specific size already exists in the cart
      const isCartExist = state.cart.some(
        (cartItem) => cartItem.item.id === item.id && cartItem.size === size
      );

      if (!isCartExist) {
        state.cart.push({
          ...payload.product,
          // qty is not added or modified
        });
        toast.success("This item added to cart.");
      } else {
        toast.warn("This item with the same size is already in the cart.");
      }

      // Save the updated cart to localStorage
      localStorage.setItem("local-cart", JSON.stringify(state.cart));
    },
    deleteCart: (state, { payload }) => {
      const { id, size } = payload;

      // Find the item in the cart before removing it
      const itemToDelete = state.cart.find(
        (data) => data.item.id === id && data.size === size
      );

      // Remove the item from the cart
      state.cart = state.cart.filter(
        (data) => !(data.item.id === id && data.size === size)
      );

      // Update local storage
      localStorage.setItem("local-cart", JSON.stringify(state.cart));

      // Notify with the item name and size if item exists
      if (itemToDelete) {
        toast.error(
          `Item ${itemToDelete.item.name} with size ${size} has been deleted.`
        );
      } else {
        toast.error(`Item with size ${size} not found in the cart.`);
      }
    },
    addQty: (state, { payload }) => {
      state.cart = state.cart.filter((item) => {
        if (item.id === payload.id) {
          item.qty = payload.qty;
        }
        return item;
      });
      localStorage.setItem("local-cart", JSON.stringify(state.cart));
    },
    reloadCart: (state, { payload }) => {
      const cart = JSON.parse(localStorage.getItem("local-cart"));
      if (cart) {
        state.cart = cart;
      }
    },
  },
});

export const { addCart, addCartWithSize, deleteCart, addQty, reloadCart } =
  shopSlice.actions;
export default shopSlice.reducer;
