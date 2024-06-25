import React, { useState, Fragment } from "react";
import { useSelector } from "react-redux";
import { config_url } from "../../config";

function DetailsProd() {
  const Detail = useSelector((state) => state.Load);
  const { Col } = Detail;
  const myArray = JSON.parse(Col.nemuro_shoes);

  const imagesArray = JSON.parse(Col.images) || [];
  const validImages = [Col.image, ...imagesArray].filter((image) => image);

  const [images, setImages] = useState({
    img1: `${config_url}/images/${validImages[0]}`,
    img2: `${config_url}/images/${validImages[1] || ""}`,
    img3: `${config_url}/images/${validImages[2] || ""}`,
    img4: `${config_url}/images/${validImages[3] || ""}`,
  });

  const [activeImg, setActiveImage] = useState(images.img1);
  const createButton = (number) => {
    return (
      <button key={number} className="px-2 py-1 border rounded-md text-xs">
        {number} EU
      </button>
    );
  };
  return (
    <Fragment>
      {" "}
      <div className="flex flex-col justify-between lg:flex-row gap-16 lg:items-center">
        <div className="flex flex-col gap-6 lg:w-2/4">
          <img
            src={activeImg}
            alt=""
            className="w-full h-full aspect-square object-cover rounded-xl"
          />
          <div className="flex flex-row justify-between h-24">
            <img
              src={images.img1}
              alt=""
              className="w-24 h-24 rounded-md cursor-pointer"
              onClick={() => setActiveImage(images.img1)}
            />
            <img
              src={images.img2}
              alt=""
              className="w-24 h-24 rounded-md cursor-pointer"
              onClick={() => setActiveImage(images.img2)}
            />
            <img
              src={images.img3}
              alt=""
              className="w-24 h-24 rounded-md cursor-pointer"
              onClick={() => setActiveImage(images.img3)}
            />
            <img
              src={images.img4}
              alt=""
              className="w-24 h-24 rounded-md cursor-pointer"
              onClick={() => setActiveImage(images.img4)}
            />
          </div>
        </div>
        {/* ABOUT */}
        <div className="flex flex-col gap-4 lg:w-2/4">
          <div>
            <span className="text-violet-600 font-semibold">
              <span className="text-black semi-bold">Product:</span> {Col.name}
            </span>
            <div className="text-xl font-bold">
              {" "}
              <span className="text-black semi-bold">Category:</span>{" "}
              {Col.category}
            </div>
            <div className="text-xl font-bold">
              {" "}
              <span className="text-black semi-bold">Status:</span> {Col.status}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md px-4 py-6 flex flex-col">
            <div className="text-xs font-bold mr-4">Tailles</div>
            <div className="grid grid-cols-4 gap-2">
              {myArray.map(createButton)}
            </div>
          </div>

          <p className="text-gray-700">
            <span className="text-black font-bold underline">Description:</span>
            {Col.description}
          </p>

          <p className="mt-4 text-4xl font-bold text-violet-900">
            {Col.price_promo === 0 ? "" : `${Col.price_promo}` + "Dh"}
            {Col.price_promo === 0 ? (
              <span className="mt-4 text-4xl font-bold text-violet-900">
                {Col.prix} Dh
              </span>
            ) : (
              <span className="ml-2 text-xl text-gray-400 line-through">
                {Col.price} Dh
              </span>
            )}
          </p>
        </div>
      </div>
    </Fragment>
  );
}

export default DetailsProd;
