"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const ShopCardLatestArrival = ({ status, item }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const mySizes = JSON.parse(item.nemuro_shoes); // Sizes array
  const myQuantities = JSON.parse(item.qty); // Quantities array

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

  return (
    <>
      <div className="col">
        <div className="tpproduct pb-15 mb-30">
          <div className="tpproduct__thumb p-relative">
            {status ? (
              <span className="tpproduct__thumb-release">{status}</span>
            ) : (
              <></>
            )}

            <Link href={`/produits/${item.name_by_filtered}`}>
              <div className="image-container">
                <Image
                  width={500}
                  height={500}
                  src={item?.image}
                  className="zoom-image"
                  alt={item?.meta_image}
                />
              </div>
            </Link>
          </div>
          <div className="tpproduct__content">
            <h3 className="tpproduct__title">
              <Link href={`/produits/${item.name_by_filtered}`}>
                {item.name}
              </Link>
            </h3>

            <div className="tpproduct__priceinfo p-relative">
              <div>
                {item.price_promo === 0 ? (
                  ""
                ) : (
                  <span className="fw-bold">{item.price_promo}.00Dh</span>
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

export default ShopCardLatestArrival;
