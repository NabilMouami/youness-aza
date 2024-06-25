"use client";

import React from "react";
import { BsChevronDoubleLeft, BsFileEarmarkExcelFill } from "react-icons/bs";
interface CartCountProps {
  onCartToggle: () => void;
  totalQTY: number;
  onClearCartItems: () => void;
}

const CartCount: React.FC<CartCountProps> = ({
  onCartToggle,
  totalQTY,
  onClearCartItems,
}) => {
  return (
    <>
      <div className="bg-white h-11 flex items-center justify-between text-[#000] px-3 sticky top-0 left-0 right-0 w-full">
        <div className="flex items-center gap-3">
          <div
            className="grid items-center cursor-pointer"
            onClick={onCartToggle}
          >
            <BsChevronDoubleLeft className="w-5 h-5 text-slate-900 hover:text-orange-500 stroke-[2]" />
          </div>
          <div className="grid items-center">
            <h1 className="text-base font-medium text-slate-900">
              Your Cart{" "}
              <span className="bg-theme-cart rounded px-1 py-0.5 text-slate-100 font-normal text-sm">
                ({totalQTY} Items)
              </span>
            </h1>
          </div>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={onClearCartItems}
            className="rounded bg-theme-cart active:scale-90 p-0.5"
          >
            <BsFileEarmarkExcelFill className="w-5 h-5 text-white stroke-[2]" />
          </button>
        </div>
      </div>
    </>
  );
};

export default CartCount;
