import { Fragment, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { config_url } from "../../config";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { RiCheckDoubleFill, RiCloseLargeFill } from "react-icons/ri";
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
function AddProdGroup() {
  const [listProds, setListProds] = useState([]);
  const [image, setImage] = useState("");

  const [open, setOpen] = useState(false);

  const [listFiltred, setListFiltred] = useState([]);
  const [disable_button, setDisable] = useState(true);
  const [groupes, setGroupes] = useState([]);
  const [group_id, setGroupId] = useState("");
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  console.log(rowSelectionModel);
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
    axios
      .get(`${config_url}/api/groupes`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setGroupes(res.data);
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLoadModalImage = async (image) => {
    await handleOpen();

    await setImage(image);
  };
  const selOptions = [];
  const ids = groupes?.map((o) => o.name);
  const filtered = groupes?.filter(
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
    setGroupId(e.id);
  };

  const ajouteProductCategory = () => {
    axios
      .post(`${config_url}/api/groupes/product_group`, {
        rowSelectionModel,
        group_id,
      })
      .then(() => {
        toast.success("Ajoute Produit Au Groupe !!", {
          position: "top-right",
        });
      });
  };
  const columns = [
    {
      field: "name",
      headerName: "Produit:",
      headerClassName: "super-app-theme--cell",

      width: 200,
    },
    {
      field: "category_names",
      headerName: "Category:",
      headerClassName: "super-app-theme--cell",

      width: 140,
    },
    {
      field: "status",
      headerName: "Status:",
      headerClassName: "super-app-theme--cell",

      width: 80,
    },
    {
      field: "price",
      headerName: "Price:",
      headerClassName: "super-app-theme--cell",

      width: 100,
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
        <Link to="/app/ajoute-groupe">
          <Button variant="contained">Ajoute Groupe</Button>
        </Link>

        <h1>List Produits:</h1>
        {!disable_button && (
          <div className="flex gap-4 mb-8">
            <div className="flex flex-col items-center">
              <span className="text-black font-bold">
                Affecter Aux Groupes :
              </span>
              <SelectOpt
                className="Options"
                options={selOptions}
                onChange={handle}
              />
            </div>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold rounded-2xl"
              onClick={() => ajouteProductCategory()}
            >
              Affecter au groupe
            </button>
          </div>
        )}

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
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
              setDisable(false);
            }}
            rowSelectionModel={rowSelectionModel}
          />
        </Box>
      </div>
    </Fragment>
  );
}

export default AddProdGroup;
