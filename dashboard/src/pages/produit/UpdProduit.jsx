import React, { useState, Fragment } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { config_url } from "../../config";

import { toast } from "react-toastify";
import {
  MdCloudUpload,
  MdDelete,
  MdVideoLibrary,
  MdEditDocument,
} from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import { RiCloseLargeFill } from "react-icons/ri";
function UpdProduit() {
  const Detail = useSelector((state) => state.Load);
  const { Col } = Detail;

  const [category, setSelectCategory] = useState(Col.category);
  const [nom, setNom] = useState(Col.name);
  const [description, setDescription] = useState(Col.description);
  const [prix, setPrix] = useState(Col.price);
  const [prix_promo, setPrixPromo] = useState(Col.price_promo);

  const [out_of_stock, setOut] = useState(Col.out_stock);

  const [image, setImage] = useState(`${config_url}/images/${Col.image}`);
  const [oldImage, setOldImage] = useState(Col.image);
  const [upload_image, setUploadedImage] = useState(false);
  const [fileName, setFileName] = useState("No selected file");
  const [disable_uploas_images, setDisableImages] = useState(true);
  const [changer_images, setChangerImages] = useState(false);
  const [file_image, setFileImage] = useState(null);

  const [selectedFiles, setSelectedFiles] = useState(Col.images);

  const handleUpload = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("image", image);
    formdata.append("oldimage", oldImage);
    formdata.append("upload_image", upload_image);
    formdata.append("nom", nom);
    formdata.append("description", description);

    formdata.append("prix", prix);
    formdata.append("prix_promo", prix_promo);
    formdata.append("out_of_stock", out_of_stock);
    formdata.append("category", category);

    try {
      const response = await axios.put(
        `${config_url}/api/update-prod/${Col.id}`,

        formdata,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200)
        toast.success("Changement Produit Success !!", {
          position: "top-right",
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const removeImage = (filenameToRemove) => {
    setDisableImages(false);
    const data = JSON.parse(selectedFiles).filter(
      (item) => item !== filenameToRemove
    );
    setSelectedFiles(JSON.stringify(data));
    console.log(typeof JSON.stringify(data));
    axios.put(`${config_url}/api/images/${Col.id}`, {
      image_name: filenameToRemove,
      images: JSON.stringify(data),
    });
  };
  function popupRemove(filename) {
    Swal.fire({
      title: "Êtes vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, supprimez Image",
    }).then((result) => {
      if (result.isConfirmed) {
        removeImage(filename);
        Swal.fire("Supprimé!", "Image a été supprimé.", "success");
      }
    });
  }
  const handleSelectCategory = (e) => {
    setSelectCategory(e.target.value);
  };
  const handleSelectOutOfStock = (e) => {
    setOut(e.target.value);
  };
  const handleImage = (file) => {
    setUploadedImage(true);
    setImage(file);
  };
  const handleImages = async () => {
    console.log(file_image);
    const formdata = new FormData();
    formdata.append("image", file_image);
    formdata.append("images", selectedFiles);
    try {
      const response = await fetch(`${config_url}/api/image/${Col.id}`, {
        method: "PUT",
        body: formdata,
      });
      const result = await response.json();
      setSelectedFiles(result[0]?.images);
      setChangerImages(false);
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Fragment>
      <div className="page__main">
        <h1>
          Change Information About:{" "}
          <span className="text-red-400 font-sans"> {Col.nom}</span>
        </h1>
        <form
          onSubmit={handleUpload}
          className="p-8 text-xl w-full bg-white rounded-3xl"
        >
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-90 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Name:
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                defaultValue={nom}
                name="nom"
                onChange={(e) => setNom(e.target.value)}
                placeholder="Name:"
              />
            </div>
            <div className="w-90 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Price:
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="number"
                step="any"
                defaultValue={Col.price}
                onChange={(e) => setPrix(e.target.value)}
                placeholder="Price:"
              />
            </div>
            <div className="w-90 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Price Promo:
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="number"
                step="any"
                defaultValue={Col.price_promo}
                onChange={(e) => setPrixPromo(e.target.value)}
                placeholder="Price Promo:"
              />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="w-90 flex flex-col items-center px-3">
              <label className="ml-12 mb-2 block text-lg font-bold text-black">
                Category:
              </label>

              <select
                className="ml-10"
                value={category}
                onChange={handleSelectCategory}
              >
                <option value="air-force-1">Air Force 1</option>
                <option value="air-jordan">Air Jordan</option>
                <option value="dunk">Dunk</option>
              </select>
            </div>
            <div className="w-90 flex flex-col items-center px-3">
              <label className="ml-12 mb-2 block text-lg font-bold text-black">
                Out Of Stock:
              </label>

              <select
                className="ml-10"
                value={out_of_stock}
                onChange={handleSelectOutOfStock}
              >
                <option value="1">In Stock</option>
                <option value="0">Out Stock</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6 p-10">
            <div className="grid gap-4">
              <div
                className="form"
                onClick={() => document.querySelector(".input-field").click()}
              >
                <input
                  type="file"
                  className="input-field"
                  hidden
                  onChange={({ target: { files } }) => {
                    files[0] && setFileName(files[0].name);
                    if (files) {
                      handleImage(files[0]);
                    }
                  }}
                />

                {image ? (
                  <img
                    className="rounded-full"
                    src={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                    width={150}
                    height={150}
                    alt={fileName}
                  />
                ) : (
                  <>
                    <MdCloudUpload color="#1475cf" size={60} />
                    <p>Browse Files to upload</p>
                  </>
                )}
              </div>

              <section className="w-90 uploaded-row">
                <AiFillFileImage color="#1475cf" />
                <span className="upload-content">
                  {fileName} -
                  <MdDelete
                    onClick={() => {
                      setFileName("No selected File");
                      setImage(null);
                    }}
                  />
                </span>
              </section>
              <div>
                <div className="flex items-center ">
                  <input
                    className="form"
                    type="file"
                    disabled={disable_uploas_images}
                    onChange={({ target: { files } }) => {
                      if (files) {
                        setFileImage(files[0]);
                        setChangerImages(true);
                      }
                    }}
                  />
                  {changer_images && (
                    <button
                      className="bg-red-500  text-white font-bold py-2 px-4 ml-4 rounded-full"
                      onClick={() => handleImages()}
                    >
                      Oui Changer Image
                    </button>
                  )}
                </div>
                {typeof selectedFiles === "string"
                  ? JSON.parse(selectedFiles).map((file, index) => (
                      <div
                        key={index}
                        style={{
                          display: "inline-block",
                          position: "relative",
                        }}
                      >
                        <img
                          src={`${config_url}/images/${file}`}
                          alt={`Image ${index}`}
                          className="rounded-2xl w-40 h-40 m-10"
                        />
                        <RiCloseLargeFill
                          onClick={() => popupRemove(file)}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            height: "60px",
                            width: "60px",
                            background: "transparent",
                            border: "none",
                            color: "red",
                            cursor: "pointer",
                            padding: "5px",
                          }}
                        />
                      </div>
                    ))
                  : Array.from(selectedFiles).map((file, index) => (
                      <div
                        key={index}
                        style={{
                          display: "inline-block",
                          position: "relative",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Image ${index}`}
                          style={{
                            width: "200px",
                            height: "auto",
                            margin: "10px",
                          }}
                        />
                        <RiCloseLargeFill
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            height: "60px",
                            width: "60px",
                            background: "transparent",
                            border: "none",
                            color: "red",
                            cursor: "pointer",
                            padding: "5px",
                          }}
                        />
                      </div>
                    ))}
              </div>
            </div>
          </div>
          <hr className="border-4 rounded-3xl border-sky-800 border-dashed" />

          <h1 className="text-center">Information sur Produit:</h1>

          <div className="ml-10 w-90">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Description De Produit:
            </label>{" "}
            <textarea
              type="text"
              defaultValue={Col.description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize rounded-md border-2 border-solid border-gray-200 focus:outline-none focus:border-sky-400"
              rows="10"
              cols="70"
            ></textarea>
          </div>

          <button
            className="flex items-center gap-2 bg-green-500 hover:bg-white hover:text-green-400 hover:border-dashed hover:border-4 text-white font-bold py-2 px-4 rounded-full"
            type="submit"
          >
            <span>Change</span>
            <span>
              <MdEditDocument />
            </span>
          </button>
        </form>
      </div>
    </Fragment>
  );
}

export default UpdProduit;
