"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { addCart } from "@/features/shopSlice";
import { addWishlist } from "@/features/wishlistSlice";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

import ShopCard from "./ShopCard";
import { loadAllProducts } from "@/features/productsSlice";

const FilterShopBox2 = ({ itemStart, itemEnd }) => {
  const [listProducts, setListProducts] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/interface/products")
      .then(async (res) => {
        await setListProducts(res.data);
        await dispatch(loadAllProducts(res.data));
      });
  }, []);

  const addToCart = (id) => {
    const item = listProducts?.find((item) => item.id === id);
    dispatch(addCart({ product: item }));
  };

  const addToWishlist = (id) => {
    const item = listProducts?.find((item) => item.id === id);
    dispatch(addWishlist({ product: item }));
  };

  let content = listProducts?.map((item, i) => (
    <Fragment key={i}>
      <ShopCard
        item={item}
        addToCart={addToCart}
        addToWishlist={addToWishlist}
      />
    </Fragment>
    // End all products
  ));

  return <>{content}</>;
};

export default FilterShopBox2;
