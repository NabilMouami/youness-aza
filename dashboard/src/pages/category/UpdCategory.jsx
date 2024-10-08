import React, { Fragment, useState } from "react";
import { MdCloudUpload, MdDelete, MdCreate } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import ClipLoader from "react-spinners/ClipLoader";
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

function UpdCategory({ closeModal, rowCategory, collections, setCategories }) {
  const [name, setName] = useState(rowCategory.name);
  const [collectionName, setCollectionName] = useState(
    rowCategory.collection_name
  );
  const [meta_image, setMetaImage] = useState(rowCategory.meta_image);
  const [meta_description, setMetaImageDescription] = useState(
    rowCategory.meta_description
  );

  const [image, setImage] = useState(`${rowCategory.image}`);
  const [fileName, setFileName] = useState("No selected file");

  const [oldImage, setOldImage] = useState(rowCategory.image);
  const [upload_image, setUploadedImage] = useState(false);
  const [collectionId, setCollectionId] = useState(rowCategory.collect_id);
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    const formdata = new FormData();
    formdata.append("image_category", image);
    formdata.append("oldimage", oldImage);
    formdata.append("upload_image", upload_image);
    formdata.append("name", name);

    formdata.append("meta_image", meta_image);
    formdata.append("meta_description", meta_description);
    formdata.append("collection_id", collectionId);

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

      if (response.status === 200) {
        const updatedBlog = response.data;
        setCategories((prevCategories) =>
          prevCategories.map((categorie) =>
            categorie.id === rowCategory.id ? updatedBlog : categorie
          )
        );

        toast.success("Changement Categorie Success !!", {
          position: "top-right",
        });
        closeModal();
      }
    } catch (error) {
      console.error("Error:", error);
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
    setName(e.name);
    setMetaImage(e.meta_image);
    setCollectionId(e.id);
    setCollectionName(e.name);
    setLoading(true);
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

          <div className="flex items-center justify-center gap-10">
            <div>
              <span>Category:</span>
              <h3 className="font-bold text-black">{name}</h3>
            </div>
            <div>
              <span>Collection Name:</span>
              <h3 className="font-bold text-black">{collectionName}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center justify-between">
            <div className="flex flex-col items-center">
              <span className="text-black font-bold">
                Selectez Collection :
              </span>
              <SelectOpt
                className="Options"
                options={selOptions}
                onChange={handle}
              />
            </div>
            <div className="mt-4 mb-4">
              <TextField
                id="outlined-multiline-static"
                label="Meta Image"
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

export default UpdCategory;
