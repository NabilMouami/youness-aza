import React, { useState, Fragment, useEffect } from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { styled } from "@mui/material/styles";
import ClipLoader from "react-spinners/ClipLoader";

import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { config_url } from "../../config";
import SelectOpt from "react-select";

import { toast } from "react-toastify";
import { MdCloudUpload, MdDelete, MdEditDocument, MdAdd } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import { RiCloseLargeFill } from "react-icons/ri";
import UpdCategories from "./UpdCategories";
import UpdGroupProd from "./UpdGroupProd";
import UpdQtyShoes from "./UpdQtyShoes";

function UpdProduit() {
  const Detail = useSelector((state) => state.Load);
  const { Col } = Detail;
  const mySizes = JSON.parse(Col.nemuro_shoes); // Sizes array
  const myQuantities = JSON.parse(Col.qty); // Quantities array

  console.log(mySizes, myQuantities);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [selectVille, setSelectVille] = useState("");
  const [categoryArray, setCategoryArray] = useState(
    Col.category_names.split(", ") || []
  );
  const [showSpinner, setShowSpinner] = useState(true);
  const [type, setSelectType] = useState(Col.type);
  const [genre, setSelectGenre] = useState(Col.genre);
  const [status, setSelectStatus] = useState(Col.status_model);

  const [showSelectCategories, setShowSelectCategories] = useState(false);
  const [showSelectGroupes, setShowSelectGroupes] = useState(false);
  const [group_id, setGroupId] = useState("");

  const [nom, setNom] = useState(Col.name);
  const [productSlug, setProductSlug] = useState(Col.name_by_filtered);

  const [description, setDescription] = useState(Col.description);
  const [prix, setPrix] = useState(Col.price);
  const [prix_promo, setPrixPromo] = useState(Col.price_promo);

  const [out_of_stock, setOut] = useState(Col.out_stock);

  const [image, setImage] = useState(`${Col.image}`);
  const [oldImage, setOldImage] = useState(Col.image);
  const [upload_image, setUploadedImage] = useState(false);
  const [fileName, setFileName] = useState("No selected file");
  const [changer_images, setChangerImages] = useState(false);
  const [changer_categories, setChangerCategories] = useState(false);
  const [changer_groupes, setChangerGroupes] = useState(false);
  const [affectedCategories, setAffectedCategories] = useState([]);
  const [affectedCategoriesIds, setAffectedCategoriesIds] = useState([]);
  console.log(affectedCategoriesIds);

  const [file_image, setFileImage] = useState(null);

  const [selectedFiles, setSelectedFiles] = useState(Col.images);
  useEffect(() => {
    if (affectedCategories) {
      const updatedProductList = affectedCategories?.map((option) => option.id);
      setAffectedCategoriesIds(updatedProductList);
    }
  }, [affectedCategories]);
  const handleUpload = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("image", image);
    formdata.append("oldimage", oldImage);
    formdata.append("upload_image", upload_image);
    formdata.append("nom", nom);
    formdata.append("productSlug", productSlug);
    formdata.append("status", status);
    formdata.append("type", type);
    formdata.append("genre", genre);

    formdata.append("description", description);

    formdata.append("prix", prix);
    formdata.append("prix_promo", prix_promo);
    formdata.append("out_of_stock", out_of_stock);
    formdata.append("category", categoryArray);
    formdata.append("changed_category", changer_categories);
    formdata.append("changed_groupe", changer_groupes);
    formdata.append("groupe_id", group_id);

    formdata.append("affected_categories", affectedCategoriesIds);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 3000); // Change the delay time as needed (3000ms = 3 seconds)

    return () => clearTimeout(timer);
  }, []);
  const removeImage = (filenameToRemove) => {
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
  useEffect(() => {
    axios
      .get(`${config_url}/api/collections`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.error(
            "Invalid data structure received for categories:",
            res.data
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${config_url}/api/groupes`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setGroupes(res.data);
        } else {
          console.error(
            "Invalid data structure received for categories:",
            res.data
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);
  const handleDelete = (chipToDelete) => async () => {
    await setCategoryArray((chips) =>
      chips.filter((chip) => chip !== chipToDelete)
    );
    await setShowSelectCategories(true);
  };
  const convertToSlug = (name) => {
    return name
      .toLowerCase() // Convert to lowercase
      .replace(/ /g, "-") // Replace spaces with hyphens
      .replace(/[^\w-]+/g, ""); // Remove special characters
  };
  const handleNameChange = (e) => {
    const name = e.target.value;
    setNom(name);
    setProductSlug(convertToSlug(name));
  };
  const handleSelectOutOfStock = (e) => {
    setOut(e.target.value);
  };
  const handleSelectGenre = (e) => {
    setSelectGenre(e.target.value);
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
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSelectStatus = (e) => {
    setSelectStatus(e.target.value);
  };
  const handleSelectType = (e) => {
    setSelectType(e.target.value);
  };

  //Options Colections
  const selOptions = [];
  const ids = categories?.map((o) => o.name);
  const filtered = categories?.filter(
    ({ name }, index) => !ids?.includes(name, index + 1)
  );

  for (let i = 0; i < filtered.length; i++) {
    if (filtered.length > 0) {
      selOptions.push({
        value: filtered[i].name,
        label: filtered[i].name,
        id: filtered[i].id,
      });
    }
  }

  //Options Groupes
  const selOptionsGroupes = [];
  const id_groupes = groupes?.map((o) => o.name);
  const filtered_groupe = groupes?.filter(
    ({ name }, index) => !id_groupes?.includes(name, index + 1)
  );

  for (let i = 0; i < filtered_groupe.length; i++) {
    if (filtered.length > 0) {
      selOptionsGroupes.push({
        value: filtered_groupe[i].name,
        label: filtered_groupe[i].name,
        id: filtered_groupe[i].id,
      });
    }
  }
  const handle = (e) => {
    const value = e.map((option) => option.label);
    console.log("values of categories selected: " + value);

    setSelectVille(value);
    setSelectedCategories(e);
    setChangerCategories(true);
    setAffectedCategories(e);
  };

  const handleGroupe = (e) => {
    console.log(e.id);
    setChangerGroupes(true);

    setGroupId(e.id);
  };

  return (
    <Fragment>
      <div className="page__main">
        <h1>
          Change Information About:{" "}
          <span className="text-red-400 font-sans"> {nom}</span>
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
                onChange={handleNameChange}
                placeholder="Name:"
              />
            </div>
            <div className="w-90 px-3 mb-6 md:mb-0">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product Slug (automatic):
              </label>
              <input
                className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-sky-500"
                type="text"
                value={productSlug}
                readOnly
                placeholder="Generated product slug"
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
            <Box sx={{ ml: 2, minWidth: 220 }}>
              <FormControl sx={{ minWidth: 220 }}>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Status:
                </label>{" "}
                <Select value={status} onChange={handleSelectStatus}>
                  <MenuItem value="old">Old</MenuItem>

                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="latest-arrival">Latest Arrival</MenuItem>
                  <MenuItem value="top-product">Top Products</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ ml: 2, minWidth: 220 }}>
              <FormControl sx={{ minWidth: 220 }}>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Type:
                </label>{" "}
                <Select value={type} onChange={handleSelectType}>
                  <MenuItem value="0">Sneakers</MenuItem>
                  <MenuItem value="1">Accessoires</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
          <UpdQtyShoes mySizes={mySizes} myQuantities={myQuantities} />
          <div className="bg-gray-300 rounded-2xl">
            <h1>Collections</h1>
            <div className="flex items-center justify-center gap-4  p-20">
              <div className="flex flex-wrap">
                <div className="flex flex-col gap-4">
                  <Button
                    onClick={() => setShowSelectCategories(true)}
                    variant="contained"
                    endIcon={<MdAdd />}
                  >
                    Affect Collection(s) To Product
                  </Button>
                  {showSelectCategories && (
                    <div>
                      {showSpinner ? (
                        <ClipLoader loading={showSpinner} size={20} />
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-black font-bold">
                            Collections :
                          </span>
                          <SelectOpt
                            className="Options"
                            options={selOptions}
                            isMulti
                            onChange={handle}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <UpdCategories affectedCategories={affectedCategories} />
            </div>
          </div>

          <div className="bg-gray-300 rounded-2xl">
            <h1>Groupes Product</h1>
            <div className="flex items-center justify-center gap-4  p-20">
              <div className="flex flex-wrap">
                <div className="flex flex-col gap-4">
                  <Button
                    onClick={() => setShowSelectGroupes(true)}
                    variant="contained"
                    endIcon={<MdAdd />}
                  >
                    Affect Product To Group
                  </Button>
                  {showSelectGroupes && (
                    <div>
                      {showSpinner ? (
                        <ClipLoader loading={showSpinner} size={20} />
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-black font-bold">
                            Groupes :
                          </span>
                          <SelectOpt
                            className="Options"
                            options={selOptionsGroupes}
                            onChange={handleGroupe}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <UpdGroupProd />
            </div>
          </div>
          <div className="flex justify-center items-center">
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
          <div className="flex justify-center items-center">
            <div className="w-90 flex flex-col items-center px-3">
              <label className="ml-12 mb-2 block text-lg font-bold text-black">
                Genre:
              </label>

              <select
                className="ml-10"
                value={genre}
                onChange={handleSelectGenre}
              >
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="enfants">Enfant</option>
                <option value="homme, femme">Homme & Femme</option>
                <option value="femme, homme">Femme & Homme</option>
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
                    className="w-[150px] h-[150px] rounded-full border-2 border-gray-400"
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
                      Oui Affected Image
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
                          src={`${file}`}
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
