import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Define types for cart item and state
interface CartItem {
  id: number;
  name: string;
  price: number;
  cartQuantity: number;
}

interface Table {
  id: number;
  name: string;
}

interface CartState {
  cartState: boolean;
  cartItems: CartItem[];
  cartTotalAmount: number;
  cartTotalQantity: number;
  table: Table;
}

// Initial state
const initialState: CartState = {
  cartState: false,
  cartItems:
    typeof window !== "undefined" && localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart") as string)
      : [],
  cartTotalAmount: 0,
  cartTotalQantity: 0,
  table: { id: 1, name: "" },
};

const CartSlice = createSlice({
  initialState,
  name: "cart",
  reducers: {
    setOpenCart: (state, action: PayloadAction<{ cartState: boolean }>) => {
      state.cartState = action.payload.cartState;
    },
    setCloseCart: (state, action: PayloadAction<{ cartState: boolean }>) => {
      state.cartState = action.payload.cartState;
    },
    setAddItemToCart: (state, action: PayloadAction<CartItem>) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].cartQuantity += 1;
        toast.success("Item QTY Increased", {
          position: "top-right",
        });
      } else {
        const temp = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(temp);
        toast.success(`${action.payload.name} added to Cart`);
      }

      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    setRemoveItemFromCart: (
      state,
      action: PayloadAction<{ id: number; name: string }>
    ) => {
      const removeItem = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );

      state.cartItems = removeItem;
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
      toast.success(`${action.payload.name} Removed From Cart`);
    },
    setIncreaseItemQTY: (state, action: PayloadAction<{ id: number }>) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].cartQuantity += 1;
        toast.success(`Item QTY Increased`);
      }
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    setDecreaseItemQTY: (state, action: PayloadAction<{ id: number }>) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (itemIndex >= 0 && state.cartItems[itemIndex].cartQuantity > 1) {
        state.cartItems[itemIndex].cartQuantity -= 1;
        toast.success(`Item QTY Decreased`);
      }
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    setClearCartItems: (state) => {
      state.cartItems = [];
      toast.success(`Cart Cleared`);
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    chooiceTableReserved: (state, action: PayloadAction<Table>) => {
      console.log(action.payload);
      state.table = action.payload;
    },
    setGetTotals: (state) => {
      const { totalAmount, totalQTY } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, cartQuantity } = cartItem;
          const totalPrice = price * cartQuantity;

          cartTotal.totalAmount += totalPrice;
          cartTotal.totalQTY += cartQuantity;

          return cartTotal;
        },
        {
          totalAmount: 0,
          totalQTY: 0,
        }
      );

      state.cartTotalAmount = totalAmount;
      state.cartTotalQantity = totalQTY;
    },
  },
});

export const {
  setOpenCart,
  setCloseCart,
  setAddItemToCart,
  setRemoveItemFromCart,
  setIncreaseItemQTY,
  setDecreaseItemQTY,
  setClearCartItems,
  chooiceTableReserved,
  setGetTotals,
} = CartSlice.actions;

export const selectCartState = (state: { cart: CartState }) =>
  state.cart.cartState;
export const selectCartItems = (state: { cart: CartState }) =>
  state.cart.cartItems;
export const selectTotalAmount = (state: { cart: CartState }) =>
  state.cart.cartTotalAmount;
export const selectTotalQTY = (state: { cart: CartState }) =>
  state.cart.cartTotalQantity;
export const selectTable = (state: { cart: CartState }) => state.cart.table;

export default CartSlice.reducer;
