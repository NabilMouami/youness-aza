"use client";
import { useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { config_url } from "@/util/config";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";
const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 5,
  spaceBetween: 30,
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
      slidesPerView: 3,
    },
    576: {
      slidesPerView: 3,
    },
    0: {
      slidesPerView: 1,
    },
  },
  // Navigation arrows
  navigation: {
    nextEl: ".tpproductarrow__nxt",
    prevEl: ".tpproductarrow__prv",
  },
};

export default function WhiteProduct() {
  const { productList } = useSelector((state) => state.Products) || {};
  const [selectedSize, setSelectedSize] = useState(null);

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
      <section className="white-product-area grey-bg-2 pt-30 pb-30 fix p-relative">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-sm-6 col-12">
              <div className="tpsection mb-10">
                <h4 className="tpsection__title">
                  <Link href="on-sale">Sales</Link>{" "}
                </h4>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              <div className="tpproductarrow d-flex align-items-center">
                <div className="tpproductarrow__prv">
                  <i className="far fa-long-arrow-left" />
                  Prev
                </div>
                <div className="tpproductarrow__nxt">
                  Next
                  <i className="far fa-long-arrow-right" />
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-container related-product-active">
            <Swiper {...swiperOptions}>
              {productList
                ?.filter((item) => item.price_promo !== 0)
                .slice(1, 11)
                .map((item) => {
                  const images = JSON.parse(item.images); // Parse the images string into an array
                  const secondImage = images[1];

                  const myArray = JSON.parse(item.nemuro_shoes);
                  const myQuantities = JSON.parse(item.qty); // Quantities array

                  return (
                    <SwiperSlide key={item.id}>
                      <div className="tpproduct pb-15">
                        <div className="tpproduct__thumb p-relative">
                          <Link
                            href={`/produits/${item.name_by_filtered}`}
                            onClick={(e) => handleLinkClick(e, item)}
                          >
                            <Image
                              width={500}
                              height={500}
                              className="product-thumb-secondary"
                              src={secondImage}
                              alt={item.meta_image}
                            />
                            <Image
                              width={300}
                              height={300}
                              src={item.image}
                              alt={item.meta_image}
                            />
                          </Link>

                          <div className="tpproduct__content">
                            <h3 className="tpproduct__title mt-20">
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
      </section>
    </>
  );
}
