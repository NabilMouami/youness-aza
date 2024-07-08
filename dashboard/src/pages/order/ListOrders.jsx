import { Fragment, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { config_url } from "../../config";
import axios from "axios";
import Box from "@mui/material/Box";
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

      width: 80,
    },
    {
      field: "total_price",
      headerName: "Total Price:",
      headerClassName: "super-app-theme--cell",

      width: 100,
    },
    {
      field: "product_name",
      headerName: "Product",
      headerClassName: "super-app-theme--cell",

      width: 160,
    },
    {
      field: "date_order",
      headerName: "Date Commande:",
      headerClassName: "super-app-theme--cell",

      width: 160,
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
            getRowId={(row) => row.id}
            checkboxSelection
          />
        </Box>
      </div>
    </Fragment>
  );
}

export default ListOrders;
