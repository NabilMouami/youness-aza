"use client";

import Link from "next/link";
import { config_url } from "@/util/config";
import { Fragment, useState } from "react";
import Image from "next/image";
import { addCartWithSize } from "@/features/shopSlice";
import { addWishlistWithSize } from "@/features/wishlistSlice";

import { useSelector, useDispatch } from "react-redux";

const ShopCard = ({ item }) => {
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

    return (
      <button
        key={size}
        onClick={() => !isBlocked && handleSelectedSize(size)} // Disable click if blocked
        className={`btn btn-sm ${
          isBlocked
            ? "btn-outline-secondary" // Default outline for blocked items
            : selectedSize === size || (selectedSize === null && index === 0)
            ? "btn-dark text-white"
            : "btn-outline-secondary"
        }`}
        style={{
          borderRadius: "25px",
          padding: "0.25rem 0.3rem",
          fontSize: "0.7rem",
          cursor: isBlocked ? "not-allowed" : "pointer", // Disable cursor if blocked
          backgroundColor: isBlocked ? "black" : "", // Add blocked background color
          color: isBlocked ? "red" : "", // Add blocked text color
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
  return (
    <Fragment>
      <div className="col">
        <div className="tpproduct mb-15 p-relative">
          <div className="tpproduct__thumb">
            <div className="tpproduct__thumbitem p-relative">
              {item.status_model === "new" && (
                <span className="tpproduct__thumb-release">New</span>
              )}
              {item.status ? (
                <span className="tpproduct__thumb-soldout">{item.status}</span>
              ) : (
                <></>
              )}
              <Link href={`/produits/${item.name_by_filtered}`}>
                <Image
                  src={images.img1}
                  width={250}
                  height={250}
                  alt={item.meta_image}
                />
                <Image
                  className="thumbitem-secondary"
                  src={images.img3}
                  width={250}
                  height={250}
                  alt={item.meta_image}
                />
              </Link>
              <div className="tpproduct__thumb-bg">
                <div className="tpproductactionbg">
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
            </div>
          </div>
          <div className="tpproduct__content-area">
            <h3 className="tpproduct__title mb-5">
              <Link href={`/produits/${item.name_by_filtered}`}>
                {item.name}
              </Link>
            </h3>
            <div className="tpproduct__priceinfo p-relative d-flex gap-4">
              {item.price_promo !== 0 && (
                <div className="tpproduct__ammount">
                  <span>{item.price_promo}.00 Dh</span>
                </div>
              )}
              {item.price_promo !== 0 ? (
                <del className="ml-4">{item.price}.00 Dh</del>
              ) : (
                <span>{item.price}Dh</span>
              )}
            </div>
            <div className="mb-2 p-2 d-flex flex-column gap-2 me-2">
              <div className="row row-cols-4 row-cols-md-4 row-cols-lg-4 g-2">
                {renderButtons(mySizes, myQuantities, item.type)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ShopCard;
