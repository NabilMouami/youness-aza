import React, { useState, Fragment, useEffect } from "react";
import { config_url } from "../../config";
import axios from "axios";
import { toast } from "react-toastify";
import {
  MdCloudUpload,
  MdDelete,
  MdOutlineFilter,
  MdOutlineSend,
  MdDeleteForever,
} from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import { RiCloseLargeFill } from "react-icons/ri";

function AddCategory() {
  const [name_category, setName] = useState("");
  const [image_categoty, setImage] = useState("");
  const [meta_image_category, setMetaImage] = useState("");
  const [fileName, setFileName] = useState("No selected file");
  const [loading, setLoading] = useState(false);
  const handleUpload = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("image_category", image_categoty);
    formdata.append("name_category", name_category);
    formdata.append("meta_image_category", meta_image_category);

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
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Fragment>
      <div className="page__main">
        <button
          type="button"
          className="relative w-full flex justify-center mb-10 items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize bg-cyan-500 rounded-md  focus:outline-none   transition duration-300 transform active:scale-95 ease-in-out"
        >
          <span className="pl-2 mx-1">Page Of Add Categorie</span>
        </button>

        <form
          className="mb-8 p-8 text-xl w-full bg-white rounded-3xl"
          onSubmit={handleUpload}
        >
          <h1 className="text-center">Information sur Categorie:</h1>

          <div className="bg-gray-200 p-3 rounded-2xl flex flex-wrap -mx-3 mb-6 mx-auto max-w-[1200px]">
            <div className="w-90 px-3 mb-6 md:mb-0">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nom:
              </label>
              <input
                className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-sky-500"
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom:"
              />
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

                {image_categoty ? (
                  <img
                    className="rounded-full"
                    src={image_categoty && URL.createObjectURL(image_categoty)}
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
            </div>
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

export default AddCategory;
