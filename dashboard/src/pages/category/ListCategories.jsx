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
import { Tooltip } from "@mui/material";
import SelectOpt from "react-select";

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
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = useState("");
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

  const deleteCategory = (id, image) => {
    axios
      .post(`${config_url}/api/categories/${id}`, { image: image })
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
  return (
    <Fragment>
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
        <Fab variant="extended">
          <RiAddCircleLine sx={{ mr: 1 }} size={20} />
          Add Category
        </Fab>
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
                  <td className="py-2 px-4 border border-gray-300">
                    <div>
                      <RiDeleteBin6Fill
                        className="collabListDelete"
                        onClick={() => {
                          popup(item.id, item.name, item.image);
                        }}
                      />
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
