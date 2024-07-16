import { Fragment, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { config_url } from "../../config";
import axios from "axios";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import {
  RiAddCircleFill,
  RiDeleteBin6Fill,
  RiEdit2Line,
  RiEyeOffLine,
  RiEyeLine,
  RiCheckDoubleFill,
  RiCloseLargeFill,
} from "react-icons/ri";
import { Tooltip } from "@mui/material";
import SelectOpt from "react-select";

import { detailsProduct } from "../../slices/detailsProduct";
function ListOrders() {
  const [listOrders, setListOrders] = useState([]);
  console.log(listOrders);
  const [listFiltred, setListFiltred] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    axios.get(`${config_url}/api/orders`).then(async (res) => {
      await setListOrders(res.data);
      await setListFiltred(res.data);
    });
  }, []);
  const detailsProd = (dts) => {
    dispatch(detailsProduct(dts));
    navigate("/app/details-order/" + dts.id);
  };
  const columns = [
    {
      field: "nom_client",
      headerName: "Customer:",
      headerClassName: "super-app-theme--cell",

      width: 200,
    },
    {
      field: "ville",
      headerName: "Ville:",
      headerClassName: "super-app-theme--cell",

      width: 140,
    },
    {
      field: "status",
      headerName: "Status:",
      headerClassName: "super-app-theme--cell",

      width: 140,
      renderCell: (params) => {
        return (
          <>
            <div className="flex items-center mt-2">
              <Stack direction="row" spacing={1}>
                <Chip
                  label={params.row.status}
                  color="error"
                  variant="outlined"
                />
              </Stack>
            </div>
          </>
        );
      },
    },
    {
      field: "total_price_sum",
      headerName: "Total Price:",
      headerClassName: "super-app-theme--cell",

      width: 100,
    },
    {
      field: "sum_qty",
      headerName: "Items:",
      headerClassName: "super-app-theme--cell",

      width: 100,
    },
    {
      field: "date_order",
      headerName: "Date Commande:",
      headerClassName: "super-app-theme--cell",

      width: 160,
    },
    {
      field: "modification",
      headerName: "",
      width: 220,
      renderCell: (params) => {
        return (
          <>
            <div className="flex items-center">
              <Tooltip title="Informations About Order" placement="top">
                <div className="mt-2">
                  <RiAddCircleFill
                    className="collabListEdit"
                    onClick={() => detailsProd(params.row)}
                  />
                </div>
              </Tooltip>
            </div>
          </>
        );
      },
    },
  ];
  return (
    <Fragment>
      <div className="page__main">
        <h1>List Orders:</h1>

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
            getRowId={(row) => row.date_order}
            checkboxSelection
          />
        </Box>
      </div>
    </Fragment>
  );
}

export default ListOrders;
