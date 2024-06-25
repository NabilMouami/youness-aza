"use client";

import React from "react";
import emptybag from "./emptybag.png";
import { AiOutlineArrowLeft } from "react-icons/ai";
interface CartEmptyProps {
  onCartToggle: () => void; // Function to toggle cart visibility
}
const CartEmpty: React.FC<CartEmptyProps> = ({ onCartToggle }) => {
  return (
    <>
      <div className="flex items-center justify-center flex-col h-screen px-11 text-center gap-7">
        <img
          src="/emptybag.png"
          alt="emptybag/img"
          className="w-40 lg:w-36 sm:w-28 h-auto object-fill transition-all duration-300 hover:scale-110"
        />
        <button
          type="button"
          className="button-theme bg-gradient-to-b from-amber-500 to-orange-500 shadow-lg shadow-orange-500 flex items-center justify-center text-slate-900 py-2 gap-3 text-sm px-5 font-semibold active:scale-110"
          onClick={onCartToggle}
        >
          <AiOutlineArrowLeft className="w-5 h-5 text-slate-900" />
          <span>Retour au Stock</span>
        </button>
      </div>
    </>
  );
};

export default CartEmpty;
