import { Fragment, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { config_url } from "../../config";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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
import UpdOrder from "./UpdOrder";
function ListOrders() {
  const [listOrders, setListOrders] = useState([]);
  console.log(listOrders);
  const [listFiltred, setListFiltred] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowOrder, setRowOrder] = useState({});
  const [filters, setFilters] = useState({
    order_status: "",
    payment_status: "",
    delivery_status: "",
    date_order: null,
  });

  console.log(filters);
  const [value, setValue] = useState(dayjs("2022-04-17"));
  console.log(value);
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
    navigate("/app/details-order/" + dts.order_num);
  };

  const openModal = (row) => {
    setIsModalOpen(true);
    setRowOrder(row);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Functions Of Filters Orders:
  const handleFilterChange = (event) => {
    const { name, checked, value } = event.target;
    const filterCategory = name.split(".")[0];
    const filterName = name.split(".")[1];

    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterCategory]: checked ? filterName : "",
    }));
  };

  const handleDateChange = (newValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      date_order: newValue,
    }));
  };

  const filteredOrders = listFiltred.filter((order) => {
    const { order_status, payment_status, delivery_status, date_order } =
      filters;
    const dateMatch = date_order
      ? dayjs(order.date_order).format("DD-MM-YYYY") ===
        date_order.format("DD-MM-YYYY")
      : true;
    const orderStatusMatch = order_status
      ? order.order_status === order_status
      : true;
    const paymentStatusMatch = payment_status
      ? order.payment_status.toLowerCase() === payment_status.toLowerCase()
      : true;
    const deliveryStatusMatch = delivery_status
      ? order.delivery_status.toLowerCase() === delivery_status.toLowerCase()
      : true;
    return (
      dateMatch && orderStatusMatch && paymentStatusMatch && deliveryStatusMatch
    );
  });

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
      headerName: "Actions",
      width: 220,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center">
              <Tooltip title="Informations About Order" placement="top">
                <div className="mt-2">
                  <RiEyeLine
                    className="collabListEdit"
                    onClick={() => detailsProd(params.row)}
                  />
                </div>
              </Tooltip>
            </div>
            <div className="flex items-center">
              <Tooltip title="Change Info Order" placement="top">
                <div className="mt-2">
                  <RiEdit2Line
                    className="collabListEdit"
                    onClick={() => openModal(params.row)}
                  />
                </div>
              </Tooltip>
            </div>
            <div className="flex items-center">
              <Tooltip title="Delete Order" placement="top">
                <div className="mt-2">
                  <RiDeleteBin6Fill className="collabListDelete" />
                </div>
              </Tooltip>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <Fragment>
      <div className="page__main">
        {isModalOpen && <UpdOrder closeModal={closeModal} />}{" "}
        <div className="w-full p-8 flex items-center justify-center justify-between bg-white rounded-2xl">
          <div className="flex flex-col">
            <span className="font-semibold bg-gray-200 rounded-2xl p-2">
              Order Status:
            </span>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.order_status === "open"}
                    onChange={handleFilterChange}
                    name="order_status.open"
                  />
                }
                label="Open"
                color="success"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.order_status === "closed"}
                    onChange={handleFilterChange}
                    name="order_status.closed"
                  />
                }
                label="Closed"
                color="error"
              />
            </FormGroup>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold bg-gray-200 rounded-2xl p-2">
              Payment Status:
            </span>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.payment_status === "paidOnline"}
                    onChange={handleFilterChange}
                    name="payment_status.paidOnline"
                  />
                }
                label="Paid-Online"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.payment_status === "cod"}
                    onChange={handleFilterChange}
                    name="payment_status.cod"
                  />
                }
                label="COD"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.payment_status === "paid"}
                    onChange={handleFilterChange}
                    name="payment_status.paid"
                  />
                }
                label="PAID"
              />
            </FormGroup>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold bg-gray-200 rounded-2xl p-2">
              Delivery Status:
            </span>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.delivery_status === "open"}
                    onChange={handleFilterChange}
                    name="delivery_status.open"
                  />
                }
                label="Open"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.delivery_status === "confirmed"}
                    onChange={handleFilterChange}
                    name="delivery_status.confirmed"
                  />
                }
                label="CONFIRMED"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.delivery_status === "paid"}
                    onChange={handleFilterChange}
                    name="delivery_status.paid"
                  />
                }
                label="PAID"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.delivery_status === "inTransport"}
                    onChange={handleFilterChange}
                    name="delivery_status.inTransport"
                  />
                }
                label="IN TRANSPORT"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.delivery_status === "delivered"}
                    onChange={handleFilterChange}
                    name="delivery_status.delivered"
                  />
                }
                label="DELIVERED"
              />
            </FormGroup>
          </div>
          <div className="flex flex-col gap-4 mb-[50px]">
            <span className="font-semibold bg-gray-200 rounded-2xl p-2">
              Date Order:
            </span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker", "DatePicker"]}>
                <DatePicker
                  label="Controlled picker"
                  value={filters.date_order}
                  onChange={handleDateChange}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
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
            rows={filteredOrders}
            columns={columns}
            getRowId={(row) => row.date_order}
          />
        </Box>
      </div>
    </Fragment>
  );
}

export default ListOrders;
