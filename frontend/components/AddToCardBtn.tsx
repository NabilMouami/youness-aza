"use client";

import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { toast } from "react-toastify";
import { store } from "@/lib/store";

const AddToCardBtn = ({
  className,
  title,
  product,
  showPrice = true,
}: {
  className?: string;
  title?: string;
  product?: any;
  showPrice?: boolean;
}) => {
  const [size, setSize] = useState<string>();
  const newClassName = twMerge(
    "bg-[#f7f7f7] uppercase text-xs py-3 text-center rounded-full font-semibold hover:bg-black hover:text-white hover:scale-105 duration-200 cursor-pointer",
    className
  );

  const myArray = JSON.parse(product.nemuro_shoes);

  const createButton = (number: string) => {
    const isSizeSelected = product.size === number;
    return (
      <button
        key={number}
        className={`px-6 py-1 border text-xl rounded-full border-black inline-flex items-center justify-center ${
          isSizeSelected ? "bg-red-500" : ""
        }`}
        style={{ minWidth: "auto" }}
        onClick={() => setSize(number)}
      >
        {number}
      </button>
    );
  };

  const { addToCart, cartProduct, decreaseQuantity } = store();

  const handleAddToCart = () => {
    if (product && size) {
      addToCart(product, size);
      toast.success(`${product?.name.substring(0, 10)} added successfully!`);
    } else {
      console.error("Product is undefined or size is not selected");
    }
  };

  const handleDeleteProduct = () => {
    if (existingProduct) {
      if (existingProduct?.quantity > 1) {
        decreaseQuantity(existingProduct?.id);
        toast.success(
          `${product?.name.substring(0, 10)} decreased successfully!`
        );
      } else {
        toast.error("You cannot decrease less than 1");
      }
    } else {
      if (product) {
        decreaseQuantity(product?.id);
        toast.success(
          `${product?.name.substring(0, 10)} decreased successfully!`
        );
      }
    }
  };

  const [existingProduct, setExistingProduct] = useState<any | null>(null);

  useEffect(() => {
    const availableItem = cartProduct.find(
      (item: any) => item?.id === product?.id
    );
    setExistingProduct(availableItem || null);
  }, [product, cartProduct]);

  return (
    <>
      {showPrice && (
        <div>
          <div className={twMerge("flex items-center gap-2", className)}>
            <p className="font-medium">
              <span
                className={
                  product.price_promo > 0
                    ? "line-through text-gray-500"
                    : "text-black"
                }
              >
                {product.price}Dh
              </span>
            </p>
            {product.price_promo > 0 && (
              <p className="font-bold text-red-500">
                <span>{product.price_promo}Dh</span>
              </p>
            )}
          </div>
        </div>
      )}
      <div className="mr-4 px-1 py-1 flex flex-col gap-1">
        <div className="grid grid-cols-4 gap-8">
          {myArray.map(createButton)}
        </div>
      </div>
      {existingProduct ? (
        <div className="flex self-center items-center justify-center gap-2">
          <button
            onClick={handleDeleteProduct}
            className="bg-[#f7f7f7] text-black p-2 border-[1px] border-gray-200 hover:border-skyText rounded-full text-base hover:bg-white duration-200 cursor-pointer"
          >
            <FaMinus />
          </button>
          <p className="text-base font-semibold w-10 text-center">
            {existingProduct?.quantity}
          </p>
          <button
            onClick={handleAddToCart}
            className="bg-[#f7f7f7] text-black p-2 border-[1px] border-gray-200 hover:border-skyText rounded-full text-base hover:bg-white duration-200 cursor-pointer"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button className={newClassName} onClick={handleAddToCart}>
          {title ? title : "Add to cart"}
        </button>
      )}
    </>
  );
};

export default AddToCardBtn;
