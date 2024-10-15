"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { config_url } from "@/util/config";
import { addCartWithSize } from "@/features/shopSlice";
import { addWishlistWithSize } from "@/features/wishlistSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

const ShopCardOnSale = ({ item }) => {
  const { productList } = useSelector((state) => state.Products) || {};

  const [selectedSize, setSelectedSize] = useState(null);

  const dispatch = useDispatch();

  const mySizes = JSON.parse(item.nemuro_shoes); // Sizes array
  const myQuantities = JSON.parse(item.qty); // Quantities array

  const imagesArray = JSON.parse(item.images) || [];
  const validImages = [item.image, ...imagesArray].filter((image) => image);

  const images = {
    img1: `${validImages[0]}`,
    img2: `${validImages[1] || ""}`,
    img3: `${validImages[2] || ""}`,
    img4: `${validImages[3] || ""}`,
  };

  const handleSelectedSize = (size) => {
    setSelectedSize(size);
  };

  const createButton = (size, index, qty, type) => {
    if (type === 1) return null;

    const isBlocked = qty === "0"; // Check if quantity is 0
    const nextAvailableIndex = mySizes.findIndex(
      (s, i) => myQuantities[i] !== "0"
    ); // Find the first available size index

    return (
      <button
        key={size}
        onClick={() => !isBlocked && handleSelectedSize(size)} // Disable click if blocked
        className={`btn btn-sm ${
          isBlocked
            ? "btn-outline-secondary" // No background for blocked items
            : selectedSize === size ||
              (selectedSize === null && index === nextAvailableIndex)
            ? "btn-dark text-white"
            : "btn-outline-secondary"
        }`}
        style={{
          borderRadius: "25px",
          padding: "0.25rem 0.3rem",
          fontSize: "0.7rem",
          cursor: isBlocked ? "not-allowed" : "pointer", // Disable cursor if blocked
          backgroundColor: isBlocked ? "" : "", // No background for blocked sizes
          color: isBlocked ? "" : "", // No specific color for blocked sizes
          textDecoration: isBlocked ? "line-through" : "none", // Add line-through if blocked
        }}
        disabled={isBlocked} // Disable button if qty is 0
      >
        {size}
      </button>
    );
  };

  const renderButtons = (sizes, qtys, type) => {
    return sizes.map((size, index) =>
      createButton(size, index, qtys[index], type)
    );
  };

  const notify = (message) => toast.error(message);

  const addToCart = (id, size) => {
    let size_final;

    if (size === null || myQuantities[mySizes.indexOf(size)] === "0") {
      // Find the first available size with quantity greater than 0
      size_final =
        mySizes.find((s) => myQuantities[mySizes.indexOf(s)] !== "0") || null; // Fallback to null if no size is available

      if (!size_final) {
        // Notify when no sizes are available
        notify("No sizes available to add to the cart.");
        return;
      }
    } else {
      size_final = size; // Use the selected size if it's valid
    }

    const item_fil = productList?.find((item) => item.id === id);
    const itemwithsize = { item: item_fil, size: size_final };
    dispatch(addCartWithSize({ product: itemwithsize }));
  };

  const addToWishlist = (id, size) => {
    let size_final;

    if (size === null || myQuantities[mySizes.indexOf(size)] === "0") {
      // Find the first available size with quantity greater than 0
      size_final =
        mySizes.find((s) => myQuantities[mySizes.indexOf(s)] !== "0") || null; // Fallback to null if no size is available

      if (!size_final) {
        // Notify when no sizes are available
        notify("No sizes available to add to the wishlist.");
        return;
      }
    } else {
      size_final = size; // Use the selected size if it's valid
    }

    const item_fil = productList?.find((item) => item.id === id);
    const itemwithsize = { item: item_fil, size: size_final };
    dispatch(addWishlistWithSize({ product: itemwithsize }));
  };

  const percentage = ((item?.price - item?.price_promo) / item?.price) * 100;

  return (
    <>
      <div className="col">
        <div className="tpproduct pb-15 mb-30">
          <div className="tpproduct__thumb p-relative">
            {item.status_model === "new" && (
              <span className="tpproduct__thumb-release">New</span>
            )}
            {item.status ? (
              <span className="tpproduct__thumb-soldout">{item.status}</span>
            ) : (
              <></>
            )}

            <span className="tpproduct__thumb-volt">
              -{percentage.toFixed(0)}%
            </span>

            <Link href={`/produits/${item.name_by_filtered}`}>
              <Image
                width={250}
                height={250}
                src={images.img1}
                alt={item.meta_image}
              />
              <Image
                width={250}
                height={250}
                className="product-thumb-secondary"
                src={images.img3}
                alt={item.meta_image}
              />
            </Link>
            <div className="tpproduct__thumb-action">
              <a
                onClick={() => addToCart(item.id, selectedSize)}
                className="add-to-cart"
              >
                <i className="fal fa-shopping-basket" />
              </a>
              <Link href={`/produits/${item.name_by_filtered}`}>
                <i className="fal fa-eye" />
              </Link>
              <a
                onClick={() => addToWishlist(item.id, selectedSize)}
                className="wishlist"
              >
                <i className="fal fa-heart" />
              </a>
            </div>
          </div>

          <div className="tpproduct__content">
            <h3 className="tpproduct__title mt-20">
              <Link href={`/produits/${item.name_by_filtered}`}>
                {item.name}
              </Link>
            </h3>
            <div className="tpproduct__priceinfo p-relative">
              <div className="tpproduct__priceinfo-list">
                {item.price_promo === 0 ? (
                  ""
                ) : (
                  <span>{item.price_promo}.00Dh</span>
                )}
                {item.price_promo === 0 ? (
                  <span>{item.price}Dh</span>
                ) : (
                  <del className="ml-10">{item.price}.00Dh</del>
                )}
              </div>
            </div>
            <div className="mb-2 p-2 d-flex flex-column gap-2 me-2">
              <div className="row row-cols-4 row-cols-md-4 row-cols-lg-4 g-2">
                {renderButtons(mySizes, myQuantities, item.type)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopCardOnSale;
