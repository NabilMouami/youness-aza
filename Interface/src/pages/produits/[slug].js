"use client";
import Head from "next/head";

import { useState, useEffect } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useDispatch, useSelector } from "react-redux";
import { addCartWithSize } from "@/features/shopSlice";
import { addWishlistWithSize } from "@/features/wishlistSlice";
import Layout from "@/components/layout/Layout";
import LikedProducts from "@/components/elements/LikedProducts";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import Link from "next/link";
import { toast } from "react-toastify";

import ReactImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "react-image-gallery/styles/css/image-gallery.css";
import { config_url } from "@/util/config";
import { loadDetailsProduct } from "@/features/productsSlice";
import Image from "next/image";
import MoreCategories from "@/components/elements/MoreCategories";

function DetailsProduct({ initialData, nameByFiltered }) {
  const { productList } = useSelector((state) => state.Products) || {};
  const { Details } = useSelector((state) => state.Products) || {};
  const [productSimilaire, setProductSimilaire] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectsize, setSelected] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [listProdsGroup, setListProdsGroup] = useState([]);
  console.log(listProdsGroup);
  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState(initialData || {});
  const [category, setCategory] = useState("");
  console.log(category);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (product) {
      dispatch(loadDetailsProduct(product)); // Dispatch the action
    }
  }, [product, dispatch]);

  useEffect(() => {
    if (product.id) {
      console.log("Fetching product group for product id:", product.id);
      axios
        .get(`${config_url}/api/product_group/${product?.id}`)
        .then((res) => {
          console.log("Product Group Data:", res.data);
          setListProdsGroup(res.data);
        })
        .catch((error) => {
          console.error("Failed to fetch product group:", error);
        });
    }
  }, [product]);

  useEffect(() => {
    console.log("Details changed:", Details);
    if (Details?.category) {
      console.log("Setting category:", Details?.category);
      setCategory(Details?.category); // Update category when Details.category changes
    }
  }, [Details]);

  useEffect(() => {
    if (category && productList?.length > 0) {
      const filtered = productList?.filter(
        (product) => product.category === category
      );
      setProductSimilaire(filtered);
    }
  }, [category, productList]);

  const handleLinkClick = (e, item) => {
    e.preventDefault();
    router
      .push(`/produits/${item.name_by_filtered}`)
      .then(() => router.reload());
  };

  const handleSelectedSize = (size) => {
    setSelectedSize(size);
    setSelected(false);
  };
  if (!Details) {
    return <div>Product not found</div>;
  }
  let myQuantities = []; // Quantities array

  let myArray = [];
  if (Details?.nemuro_shoes) {
    try {
      myArray = JSON.parse(Details?.nemuro_shoes);
      myQuantities = JSON.parse(Details?.qty);
    } catch (error) {
      console.error("Failed to parse nemuro_shoes JSON:", error);
    }
  }

  const notify = (message) => toast.error(message);

  const addToCart = (id, size) => {
    let size_final;

    if (size === null || myQuantities[myArray?.indexOf(size)] === "0") {
      // Find the first available size with quantity greater than 0
      size_final =
        myArray.find((s) => myQuantities[myArray?.indexOf(s)] !== "0") || null; // Fallback to null if no size is available

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

    if (size === null || myQuantities[myArray.indexOf(size)] === "0") {
      // Find the first available size with quantity greater than 0
      size_final =
        myArray.find((s) => myQuantities[myArray.indexOf(s)] !== "0") || null; // Fallback to null if no size is available

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

  const imagesArray = Details?.images ? JSON.parse(Details?.images) : [];
  const validImages = [Details?.image, ...imagesArray]?.filter(
    (image) => image
  );

  const productDetailItem = {
    images: validImages?.map((image) => ({
      original: `${image}`,
      thumbnail: `${image}`,
    })),
  };

  const renderImage = (item) => (
    <Zoom>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "auto",
        }}
      >
        <img
          style={{
            width: "100%",
            objectFit: "cover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "auto",
          }}
          src={item.original}
          alt={item.meta_image}
        />
      </div>
    </Zoom>
  );
  const renderLeftNav = (onClick, disabled) => (
    <button className="custom-left-nav" disabled={disabled} onClick={onClick}>
      <FaChevronLeft />
    </button>
  );

  const renderRightNav = (onClick, disabled) => (
    <button className="custom-right-nav" disabled={disabled} onClick={onClick}>
      <FaChevronRight />
    </button>
  );
  const createButton = (size, index, qty, type) => {
    if (type === 1) return null;

    const isBlocked = qty === "0"; // Check if quantity is 0
    const nextAvailableIndex = myArray?.findIndex(
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
    return sizes?.map((size, index) =>
      createButton(size, index, qtys[index], type)
    );
  };

  return (
    <>
      <Head>
        <title>{`Shop ${Details.name} | At Yazasneakers Store`}</title>
        <meta
          name="description"
          content={`Discover the features and benefits of ${Details.name}. Shop now for the best deals on ${Details.category_names} at Yazasneakers.`}
        />
        <meta property="og:title" content={`Shop  ${Details.name}`} />
        <meta property="og:description" content={` ${Details.description}`} />
        <meta
          property="og:image"
          content="https://your-image-url.com/{product-image}.jpg"
        />
        <meta
          property="og:url"
          content={`http://localhost:3000/produits/${Details.name}`}
        />
      </Head>

      <Layout headerStyle={3} footerStyle={1}>
        <div>
          <section className="product-area pt-40 pb-25">
            <div className="container">
              <div className="row">
                <div className="col-lg-5 col-md-12">
                  <div className="tpproduct-details__nab pr-10 mb-10">
                    <ReactImageGallery
                      showFullscreenButton={false}
                      showPlayButton={false}
                      renderItem={renderImage}
                      renderLeftNav={renderLeftNav}
                      renderRightNav={renderRightNav}
                      autoPlay={false}
                      items={productDetailItem.images}
                    />
                  </div>
                </div>
                <div className="col-lg-5 col-md-7">
                  <div className="tpproduct-details__content">
                    <div className="tpproduct-details__title-area d-flex align-items-center flex-wrap mb-5">
                      <h3 className="tpproduct-details__title">
                        {Details.name}
                      </h3>
                      <span className="tpproduct-details__stock">
                        {Details.status ? (
                          Details.status
                        ) : (
                          <span className="text-success">In Stock</span>
                        )}
                      </span>
                    </div>
                    <div className="tpproduct-details__pera">
                      <p>{Details.description}</p>
                    </div>
                    <div className="tpproduct-details__price mb-30 d-flex gap-2 justify-center">
                      {Details.price_promo === 0 ? (
                        ""
                      ) : (
                        <span>{Details.price_promo}Dh</span>
                      )}
                      {Details.price_promo === 0 ? (
                        <span>{Details.price}Dh</span>
                      ) : (
                        <del className="ml-4">{Details.price}Dh</del>
                      )}
                    </div>
                    <div>
                      {Details.price_promo === 0 ? (
                        <span>
                          <img
                            width="20"
                            height="20"
                            src="/assets/img/logo/coins.png"
                            className="mr-10"
                            alt="icon-coins"
                          />{" "}
                          Coins + {Details.price / 2.5} Coins
                        </span>
                      ) : (
                        <span>
                          <img
                            width="20"
                            height="20"
                            src="/assets/img/logo/coins.png"
                            className="mr-10"
                            alt="icon-coins"
                          />{" "}
                          Coins + {Details.price_promo / 2.5} Coins
                        </span>
                      )}
                    </div>
                    {listProdsGroup && listProdsGroup?.length > 0 && (
                      <h3>produits connexes:</h3>
                    )}

                    <div className="w-90 d-flex flex-wrap align-items-center">
                      {listProdsGroup?.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => setSelectedProduct(product.id)}
                        >
                          <div
                            className={`border w-100 ${
                              selectedProduct === product.id
                                ? "border-dark"
                                : "border-0"
                            } rounded p-1`}
                          >
                            <Link
                              href={`/produits/${product.name_by_filtered}`}
                              onClick={(e) => handleLinkClick(e, item)}
                            >
                              <img
                                width="80"
                                height="80"
                                src={product.image}
                                alt={product.meta_image}
                                className="rounded"
                                layout="responsive"
                                objectFit="contain" // or "cover" based on your preference
                              />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      className="mb-2 p-2 d-flex flex-column gap-2 me-2"
                      style={{ width: "90%" }}
                    >
                      <div className="small font-weight-bold">
                        Sélectionnez la taille:
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {renderButtons(myArray, myQuantities, product.type)}
                      </div>
                    </div>

                    <div className="d-flex flex-column justify-content-center align-items-start gap-4">
                      <div className="tpproduct-details__count d-flex flex-column justify-content-center align-items-start gap-4 mb-25">
                        <div className="tpproduct-details__cart ml-10">
                          <button
                            onClick={() => addToCart(Details.id, selectedSize)}
                          >
                            <i className="fal fa-shopping-cart" /> Ajouter au
                            panier
                          </button>
                        </div>
                        <Link href="/checkout">
                          <button
                            className="ml-10 footer-widget__fw-news-btn tpsecondary-btn"
                            onClick={() => addToCart(Details.id, selectedSize)}
                          >
                            Demander maintenant
                            <i className="fal fa-long-arrow-right" />
                          </button>
                        </Link>
                        <div className="tpproduct-details__wishlist">
                          <i
                            className="fal fa-heart"
                            onClick={() =>
                              addToWishlist(Details.id, selectedSize)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="tpproduct-details__information tpproduct-details__categories">
                      <p>Categorie(s):</p>
                      <span>{Details.category_names}</span>
                    </div>
                    <div className="tpproduct-details__information tpproduct-details__tags">
                      <p>Tags:</p>
                      <span>{Details.genre}</span>
                    </div>
                  </div>
                </div>

                <div className="col-lg-2 col-md-5">
                  <div className="tpproduct-details__condation">
                    <ul>
                      <li>
                        <div className="tpproduct-details__condation-item d-flex align-items-center">
                          <div className="tpproduct-details__condation-thumb">
                            <Image
                              width={30}
                              height={30}
                              src="/assets/img/icon/product-det-1.png"
                              alt="services-1"
                              className="tpproduct-details__img-hover"
                            />
                          </div>
                          <div className="tpproduct-details__condation-text">
                            <p>
                              La livraison gratuite s'applique à tous commandes
                              supérieures à 1000 Dh{" "}
                            </p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="tpproduct-details__condation-item d-flex align-items-center">
                          <div className="tpproduct-details__condation-thumb">
                            <Image
                              width={30}
                              height={30}
                              src="/assets/img/icon/product-det-2.png"
                              alt="services-2"
                              className="tpproduct-details__img-hover"
                            />
                          </div>
                          <div className="tpproduct-details__condation-text">
                            <p>Garanti 100%</p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="tpproduct-details__condation-item d-flex align-items-center">
                          <div className="tpproduct-details__condation-thumb">
                            <Image
                              width={30}
                              height={30}
                              src="/assets/img/icon/product-det-3.png"
                              alt="services-3"
                              className="tpproduct-details__img-hover"
                            />
                          </div>
                          <div className="tpproduct-details__condation-text">
                            <p>Retour sous 1 jour si vous changez d'avis </p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* product-details-area-end */}
          {/* related-product-area-start */}
          <MoreCategories
            category={category}
            productSimilaire={productSimilaire}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            handleLinkClick={handleLinkClick}
          />
          <LikedProducts
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            handleLinkClick={handleLinkClick}
          />
        </div>
      </Layout>
    </>
  );
}
// getServerSideProps to fetch data from the Express API
export async function getServerSideProps(context) {
  const { slug } = context.params;
  try {
    const response = await axios.get(
      `${config_url}/api/interface/products/filtered/${slug}`
    );
    const initialData = response?.data[0];

    return {
      props: {
        initialData,
        nameByFiltered: slug,
      },
    };
  } catch (error) {
    console.error("Failed to fetch product:", error);

    return {
      props: {
        initialData: null,
        nameByFiltered: slug,
      },
    };
  }
}

export default DetailsProduct;
