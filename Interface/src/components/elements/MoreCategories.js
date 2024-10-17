"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 5,
  spaceBetween: 25,
  autoplay: {
    delay: 3500,
  },
  breakpoints: {
    1400: {
      slidesPerView: 5,
    },
    1200: {
      slidesPerView: 5,
    },
    992: {
      slidesPerView: 4,
    },
    768: {
      slidesPerView: 2,
    },
    576: {
      slidesPerView: 2,
    },
    0: {
      slidesPerView: 1,
    },
  },
  navigation: {
    nextEl: ".tprelated__nxt",
    prevEl: ".tprelated__prv",
  },
};

export default function MoreCategories({
  category,
  productSimilaire,
  addToCart,
  addToWishlist,
  handleLinkClick,
}) {
  const { productList } = useSelector((state) => state.Products) || {};
  const [selectedSize, setSelectedSize] = useState(null);
  const [productsLiked, setProductsLiked] = useState([]); // Added state for liked products

  useEffect(() => {
    if (productList?.length > 0) {
      const shuffledProducts = [...productList]?.sort(
        () => 0.5 - Math.random()
      ); // shuffle the array
      setProductsLiked(shuffledProducts?.slice(0, 12)); // pick the first 12 items
    }
  }, [productList]);

  const handleSelectedSize = (size) => {
    setSelectedSize(size);
  };

  const createButton = (size, index, qty, type) => {
    if (type === 1) return null; // Skip button rendering if type is 1

    const isBlocked = qty === "0"; // Check if quantity is 0

    return (
      <button
        key={size}
        onClick={() => !isBlocked && handleSelectedSize(size)} // Disable click if blocked
        className={`btn btn-sm ${
          isBlocked
            ? "btn-outline-secondary" // Default outline for blocked items
            : selectedSize === size || (selectedSize === null && index === 0)
            ? "btn-dark text-white" // Highlight the selected size or default to the first available
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

  return (
    <>
      <div className="related-product-area pt-65 pb-50 related-product-border">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-sm-6">
              <div className="tpsection mb-40">
                <h4 className="tpsection__title">Plus De: {category}</h4>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="tprelated__arrow d-flex align-items-center justify-content-end mb-40">
                <div className="tprelated__prv">
                  <i className="far fa-long-arrow-left" />
                </div>
                <div className="tprelated__nxt">
                  <i className="far fa-long-arrow-right" />
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-container related-product-active">
            <Swiper {...swiperOptions}>
              {productSimilaire?.map((item) => {
                // Safely parse images, and use fallback in case of errors
                let images = [];
                try {
                  images = JSON.parse(item?.images);
                } catch (e) {
                  console.error("Failed to parse images:", e);
                  images = []; // Fallback to an empty array if parsing fails
                }

                const secondImage = images[0] || "/fallback-image.jpg"; // Default to fallback if no second image

                // Safely parse qty data
                let myQuantities = [];
                try {
                  myQuantities = JSON.parse(item?.qty) || [];
                } catch (e) {
                  console.error("Failed to parse quantities:", e);
                  myQuantities = []; // Fallback to an empty array if parsing fails
                }

                const myArray = JSON.parse(item?.nemuro_shoes) || []; // Parse or default to empty array

                return (
                  <SwiperSlide key={item.id}>
                    <div className="tpproduct pb-5">
                      <div className="tpproduct__thumb p-relative">
                        <Link
                          href={`/produits/${item.name_by_filtered}`}
                          onClick={(e) => handleLinkClick(e, item)}
                        >
                          <Image
                            width={250}
                            height={250}
                            className="product-thumb-secondary"
                            src={secondImage}
                            alt="product-thumb-secondary"
                          />
                          <Image
                            width={250}
                            height={250}
                            src={item.image || "/fallback-image.jpg"} // Fallback if no image
                            alt="product-thumb"
                          />
                        </Link>

                        <div className="tpproduct__content">
                          <h3 className="tpproduct__title mt-10">
                            <Link
                              href={`/produits/${item.name_by_filtered}`}
                              onClick={(e) => handleLinkClick(e, item)}
                            >
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

                            <div className="mb-2 p-2 d-flex flex-column gap-2 me-2">
                              <div className="row row-cols-4 row-cols-md-4 row-cols-lg-4 g-2">
                                {renderButtons(
                                  myArray,
                                  myQuantities,
                                  item.type
                                )}{" "}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
}
