import React, { Fragment, useState } from "react";
import { MdCloudUpload, MdDelete, MdCreate } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";

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
  border: "2px solid #000",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};

function UpdCategory({ closeModal, rowCategory }) {
  const [name, setName] = useState(rowCategory.name);
  const [meta_image, setMetaImage] = useState(rowCategory.meta_image);
  const [image, setImage] = useState(
    `${config_url}/categories/${rowCategory.image}`
  );
  const [fileName, setFileName] = useState("No selected file");

  const [oldImage, setOldImage] = useState(rowCategory.image);
  const [upload_image, setUploadedImage] = useState(false);
  const [file_image, setFileImage] = useState(null);
  const handleChange = async () => {
    const formdata = new FormData();
    formdata.append("image_category", image);
    formdata.append("oldimage", oldImage);
    formdata.append("upload_image", upload_image);
    formdata.append("name", name);

    formdata.append("meta_image", meta_image);

    try {
      const response = await axios.put(
        `${config_url}/api/update-categorie/${rowCategory.id}`,

        formdata,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200)
        toast.success("Changement Category Success !!", {
          position: "top-right",
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleImage = (file) => {
    setUploadedImage(true);
    setImage(file);
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
              Edit Category
            </Typography>
          </div>
          <Divider />
          <div className="mt-4 flex items-center justify-center justify-between">
            <TextField
              id="outlined-basic"
              label="Name Category"
              variant="outlined"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="mt-4 mb-4">
              <TextField
                id="outlined-multiline-static"
                label="Description"
                multiline
                defaultValue={meta_image}
                onChange={(e) => setMetaImage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <div className="mb-[150px]">
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
          </div>
          <Divider />
          <div className="right-0 mt-4 flex">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<MdCreate />}
              onClick={() => handleChange()}
            >
              Edit
            </Button>
          </div>
        </Box>
      </Modal>
      <div></div>
    </Fragment>
  );
}

export default UpdCategory;
