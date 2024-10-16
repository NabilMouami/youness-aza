import React, { useState, Fragment, useEffect } from "react";
import Box from "@mui/material/Box";
import { config_url } from "../../config";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { toast } from "react-toastify";
import SelectOpt from "react-select";

import {
  MdCloudUpload,
  MdDelete,
  MdOutlineFilter,
  MdOutlineSend,
  MdDeleteForever,
} from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import { RiCloseLargeFill } from "react-icons/ri";

function AddProduit() {
  const [selectedGenres, setSelectedGenres] = useState("");
  console.log(selectedGenres);
  const [type, setSelectType] = useState("0");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [status, setSelectStatus] = useState("old");
  const [qty, setQty] = useState(0);
  const [nom, setNom] = useState("");
  const [productSlug, setProductSlug] = useState("");

  const [prix, setPrix] = useState("");
  const [prix_promo, setPrixPromo] = useState(0);
  const [items, setItems] = useState([]); // Array to store list items
  const valueStrings = items.map((item) => `"${item.value}"`);
  const quantityStrings = items.map((item) => `"${item.quantity}"`);

  // Join the strings with commas and enclose the entire array in brackets
  const size_shoes = `[ ${valueStrings.join(",")} ]`;
  const size_quantity = `[ ${quantityStrings.join(",")} ]`;
  const [description, setDescription] = useState("");

  const [image, setImage] = useState("");
  const [meta_image, setMetaImage] = useState("");
  const [fileName, setFileName] = useState("No selected file");

  const [selectedFiles, setSelectedFiles] = useState([]);

  const [selectVille, setSelectVille] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleUpload = async (e) => {
    e.preventDefault();

    setLoading(true); // Set loading before starting the request

    const formdata = new FormData();
    formdata.append("image", image);
    formdata.append("nom", nom);
    formdata.append("productSlug", productSlug);
    formdata.append("description", description);
    formdata.append("prix", prix);
    formdata.append("prix_promo", prix_promo || ""); // Ensure a value is passed, empty or not
    formdata.append("categories", JSON.stringify(selectedCategories));
    formdata.append("category", category);
    formdata.append("status", status);
    formdata.append("genre", selectedGenres);
    formdata.append("type", type);
    formdata.append("qty", qty);
    formdata.append("size_shoes", size_shoes);
    formdata.append("size_quantity", size_quantity);
    formdata.append("meta_image", meta_image);

    selectedFiles.forEach((file, index) => {
      if (file) {
        // Only append valid files
        formdata.append("images", file);
        console.log(`File ${index}:`, file); // Debugging log
      }
    });

    try {
      const response = await axios.post(
        `${config_url}/api/create-prod`,
        formdata,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.status === 200) {
        toast.success("Ajoute Produit Success !!", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to upload the product. Check console for details.", {
        position: "top-right",
      });
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
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
  const genres = [
    { value: "homme", label: "Homme" },
    { value: "femme", label: "Femme" },
    { value: "enfants", label: "Enfants" },
  ];
  const handleChangeGenres = (selectedOptions) => {
    const selectedValues = selectedOptions
      .map((option) => option.value)
      .join(", ");
    setSelectedGenres(selectedValues);
  };
  const handleFileChange = (event) => {
    const newImage = event.target.files[0]; // Get the first selected file

    if (newImage) {
      // Check if a file is selected
      setSelectedFiles([...selectedFiles, newImage]);
    }
  };

  const removeImage = (filenameToRemove) => {
    setSelectedFiles(() =>
      Array.from(selectedFiles).filter((file) => file.name !== filenameToRemove)
    );
  };
  const handleInputChange = (event, index) => {
    const newItems = [...items];
    newItems[index].value = event.target.value;
    setItems(newItems);
  };

  const handleSelectStatus = (e) => {
    setSelectStatus(e.target.value);
  };
  const handleSelectType = (e) => {
    setSelectType(e.target.value);
  };

  // Add List Of Numero Shoes (Sizes)
  const addListItem = () => {
    setItems((prevItems) => [...prevItems, { id: Math.random(), value: "" }]);
  };
  // Handler for quantity input change
  const handleQuantityChange = (event, index) => {
    const newItems = [...items];
    newItems[index].quantity = event.target.value;
    setItems(newItems);
  };

  // Handler for removing list item
  const removeListItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

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

  const handle = (e) => {
    console.log(e);
    const value = e.map((option) => option.label);
    setSelectVille(value);
    setSelectedCategories(e);
    const selectedValues = e.map((option) => option.value).join(", ");
    setCategory(selectedValues);
  };

  return (
    <Fragment>
      <div className="page__main">
        <button
          type="button"
          className="relative w-full flex justify-center mb-10 items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize bg-cyan-500 rounded-md  focus:outline-none   transition duration-300 transform active:scale-95 ease-in-out"
        >
          <span className="pl-2 mx-1">Page Of Add Pruduct</span>
        </button>

        <form
          className="mb-8 p-8 text-xl w-full bg-white rounded-3xl"
          onSubmit={handleUpload}
        >
          <h1 className="text-center">Information sur Produit:</h1>

          <div className="bg-gray-200 p-3 rounded-2xl flex flex-wrap -mx-3 mb-6 mx-auto max-w-[1200px]">
            <div className="w-90 px-3 mb-6 md:mb-0">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nom:
              </label>
              <input
                className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-sky-500"
                type="text"
                name="nom"
                onChange={handleNameChange}
                placeholder="Nom:"
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
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Prix:
              </label>
              <input
                className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none  focus:border-sky-500"
                type="number"
                onChange={(e) => setPrix(e.target.value)}
                placeholder="Prix:"
              />
            </div>
            <div className="w-90 px-3 mb-6 md:mb-0">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Prix Promo:
              </label>
              <input
                className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none  focus:border-sky-500"
                type="number"
                onChange={(e) => setPrixPromo(e.target.value)}
                placeholder="Prix Promo:"
              />
            </div>

            <div className="flex flex-col items-center">
              <span className="text-black font-bold">Collections :</span>
              <SelectOpt
                className="Options"
                options={selOptions}
                isMulti
                onChange={handle}
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-black font-bold">Genre(s) :</span>
              <SelectOpt
                className="Options"
                options={genres}
                isMulti
                onChange={handleChangeGenres}
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

            <div className="w-full font-semibold bg-white rounded-2xl h-auto mt-4 p-2 grid-1 grid-col-1 gap-10 items-center">
              <div className="w-100 flex items-center justify-center space-around gap-4 mt-4 mb-4">
                <h2 className="w-70">List Size Shoes:</h2>
                <span
                  className="bg-sky-400 w-[30%] text-white mt-4 mb-4 p-2 rounded-2xl outline-none cursor"
                  onClick={addListItem}
                >
                  Add Size
                </span>
              </div>

              <ul>
                {items.map((item, index) => (
                  <li key={item.id} className="flex items-center space-between">
                    <input
                      type="text"
                      className="bg-gray-200 border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-sky-500"
                      value={item.value}
                      onChange={(event) => handleInputChange(event, index)}
                      placeholder={`Size ${index + 1}`}
                    />
                    <input
                      type="number"
                      className="bg-gray-200 border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-sky-500 ml-2"
                      value={item.quantity}
                      onChange={(event) => handleQuantityChange(event, index)}
                      placeholder="Quantity"
                    />
                    <MdDeleteForever
                      size={50}
                      className="text-red-500 ml-2"
                      onClick={() => removeListItem(index)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <hr className="border-4 rounded-3xl border-sky-800 border-dashed" />

          <h1 className="text-center text-2xl font-semibold">Upload Medias</h1>

          <div className="flex flex-wrap -mx-3 mb-6 mx-auto max-w-[1200px]">
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
                      setImage(files[0]);
                    }
                  }}
                />

                {image ? (
                  <img
                    className="w-[150px] h-[150px] rounded-full border-2 border-gray-400"
                    src={image && URL.createObjectURL(image)}
                    width={150}
                    height={150}
                    alt={fileName}
                  />
                ) : (
                  <>
                    <MdCloudUpload color="#1475cf" size={60} />
                    <p>Principal Image to upload</p>
                  </>
                )}
              </div>
              <div className="w-90 px-3 mb-6 md:mb-0">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Meta Image:
                </label>
                <input
                  className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-sky-500"
                  type="text"
                  defaultValue={meta_image}
                  onChange={(e) => setMetaImage(e.target.value)}
                  placeholder="Meta Image:"
                />
              </div>
              <section className="uploaded-row">
                <AiFillFileImage color="#1475cf" />
                <span className="upload-content">
                  {fileName} -
                  <MdDelete
                    onClick={() => {
                      setFileName("No selected File");
                      setMetaImage("");
                      setImage(null);
                    }}
                  />
                </span>
              </section>
              <div>
                <div
                  className="forms"
                  onClick={() =>
                    document.querySelector(".input-fields").click()
                  }
                >
                  <input
                    className="input-fields"
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <>
                    <MdOutlineFilter color="#1475cf" size={60} />
                    <p>Browse Images to upload</p>
                  </>
                </div>
                {selectedFiles &&
                  Array.from(selectedFiles).map((file, index) => (
                    <div
                      key={index}
                      style={{ display: "inline-block", position: "relative" }}
                    >
                      <img
                        src={file && URL.createObjectURL(file)}
                        alt={`Image ${index}`}
                        className="rounded-xl w-30 h-20 m-10"
                      />
                      <RiCloseLargeFill
                        onClick={() => removeImage(file.name)}
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
              onChange={(e) => setDescription(e.target.value)}
              className="resize rounded-md border-2 border-solid border-gray-200 focus:outline-none focus:border-sky-400"
              rows="10"
              cols="70"
            ></textarea>
          </div>

          <button
            className="flex items-center gap-2 ml-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            type="submit"
          >
            {loading && <i className="fa fa-refresh fa-spin"></i>}
            <span>Save</span>
            <span>
              <MdOutlineSend />
            </span>
          </button>
        </form>
      </div>
    </Fragment>
  );
}

export default AddProduit;
