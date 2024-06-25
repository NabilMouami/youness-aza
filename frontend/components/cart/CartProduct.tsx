"use client";

import { IoClose } from "react-icons/io5";
import AddToCardBtn from "../AddToCardBtn";
import { FaCheck } from "react-icons/fa6";
import FormattedPrice from "../FormattedPrice";
import { store } from "@/lib/store";
import { toast } from "react-toastify";
import Link from "next/link";
const config_url = `http://localhost:5000`;

const CartProduct = ({ product }: { product: any }) => {
  const { removeFromCart } = store();

  const handleRemoveProduct = () => {
    if (product) {
      removeFromCart(product?.id);
      toast.success(`${product?.name.substring(0, 20)} deleted successfully!`);
    }
  };

  const displayPrice =
    product?.price_promo !== 0 ? product?.price_promo : product?.price;

  return (
    <div key={product?.id} className="flex py-6 sm:py-10">
      <Link href={`/product/${product?.id}`}>
        <img
          src={`${config_url}/images/${product.image}`}
          alt="productImage"
          className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48 border border-skyText/30 hover:border-skyText duration-300"
        />
      </Link>

      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:pr-0">
          <div className="flex flex-col gap-1 col-span-3">
            <h3 className="text-base font-semibold w-full">
              {product?.name.substring(0, 80)}
            </h3>
            <p>
              Brand:{" "}
              <span className="font-semibold text-xl">{product?.category}</span>
            </p>
            <p>
              Size:{" "}
              <span className="font-semibold text-xl">{product?.size}</span>
            </p>
            <div className="flex items-center gap-6 mt-2">
              <p className="w-1/2 text-base font-semibold">
                <span>{displayPrice * product?.quantity} Dh</span>
              </p>
              <AddToCardBtn product={product} showPrice={false} />
            </div>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <div className="absolute right-0 top-0">
              <button
                onClick={() => handleRemoveProduct()}
                type="button"
                className="-m-2 inline-flex p-2 text-gray-600 hover:text-red-600"
              >
                <span className="sr-only">Remove</span>
                <IoClose className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="mt-4 flex space-x-2 text-sm text-gray-700">
            {product?.isStock ? (
              <FaCheck
                className="h-5 w-5 flex-shrink-0 text-green-500"
                aria-hidden="true"
              />
            ) : (
              <FaCheck
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                aria-hidden="true"
              />
            )}
            <span>{product?.isStock ? "In stock" : `Ships in 3–4 weeks`}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
