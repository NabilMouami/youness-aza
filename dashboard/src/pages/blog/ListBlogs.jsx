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
import UpdBlog from "./UpdBlog";

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

function ListBlogs() {
  const [blogs, setBlogs] = useState([]);
  console.log(blogs);
  const [collections, setCollections] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowCategory, setRowCategory] = useState({});
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    axios
      .get(`${config_url}/api/blogs`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setBlogs(res.data);
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

  const deleteCategory = (id, image) => {
    axios.post(`${config_url}/api/blog/${id}`, { image: image }).then(() => {
      setBlogs(blogs.filter((row) => row.id !== id));
    });
  };
  function popup(id, image) {
    Swal.fire({
      title: "Êtes vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, supprimez Blog",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategory(id, image);
        Swal.fire("Supprimé!", "Blog a été supprimé.", "success");
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
        <UpdBlog
          closeModal={closeModal}
          rowCategory={rowCategory}
          collections={collections}
          blogs={blogs}
          setBlogs={setBlogs}
        />
      )}{" "}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img src={`${config_url}/blogs/${image}`} />
        </Box>
      </Modal>
      <div className="mt-10">
        <Link to="/app/ajoute-blog">
          <Fab variant="extended">
            <RiAddCircleLine sx={{ mr: 1 }} size={20} />
            Add Blog
          </Fab>
        </Link>
        <div className="container mx-auto my-8">
          <table className="table-auto min-w-full border-collapse border border-gray-300 rounded-2xl overflow-hidden">
            <thead>
              <tr className="text-black">
                <th className="py-2 px-4 border border-gray-300 bg-gray-200">
                  Blog Title{" "}
                </th>
                <th className="py-2 px-4 border border-gray-300 bg-gray-200">
                  Collection{" "}
                </th>
                <th className="py-2 px-4 border border-gray-300 bg-gray-200">
                  Date Creation{" "}
                </th>
                <th className="py-2 px-4 border border-gray-300 bg-gray-200">
                  Blog Image
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
              {blogs?.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.title}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.name}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.date_created}
                  </td>
                  <td className="flex items-center justify-center py-2 px-4 border border-gray-300">
                    <img
                      src={`${config_url}/blogs/${item.image}`}
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
                          popup(item.id, item.image);
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

export default ListBlogs;
