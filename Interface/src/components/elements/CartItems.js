"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import { deleteCart } from "@/features/shopSlice";
import Image from "next/image";

const CartItems = () => {
  const { cart } = useSelector((state) => state.shop) || {};

  const dispatch = useDispatch();

  // delete cart item
  const deleteCartHandler = (id, size) => {
    dispatch(deleteCart({ id, size }));
  };

  return (
    <>
      {cart?.map((data, index) => {
        const price =
          data.item.price_promo !== 0 ? data.item.price_promo : data.item.price;
        return (
          <tr className="cart-item" key={index}>
            <td className="product-thumbnail">
              <Image
                src={data.item.image}
                alt="cart added product"
                width={80}
                height={80}
              />
            </td>

            <td className="product-name">
              <Link href={`/produits/${data.item.name_by_filtered}`}>
                {data.item.name}
              </Link>
            </td>
            <td className="product-name">
              <button
                className="btn btn-sm btn-dark text-white"
                style={{
                  borderRadius: "25px",
                  padding: "0.25rem 0.75rem",
                  fontSize: "0.6rem",
                }} // Smaller padding
              >
                {data.size}
              </button>
            </td>

            <td className="product-price">{price.toFixed(2)} Dh</td>

            <td className="product-remove text-center">
              <button
                onClick={() => deleteCartHandler(data.item?.id, data.size)}
                className="remove"
              >
                <i className="fa fa-trash text-danger"></i>
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default CartItems;
