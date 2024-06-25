"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAddItemToCart, setOpenCart } from "@/redux/slices/CartSlice";
import ReactImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { store } from "@/lib/store";
import { toast } from "react-toastify";
import { FaMinus, FaPlus } from "react-icons/fa6";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "react-image-gallery/styles/css/image-gallery.css";

import axios from "axios";

function ProductPage() {
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState<string>();
  const [existingProduct, setExistingProduct] = useState<any | null>(null);

  const dispatch = useDispatch();
  const config_url = `http://localhost:5000`;
  const { addToCart, cartProduct, decreaseQuantity } = store();

  useEffect(() => {
    const pathname = window.location.pathname; // Example: "/product/3"
    const id = pathname.split("/")[2]; // Extracts "3" from the pathname
    console.log("Current Product ID:", id);

    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/interface/products/${parseInt(id)}`
        );
        console.log("API Response:", response.data);

        const productData: any = response?.data[0];
        console.log("Product Data:", productData);

        setProduct(productData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, []); // Only run once on component mount

  const handleAddToCart = () => {
    if (product && size) {
      addToCart(product, size);
      toast.success(`${product?.name.substring(0, 10)} added successfully!`);
    } else {
      console.error("Product is undefined or size is not selected");
    }
  };

  const handleDeleteProduct = () => {
    if (existingProduct) {
      if (existingProduct?.quantity > 1) {
        decreaseQuantity(existingProduct?.id);
        toast.success(
          `${product?.name.substring(0, 10)} decreased successfully!`
        );
      } else {
        toast.error("You cannot decrease less than 1");
      }
    } else {
      if (product) {
        decreaseQuantity(product?.id);
        toast.success(
          `${product?.name.substring(0, 10)} decreased successfully!`
        );
      }
    }
  };

  useEffect(() => {
    const availableItem = cartProduct.find(
      (item: any) => item?.id === product?.id
    );
    setExistingProduct(availableItem || null);
  }, [product, cartProduct]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const myArray = JSON.parse(product.nemuro_shoes);
  const imagesArray = JSON.parse(product.images) || [];
  const validImages = [product.image, ...imagesArray].filter((image) => image);

  const productDetailItem = {
    images: validImages.map((image) => ({
      original: `${config_url}/images/${image}`,
      thumbnail: `${config_url}/images/${image}`,
    })),
  };

  const renderImage = (item: any) => (
    <Zoom>
      <img src={item.original} alt={item.description} />
    </Zoom>
  );

  const createButton = (number: string) => (
    <button
      key={number}
      onClick={() => setSize(number)}
      className="px-4 py-4 border rounded-4xl text-xl"
    >
      {number} EU
    </button>
  );

  return (
    <div>
      <section className="container flex-grow mx-auto max-w-[1200px] py-5 lg:grid lg:grid-cols-2 lg:py-10">
        <div className="container mx-auto px-4">
          <ReactImageGallery
            showFullscreenButton={false}
            showPlayButton={false}
            renderItem={renderImage}
            autoPlay={true}
            lazyLoad={true}
            items={productDetailItem.images}
          />
        </div>
        <div className="mx-auto mt-10 px-5 lg:px-5">
          <h2 className="flex-start pt-3 text-2xl font-bold lg:pt-0">
            {product.name}
          </h2>
          <div className="mt-1"></div>
          <p className="mt-4 text-4xl font-bold text-violet-900">
            {product.price_promo === 0 ? "" : `${product.price_promo} Dh`}
            {product.price_promo === 0 ? (
              <span className="mt-4 text-4xl font-bold text-violet-900">
                {product.price} Dh
              </span>
            ) : (
              <span className="ml-2 text-xl text-gray-400 line-through">
                {product.price} Dh
              </span>
            )}
          </p>
          <div className=" px-4 py-6 flex flex-col gap-4">
            <div className="text-xl font-bold mr-4">Tailles</div>
            <div className="grid grid-cols-4 gap-2">
              {myArray.map(createButton)}
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 p-4">
            {existingProduct ? (
              <div className="flex self-center items-center justify-center gap-2">
                <button
                  onClick={handleDeleteProduct}
                  className="bg-[#f7f7f7] text-black p-2 border-[1px] border-gray-200 hover:border-skyText rounded-full text-base hover:bg-white duration-200 cursor-pointer"
                >
                  <FaMinus />
                </button>
                <p className="text-base font-semibold w-10 text-center">
                  {existingProduct?.quantity}
                </p>
                <button
                  onClick={handleAddToCart}
                  className="bg-[#f7f7f7] text-black p-2 border-[1px] border-gray-200 hover:border-skyText rounded-full text-base hover:bg-white duration-200 cursor-pointer"
                >
                  <FaPlus />
                </button>
              </div>
            ) : (
              <button onClick={handleAddToCart}>Add to cart</button>
            )}
            <button className="border border-black text-black w-full py-3 text-center font-medium">
              Add to cart
            </button>

            <button className="bg-black text-white w-full py-3 text-center font-medium">
              Buy it now
            </button>
          </div>
          <p className="pt-5 text-sm leading-5 text-gray-500">
            {product.description}
          </p>
        </div>
      </section>
    </div>
  );
}

export default ProductPage;
