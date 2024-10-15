"use client";
import { deleteWishlist } from "@/features/wishlistSlice";

import { RiAddFill, RiDeleteBin2Fill } from "react-icons/ri";
import { addCartWithSize, deleteCart } from "@/features/shopSlice";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
const WishlistItems = () => {
  const { wishlist } = useSelector((state) => state.wishlist) || {};
  const { productList } = useSelector((state) => state.Products) || {};

  const dispatch = useDispatch();

  // delete wishlist item
  const deleteWishListHandler = (id, size) => {
    dispatch(deleteWishlist({ id, size }));
  };

  const addToCart = (id, size) => {
    const item = productList?.find((item) => item.id === id);
    const itemwithsize = { item, size };
    console.log(itemwithsize);
    dispatch(addCartWithSize({ product: itemwithsize }));
  };
  return (
    <>
      {wishlist?.map((data) => {
        const price =
          data.item.price_promo !== 0 ? data.item.price_promo : data.item.price;
        return (
          <tr className="cart-item" key={data.item.id}>
            <td className="product-thumbnail">
              <Link href={`/produits/${data.item.name_by_filtered}`}>
                <img src={data.item.image} alt="cart added product" />
              </Link>
            </td>

            <td className="product-name">
              <Link href={`/produits/${data.item.name_by_filtered}`}>
                {data.item.name}
              </Link>
            </td>
            <td className="product-name">
              <button
                className="btn btn-sm btn-dark text-white"
                style={{ borderRadius: "25px", padding: "0.25rem 0.75rem" }} // Smaller padding
              >
                {data.size}
              </button>
            </td>

            <td className="product-subtotal">
              <span className="amount">{price.toFixed(2)} Dh</span>
            </td>
            <td className="product-remove">
              <button
                onClick={() => addToCart(data.item?.id, data.size)}
                className="remove"
              >
                <span className="text-danger ml-20">
                  <RiAddFill size={40} />
                </span>
              </button>
            </td>

            <td className="product-remove">
              <button
                onClick={() => deleteWishListHandler(data.item?.id, data.size)}
                className="remove"
              >
                <span className="text-danger ml-20">
                  <RiDeleteBin2Fill size={40} />
                </span>
              </button>
            </td>
          </tr>
        );
      })}{" "}
    </>
  );
};

export default WishlistItems;
