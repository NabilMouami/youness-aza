import { Fragment, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { config_url } from "../../config";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import Swal from "sweetalert2";
import {
  RiAddCircleFill,
  RiDeleteBin6Fill,
  RiEdit2Line,
  RiEyeOffLine,
  RiCheckDoubleFill,
  RiCloseLargeFill,
} from "react-icons/ri";
import { Tooltip, Typography } from "@mui/material";
import SelectOpt from "react-select";

import { detailsProduct } from "../../slices/detailsProduct";

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
function ListProduits() {
  const [listProds, setListProds] = useState([]);
  const [listFiltred, setListFiltred] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [image, setImage] = useState("");

  const [open, setOpen] = useState(false);

  const [disable_button, setDisable] = useState(true);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  console.log(rowSelectionModel);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`${config_url}/api/products`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then(async (res) => {
        await setListProds(res.data);
        await setListFiltred(res.data);
      });
  }, []);

  useEffect(() => {
    console.log("rowSelectionModel:", rowSelectionModel); // Ensure this logs the correct value
    if (rowSelectionModel.length === 0) {
      setDisable(true);
      console.log("Hamiiiiid - Disable button");
    } else {
      setDisable(false);
      console.log("Hamiiiiid - Enable button");
    }
  }, [rowSelectionModel]);

  const deleteEmployee = (id, image, images) => {
    axios
      .post(`${config_url}/api/product/${id}`, {
        image: image,
        images: images,
      })
      .then(() => {
        setListFiltred(listFiltred.filter((row) => row.id !== id));
      });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLoadModalImage = async (image) => {
    await handleOpen();

    await setImage(image);
  };
  const hideninstock = (id) => {
    axios
      .patch(`${config_url}/api/hiden_in_stock/${id}`, {
        hiden_in_stock: 1,
      })
      .then(() => {
        toast.success("Hiden In Stock Product !!", {
          position: "top-right",
        });
        setTimeout(() => {
          window.location.reload(false);
        }, "4000");
      });
  };
  function popup(id, fname, image, images) {
    Swal.fire({
      title: "Êtes vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, supprimez " + fname + " ",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEmployee(id, image, images);
        Swal.fire("Supprimé!", "Produit a été supprimé.", "success");
      }
    });
  }
  function HidenInStock(id, fname) {
    Swal.fire({
      title: "Êtes vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,

      confirmButtonColor: "#D2691E",
      cancelButtonColor: "#d33",
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, Hiden In Stock " + fname + " ",
    }).then((willDelete) => {
      if (willDelete.isConfirmed) {
        Swal.fire("Produit " + fname + " est en Hiden In Stock", {
          icon: "success",
        });
        hideninstock(id);
      } else {
        Swal.fire("product en stock!");
      }
    });
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const collectionIds = selectedCollections.map(
      (collection) => collection.id
    );

    try {
      await axios.post(`${config_url}/api/add-products-to-collections`, {
        prd_ids: rowSelectionModel, // Array of product IDs
        collection_ids: collectionIds, // Array of selected collection IDs
      });

      alert("Products added to collections successfully!");
    } catch (error) {
      console.error("Error adding products to collections:", error);
    }
  };

  const details = (dts) => {
    dispatch(detailsProduct(dts));
    navigate("/app/changer-produit/" + dts.id);
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

  //Filters

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

  useEffect(() => {
    filterData();
  }, [selectedCategories]);

  const filterData = () => {
    let filtered = listProds;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.every((city) => city.value !== item.category_names)
      );
    }

    setListFiltred(filtered);
  };

  const columns = [
    {
      field: "name",
      headerName: "Produit:",
      headerClassName: "super-app-theme--cell",

      width: 320,
      renderCell: (params) => {
        return (
          <div
            style={{
              marginTop: "4px",
              whiteSpace: "pre-line",
              overflow: "hidden",
            }}
          >
            <Typography>{params.row.name}</Typography>
          </div>
        );
      },
    },
    {
      field: "category_names",
      headerName: "Category:",
      headerClassName: "super-app-theme--cell",

      width: 200,
    },
    {
      field: "status_model",
      headerName: "Status:",
      headerClassName: "super-app-theme--cell",

      width: 100,
    },
    {
      field: "price",
      headerName: "Price:",
      headerClassName: "super-app-theme--cell",

      width: 80,
    },
    {
      field: "price_promo",
      headerName: "Price_Promo",
      headerClassName: "super-app-theme--cell",

      width: 100,
    },
    {
      field: "out-stock",
      headerName: "In Stock:",
      headerClassName: "super-app-theme--cell",

      width: 80,
      renderCell: (params) => {
        return (
          <Tooltip title="Check In Stock" placement="top">
            <div className="mt-2">
              {params.row.out_stock === 1 ? (
                <RiCheckDoubleFill className="collabListEdit" />
              ) : (
                <RiCloseLargeFill className="collabListDelete" />
              )}
            </div>
          </Tooltip>
        );
      },
    },
    {
      field: "image",
      headerName: "Image :",
      headerClassName: "super-app-theme--cell",

      width: 100,
      renderCell: (params) => {
        return (
          <div
            style={{
              backgroundImage: `url(${params.row.image})`,
              width: "50px",
              height: "50px",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
            onClick={() => handleLoadModalImage(params.row.image)}
          ></div>
        );
      },
    },
    {
      field: "modification",
      headerName: "Modifications",
      width: 160,
      renderCell: (params) => {
        return (
          <>
            <div className="flex items-center justify-center gap-4 mt-2 mr-8">
              <div>
                <RiEdit2Line
                  className="collabListEdit"
                  onClick={() => details(params.row)}
                />
              </div>
              <div>
                <RiDeleteBin6Fill
                  className="collabListDelete"
                  onClick={() => {
                    popup(
                      params.row.id,
                      params.row.name,
                      params.row.image,
                      params.row.images
                    );
                  }}
                />
              </div>
              <div>
                <Tooltip title="Hiden" placement="top">
                  <div>
                    <RiEyeOffLine
                      className="collabListEye"
                      onClick={() => {
                        HidenInStock(params.row.id, params.row.name);
                      }}
                    />
                  </div>
                </Tooltip>
              </div>
            </div>
          </>
        );
      },
    },
  ];
  return (
    <Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img src={`${image}`} />
        </Box>
      </Modal>
      <div className="page__main">
        <div className="flex items-center justify-center gap-10 mb-10">
          <Link to="/app/ajoute-produit">
            <Button variant="outlined" startIcon={<RiAddCircleFill />}>
              Ajoute Produit
            </Button>
          </Link>
          <Link to="/app/ajoute-categorie">
            <Button variant="outlined" startIcon={<RiAddCircleFill />}>
              Ajoute Categorie
            </Button>
          </Link>
          <Link to="/app/ajoute-collection">
            <Button variant="outlined" startIcon={<RiAddCircleFill />}>
              Ajoute Collection
            </Button>
          </Link>
        </div>

        <h1>List Produits:</h1>
        {!disable_button && (
          <div className="flex gap-4 mb-8">
            <button
              disabled={disable_button}
              className="bg-red-500 hover:bg-red-700 text-white font-bold rounded-2xl p-2"
              onClick={(e) => handleSubmit(e)}
            >
              Affecte to collection(s)
            </button>
            <div className="flex flex-col items-center">
              <span className="text-black font-bold">Collections :</span>
              <SelectOpt
                className="Options"
                options={selOptions}
                isMulti
                value={selectedCollections}
                onChange={setSelectedCollections}
                placeholder="Select Collections"
              />
            </div>
          </div>
        )}

        <Box
          sx={{
            height: "auto",
            width: "70vw",
            "& .super-app-theme--cell": {
              backgroundColor: "#fff",
              color: "#1a3e72",
              fontWeight: "bold",
            },
            boxShadow: 2,
            border: 2,
            borderRadius: 2,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
        >
          <DataGrid
            rows={listFiltred}
            columns={columns}
            getRowId={(row) => row.id}
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
          />
        </Box>
      </div>
    </Fragment>
  );
}

export default ListProduits;
