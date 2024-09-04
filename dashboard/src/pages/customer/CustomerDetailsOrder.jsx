import React, { useState, useEffect, Fragment } from "react";
import { config_url } from "../../config";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Swal from "sweetalert2";

import axios from "axios";
import { useSelector } from "react-redux";
function CustomerDetailsOrder() {
  const { Col } = useSelector((state) => state.Load);
  const [listOrdersCustomer, setListOrdersCustomer] = useState([]);
  const [listOrders, setListOrders] = useState([]);
  console.log("listOrdersCustomer:", listOrdersCustomer);
  console.log("listOrders:", listOrders);
  useEffect(() => {
    axios
      .get(`${config_url}/api/customers/orders/${Col.id}`)
      .then((res) => {
        console.log("API Response:", res.data);

        // Ensure proper data structure
        if (res.data && res.data.data) {
          setListOrdersCustomer(res.data.data.data);
          setListOrders(res.data.data.data || []); // Update this based on actual structure
        }
      })
      .catch((err) => {
        console.error("API Error:", err);
      });
  }, []);
  const columns = [
    {
      field: "order_num",
      headerName: "Num Order:",
      headerClassName: "super-app-theme--cell",

      width: 80,
    },
    {
      field: "product_name",
      headerName: "Produit:",
      headerClassName: "super-app-theme--cell",

      width: 100,
    },
    {
      field: "telephone",
      headerName: "Telephone:",
      headerClassName: "super-app-theme--cell",

      width: 100,
    },
    {
      field: "ville",
      headerName: "Ville:",
      headerClassName: "super-app-theme--cell",

      width: 140,
    },
    {
      field: "adresse",
      headerName: "Adresse:",
      headerClassName: "super-app-theme--cell",

      width: 140,
    },
    {
      field: "order_status",
      headerName: "Order Status:",
      headerClassName: "super-app-theme--cell",

      width: 140,
      renderCell: (params) => {
        return (
          <>
            <div className="flex items-center mt-2">
              <Stack spacing={1}>
                <Chip
                  label={params.row.order_status}
                  color={
                    params.row.order_status === "open" ? "success" : "error"
                  }
                  variant="outlined"
                />
              </Stack>
            </div>
          </>
        );
      },
    },
    {
      field: "payment_status",
      headerName: "Payment Status:",
      headerClassName: "super-app-theme--cell",

      width: 140,
      renderCell: (params) => {
        return (
          <>
            <div className="flex items-center mt-2">
              <Stack direction="row" spacing={1}>
                <Chip label={params.row.payment_status} color="primary" />
              </Stack>
            </div>
          </>
        );
      },
    },
    {
      field: "delivery_status",
      headerName: "Delivery Status:",
      headerClassName: "super-app-theme--cell",

      width: 140,
      renderCell: (params) => {
        return (
          <>
            <div className="flex items-center mt-2">
              <Stack direction="row" spacing={1}>
                <Chip label={params.row.delivery_status} color="primary" />
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
      field: "coins_payed",
      headerName: "Coins Payed:",
      headerClassName: "super-app-theme--cell",

      width: 80,
    },
    {
      field: "sum_qty",
      headerName: "Items:",
      headerClassName: "super-app-theme--cell",

      width: 60,
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
      <h1 className="text-sky-500">List Orders:</h1>
      <Box
        sx={{
          height: "auto",
          width: "80vw",
          "& .super-app-theme--cell": {
            backgroundColor: "#fff",
            color: "#1a3e72",
            fontWeight: "bold",
          },
          marginLeft: "-15%",
          boxShadow: 2,
          border: 2,
          borderRadius: 2,
          borderColor: "#333",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
        }}
      >
        <DataGrid
          rows={listOrders}
          columns={columns}
          getRowId={(row) => row.date_order}
        />
      </Box>
      <Typography variant="h6" gutterBottom>
        Client: {Col?.firstName} {Col?.lastName || "N/A"}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Email: {Col?.email || "N/A"}
      </Typography>
      {listOrders?.length > 0 ? (
        <Typography variant="h6" gutterBottom>
          Total Coins: {listOrders[0]?.balance} Coins.
        </Typography>
      ) : (
        <Typography variant="h6" gutterBottom>
          No Coins
        </Typography>
      )}
    </Fragment>
  );
}

export default CustomerDetailsOrder;
