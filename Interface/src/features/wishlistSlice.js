import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  wishlist: [],
};

export const shopSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addWishlist: (state, { payload }) => {
      const isWishlistExist = state.wishlist.some(
        (item) => item.id === payload.product.id
      );
      if (!isWishlistExist) {
        state.wishlist.push({
          ...payload.product,
          qty: payload?.qty ? payload.qty : 1,
        });
        toast.success("This item added to Wishlist.");
      } else {
        toast.error("This item is already in the Wishlist.");
      }
      localStorage.setItem("local-wishlist", JSON.stringify(state.wishlist));
    },
    addWishlistWithSize: (state, { payload }) => {
      const { item, size } = payload.product;

      // Check if the product with the specific size already exists in the wishlist
      const isWishlistExist = state.wishlist.some(
        (wishlistItem) =>
          wishlistItem.item.id === item.id && wishlistItem.size === size
      );

      if (!isWishlistExist) {
        state.wishlist.push({
          ...payload.product, // Add item to the wishlist with size
        });
        toast.success("This item added to Wishlist.");
      } else {
        toast.warn("This item with the same size is already in the Wishlist.");
      }

      // Save the updated wishlist to localStorage
      localStorage.setItem("local-wishlist", JSON.stringify(state.wishlist));
    },

    deleteWishlist: (state, { payload }) => {
      const { id, size } = payload;

      // Find the item in the wishlist before removing it
      const itemToDelete = state.wishlist.find(
        (wishlistItem) =>
          wishlistItem.item.id === id && wishlistItem.size === size
      );

      // Filter out the specific item with the matching id and size
      state.wishlist = state.wishlist.filter(
        (wishlistItem) =>
          !(wishlistItem.item.id === id && wishlistItem.size === size)
      );

      // Update local storage
      localStorage.setItem("local-wishlist", JSON.stringify(state.wishlist));

      // Notify with the item name and size if item exists
      if (itemToDelete) {
        toast.error(
          `Item ${itemToDelete.item.name} with size ${size} has been deleted from the Wishlist.`
        );
      } else {
        toast.error(`Item with size ${size} not found in the Wishlist.`);
      }
    },
    addQty: (state, { payload }) => {
      state.wishlist = state.wishlist.filter((item) => {
        if (item.id === payload.id) {
          item.qty = payload.qty;
        }
        return item;
      });
      localStorage.setItem("local-wishlist", JSON.stringify(state.wishlist));
    },
    reloadWishlist: (state, { payload }) => {
      const wishlist = JSON.parse(localStorage.getItem("local-wishlist"));
      if (wishlist) {
        state.wishlist = wishlist;
      }
    },
  },
});

export const {
  addWishlist,
  deleteWishlist,
  addQty,
  reloadWishlist,
  addWishlistWithSize,
} = shopSlice.actions;
export default shopSlice.reducer;
