import React, { Fragment, useState } from "react";
import { MdCloudUpload, MdDelete, MdCreate } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import SelectOpt from "react-select";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { config_url } from "../../config";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  height: "90vh",

  border: "2px solid #000",
  borderRadius: "12px",
  boxShadow: 24,
  overflowY: "scroll", // This will add a vertical scrollbar

  p: 4,
};
function UpdBlog({ closeModal, rowCategory, collections, blogs, setBlogs }) {
  const [title, setTitle] = useState(rowCategory.title);
  const [meta_image, setMetaImage] = useState(rowCategory.meta_image);
  const [description, setDescription] = useState(rowCategory.description);
  const [collectionId, setCollectionId] = useState(
    rowCategory.categorie_blog_id
  );
  const [collectionName, setCollectionName] = useState(rowCategory.name);
  const [selectedDate, setSelectedDate] = useState(rowCategory.date_created);

  const [image, setImage] = useState(
    `${config_url}/blogs/${rowCategory.image}`
  );
  const [fileName, setFileName] = useState("No selected file");

  const [oldImage, setOldImage] = useState(rowCategory.image);
  const [upload_image, setUploadedImage] = useState(false);
  const handleChange = async () => {
    const formdata = new FormData();
    formdata.append("image_blog", image);
    formdata.append("oldimage", oldImage);
    formdata.append("upload_image", upload_image);
    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("date_created", selectedDate);
    formdata.append("meta_image", meta_image);
    formdata.append("collection_id", collectionId);

    try {
      const response = await axios.put(
        `${config_url}/api/update-blog/${rowCategory.id}`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        // Assuming `response.data` contains the updated blog object
        const updatedBlog = response.data;
        console.log(updatedBlog);
        // Update the blogs array using setBlogs
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog.id === rowCategory.id ? updatedBlog : blog
          )
        );

        toast.success("Changement Blog Success !!", {
          position: "top-right",
        });
        closeModal();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors de la mise à jour du blog", {
        position: "top-right",
      });
    }
  };

  const handleImage = (file) => {
    setUploadedImage(true);
    setImage(file);
  };

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
    setMetaImage(e.meta_image);
    setCollectionId(e.id);
    setCollectionName(e.name);
  };

  return (
    <Fragment>
      <Modal
        open={true} // Modal is controlled by parent component
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="w-full bg-gray-100 p-2 mb-4">
            <Typography variant="h5" gutterBottom>
              Edit Blog
            </Typography>
          </div>
          <Divider />
          <div className="mt-4 flex items-center justify-center justify-between">
            <TextField
              id="outlined-basic"
              label="Title Blog"
              variant="outlined"
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
              multiline
              rows={4}
            />
            <div className="mt-4 mb-4">
              <TextField
                id="outlined-multiline-static"
                label="Meta-Image"
                multiline
                defaultValue={meta_image}
                onChange={(e) => setMetaImage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <label className="mb-2 text-gray-700">Date De Blog:</label>
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="date blog"
              defaultValue={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>{" "}
          <div className="ml-10 w-90">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Description Blog:
            </label>{" "}
            <textarea
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              defaultValue={description}
              className="resize rounded-md border-2 border-solid border-gray-200 focus:outline-none focus:border-sky-400"
              rows="10"
              cols="80"
            ></textarea>
          </div>
          <div className="mb-10">
            <div
              className="form mb-[150px]"
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
          </div>
          <div className="flex items-center justify-center gap-4 font-bold mb-10">
            <span>Collection Related Blog:</span>
            <span className="font-semibold text-red-500">{collectionName}</span>
          </div>
          <div className="flex flex-col items-center mb-10">
            <span className="text-black font-bold">Edit Collection :</span>
            <SelectOpt
              className="Options"
              options={selOptions}
              onChange={handle}
            />
          </div>
          <Divider />
          <div className="right-0 mt-4 flex">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<MdCreate />}
              onClick={() => handleChange()}
            >
              Save
            </Button>
          </div>
        </Box>
      </Modal>
      <div></div>
    </Fragment>
  );
}

export default UpdBlog;
