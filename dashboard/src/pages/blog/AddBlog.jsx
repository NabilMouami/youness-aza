import React, { useState, Fragment, useEffect } from "react";
import { config_url } from "../../config";
import axios from "axios";
import SelectOpt from "react-select";

import { toast } from "react-toastify";
import { MdCloudUpload, MdDelete, MdOutlineSend } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";

function AddBlog() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [category_id, setCategoryId] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  console.log(selectedDate);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image_blog, setImage] = useState("");
  const [meta_image_blog, setMetaImage] = useState("");
  const [fileName, setFileName] = useState("No selected file");
  const [loading, setLoading] = useState(false);
  const handleUpload = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("image_blog", image_blog);
    formdata.append("title", title);
    formdata.append("meta_image_blog", meta_image_blog);
    formdata.append("description", description);
    formdata.append("date_creation", selectedDate);
    formdata.append("categoryId", category_id);

    try {
      const response = await axios.post(
        `${config_url}/api/create-blog`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200)
        toast.success("Ajoute Blog Success !!", {
          position: "top-right",
        });
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
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
        console.error("Error fetching collections:", error);
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
    console.log(e.id);
    console.log(e);
    setCategory(e.value);
    setCategoryId(e.id);
  };

  return (
    <Fragment>
      <div className="page__main">
        <button
          type="button"
          className="relative w-full flex justify-center mb-10 items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize bg-cyan-500 rounded-md  focus:outline-none   transition duration-300 transform active:scale-95 ease-in-out"
        >
          <span className="pl-2 mx-1">Page Of Add Blog</span>
        </button>

        <form
          className="mb-8 p-8 text-xl w-full bg-white rounded-3xl"
          onSubmit={handleUpload}
        >
          <h1 className="text-center">Information sur Blog:</h1>

          <div className="bg-gray-200 p-3 rounded-2xl flex flex-wrap -mx-3 mb-6 mx-auto max-w-[1200px]">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Title:
              </label>
              <input
                className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-sky-500"
                type="text"
                name="title"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title:"
              />
            </div>
          </div>
          <div className="ml-10 w-90">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Description De Blog:
            </label>{" "}
            <textarea
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              className="resize rounded-md border-2 border-solid border-gray-200 focus:outline-none focus:border-sky-400"
              rows="10"
              cols="70"
            ></textarea>
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

                {image_blog ? (
                  <img
                    className="w-[150px] h-[150px] rounded-full border-2 border-gray-400"
                    src={image_blog && URL.createObjectURL(image_blog)}
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
            <div className="flex flex-col items-center">
              <span className="text-black font-bold">Collection :</span>
              <SelectOpt
                className="Options"
                options={selOptions}
                onChange={handle}
              />
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

export default AddBlog;
