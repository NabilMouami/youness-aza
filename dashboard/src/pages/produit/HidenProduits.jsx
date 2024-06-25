import { Fragment, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import { RiCheckDoubleFill, RiCloseLargeFill } from "react-icons/ri";
import { Tooltip } from "@mui/material";
import axios from "axios";
function HidenProduits() {
  const [listProds, setListProds] = useState([]);
  const [listFiltred, setListFiltred] = useState([]);
  const [disable_button, setDisable] = useState(true);
  const [category, setSelectCategory] = useState("Tous");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    axios.get("http://localhost:5000/api/hiden_in_stock").then(async (res) => {
      await setListProds(res.data);
      await setListFiltred(res.data);
    });
  }, []);
  const retouraustock = (id) => {
    axios
      .patch(`http://localhost:5000/api/hiden_in_stock/${id}`, {
        hiden_in_stock: 0,
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
  function HidenInStock(id, fname) {
    Swal.fire({
      title: "Êtes vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,

      confirmButtonColor: "#00BFFF",
      cancelButtonColor: "#d33",
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, Retour Stock " + fname + " ",
    }).then((willDelete) => {
      if (willDelete.isConfirmed) {
        Swal.fire("Produit " + fname + " est en Hiden In Stock", {
          icon: "success",
        });
        retouraustock(id);
      } else {
        Swal.fire("product en stock!");
      }
    });
  }
  const columns = [
    {
      field: "nom",
      headerName: "Produit:",
      headerClassName: "super-app-theme--cell",

      width: 140,
    },
    {
      field: "category",
      headerName: "Category:",
      headerClassName: "super-app-theme--cell",

      width: 140,
    },
    {
      field: "prix",
      headerName: "Prix par DH:",
      headerClassName: "super-app-theme--cell",

      width: 140,
    },
    {
      field: "prix_promo",
      headerName: "Prix_Promo par DH:",
      headerClassName: "super-app-theme--cell",

      width: 140,
    },
    {
      field: "out-stock",
      headerName: "In Stock:",
      headerClassName: "super-app-theme--cell",

      width: 140,
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

      width: 140,
      renderCell: (params) => {
        return (
          <div
            style={{
              backgroundImage: `url(http://localhost:5000/images/${params.row.image})`,
              width: "50px",
              height: "50px",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></div>
        );
      },
    },
    {
      field: "modification",
      headerName: "Modifications",
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <div>
              <button
                onClick={() => {
                  HidenInStock(params.row.id, params.row.nom);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-xl pl-2 pr-2"
              >
                Retour En Stock
              </button>
            </div>
          </>
        );
      },
    },
  ];
  //Filters
  const filterCategory = (e) => {
    if (listProds.length > 0) {
      setSelectCategory(e.target.value);
      if (listProds.length > 0) {
        const newFilter = listProds.filter(
          (bon) => bon.category === e.target.value
        );
        setListFiltred(newFilter);
        if (e.target.value === "Tous") {
          setListFiltred(listProds);
          return;
        }
      }
    }
  };
  return (
    <Fragment>
      <div className="page__main">
        <div className="bg-white p-4 mt-6 rounded-xl flex items-center justify-between">
          <div>
            <label className="ml-12 mb-2 block text-lg font-bold text-black">
              Category:
            </label>

            <select
              className="ml-12 mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-50 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={category}
              onChange={(e) => filterCategory(e)}
            >
              <option value="Tous">Tous</option>
              <option value="plat">Plat</option>
              <option value="drinks">Drinks</option>
              <option value="drinks">Dissert</option>
              <option value="entree">Entrée</option>
            </select>
          </div>

          <div>
            <button className="text-red-400 bg-secondary-100 p-2 rounded-xl">
              Annuler
            </button>
          </div>
        </div>
        <h1>List Des Produits Hiden:</h1>

        <Box
          sx={{
            height: "auto",
            width: "auto",
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
          />
        </Box>
      </div>
    </Fragment>
  );
}

export default HidenProduits;
