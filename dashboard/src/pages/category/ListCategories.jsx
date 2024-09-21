import React, { Fragment, useState, useEffect } from "react";
import Fab from "@mui/material/Fab";

import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { config_url } from "../../config";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";

import {
  RiAddCircleFill,
  RiDeleteBin6Fill,
  RiAddBoxLine,
  RiAddCircleLine,
  RiEdit2Line,
  RiEyeOffLine,
  RiEyeLine,
  RiCheckDoubleFill,
  RiCloseLargeFill,
} from "react-icons/ri";
import { MdCloudUpload, MdDelete, MdOutlineSend } from "react-icons/md";

import { Tooltip } from "@mui/material";
import SelectOpt from "react-select";
import UpdCategory from "./UpdCategory";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function ListCategories() {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowCategory, setRowCategory] = useState({});
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("No selected file");
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);

  const [image, setImage] = useState("");
  const [image_categoty, setImageCategory] = useState("");

  const [name_category, setName] = useState("");
  const [meta_image_category, setMetaImage] = useState("");
  const [meta_image_description, setMetadescription] = useState("");
  const [collectionId, setCollectionId] = useState(0);
  const handleUpload = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("image_category", image_categoty);
    formdata.append("name_category", name_category);
    formdata.append("meta_image_category", meta_image_category);
    formdata.append("meta_image_description", meta_image_description);
    formdata.append("collection_id", collectionId);

    try {
      const response = await axios.post(
        `${config_url}/api/create-category`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200)
        toast.success("Ajoute Produit Success !!", {
          position: "top-right",
        });
      console.log(response);
      setImageCategory("");
      setName("");
      const addedCategory = response.data;
      setCategories((prevCategories) => [...prevCategories, addedCategory]);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    axios
      .get(`${config_url}/api/categories`)
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
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 4000); // Change the delay time as needed (3000ms = 3 seconds)

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    axios
      .get(`${config_url}/api/collections`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCollections(res.data);
        } else {
          console.error(
            "Invalid data structure received for categories:",
            res.data
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching collections:", error);
      });
  }, []);

  //Filters

  const selOptions = [];
  const ids = collections?.map((o) => o.name);
  const filtered = collections?.filter(
    ({ name }, index) => !ids?.includes(name, index + 1)
  );

  for (let i = 0; i < filtered.length; i++) {
    if (filtered.length > 0) {
      selOptions.push({
        value: filtered[i].name,
        label: filtered[i].name,
        id: filtered[i].id,
        name: filtered[i].name,
        meta_image: filtered[i].meta_image,
        meta_description: filtered[i].meta_description,
      });
    }
  }
  const handle = (e) => {
    console.log(e);
    setName(e.name);
    setMetaImage(e.meta_image);
    setMetadescription(e.meta_description);
    setCollectionId(e.id);
    setLoading(true);
  };

  const deleteCategory = (id, image) => {
    axios
      .post(`${config_url}/api/categorie/${id}`, { image: image })
      .then(() => {
        setCategories(categories.filter((row) => row.id !== id));
      });
  };
  function popup(id, fname, image) {
    Swal.fire({
      title: "Êtes vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, supprimez Categorie : " + fname + " ",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategory(id, image);
        Swal.fire("Supprimé!", "Category a été supprimé.", "success");
      }
    });
  }
  const handleLoadModalImage = async (image) => {
    await handleOpen();

    await setImage(image);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = (row) => {
    setIsModalOpen(true);
    setRowCategory(row);
  };
  return (
    <Fragment>
      {isModalOpen && (
        <UpdCategory
          closeModal={closeModal}
          rowCategory={rowCategory}
          collections={collections}
          setCategories={setCategories}
        />
      )}{" "}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img src={`${config_url}/categories/${image}`} />
        </Box>
      </Modal>
      <div className="mt-10">
        <div className="flex flex-col items-center">
          <span className="text-black font-bold">Selectez Collections :</span>
          <SelectOpt
            className="Options"
            options={selOptions}
            onChange={handle}
          />
        </div>
        {loading && (
          <div className="mt-10">
            {showSpinner ? (
              <ClipLoader loading={showSpinner} size={40} className="mt-10" />
            ) : (
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
                      setImageCategory(files[0]);
                    }
                  }}
                />

                {image_categoty ? (
                  <img
                    className="w-[150px] h-[150px] rounded-full border-2 border-gray-400"
                    src={image_categoty && URL.createObjectURL(image_categoty)}
                    width={150}
                    height={150}
                    alt={fileName}
                  />
                ) : (
                  <>
                    <MdCloudUpload color="#1475cf" size={60} />
                    <p>Upload Image Categorie For Homepage</p>
                  </>
                )}
              </div>
            )}
            <div className="mt-10">
              <Button variant="contained" onClick={(e) => handleUpload(e)}>
                Add Category
              </Button>
            </div>
          </div>
        )}{" "}
        <div className="container mx-auto my-8">
          <table className="table-auto min-w-full border-collapse border border-gray-300 rounded-2xl overflow-hidden">
            <thead>
              <tr className="text-black">
                <th className="py-2 px-4 border border-gray-300 bg-gray-200">
                  Categorie Name{" "}
                </th>
                <th className="py-2 px-4 border border-gray-300 bg-gray-200">
                  Categorie Image
                </th>
                <th className="py-2 px-4 border border-gray-300 bg-gray-200">
                  Meta Image
                </th>

                <th className="py-2 px-4 border border-gray-300 bg-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.name}
                  </td>
                  <td className="flex items-center justify-center py-2 px-4 border border-gray-300">
                    <img
                      src={`${config_url}/categories/${item.image}`}
                      alt={item.meta_image}
                      className="w-10 h-10"
                      onClick={() => handleLoadModalImage(item.image)}
                    />
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.meta_image}
                  </td>
                  <td className="flex items-center justify-center py-2 px-4 ">
                    <div>
                      <RiDeleteBin6Fill
                        className="collabListDelete"
                        onClick={() => {
                          popup(item.id, item.name, item.image);
                        }}
                      />
                    </div>
                    <div className="flex items-center">
                      <Tooltip title="Change Info Order" placement="top">
                        <div className="mt-2">
                          <RiEdit2Line
                            className="collabListEdit"
                            onClick={() => openModal(item)}
                          />
                        </div>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>{" "}
      </div>
    </Fragment>
  );
}

export default ListCategories;
