import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import filterSlice from "./filterSlice";
import productSlice from "./productSlice";
import shopSlice from "./shopSlice";
import wishlistSlice from "./wishlistSlice";
import categorySlice from "./categorySlice";
import productsSlice from "./productsSlice";
import customerSlice from "./customerSlice";

// Combine your slices into a single reducer
const rootReducer = combineReducers({
  product: productSlice,
  filter: filterSlice,
  shop: shopSlice,
  wishlist: wishlistSlice,
  Categories: categorySlice,
  Customer: customerSlice,
  Products: productsSlice,
});

// Create a persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
