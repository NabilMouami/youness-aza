import { Fragment, useState, useEffect, useMemo } from "react";
import { RiArrowLeftLine, RiSendPlaneFill } from "react-icons/ri";
import {
  AiFillEdit,
  AiOutlineFieldTime,
  AiOutlineSafety,
  AiFillCloseCircle,
  AiFillCheckSquare,
} from "react-icons/ai";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { toast } from "react-toastify";

import { useSelector } from "react-redux";
import axios from "axios";
import { config_url } from "../../config";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import EditItemDiscount from "./EditItemDiscount";
import EditCustomerInformation from "./EditCustomerInformation";
import AddProductToOrder from "./AddProductToOrder";
import AddJustQty from "./AddJustQty";
import DeleteItemOrder from "./DeleteItemOrder";
import AnnulerOrder from "./AnnulerOrder";

function EditOrder() {
  const Detail = useSelector((state) => state.Load);
  const { Col } = Detail;
  const [listProds, setListProds] = useState([]);
  console.log(listProds);
  const [listOrders, setListOrders] = useState([]);
  console.log(listOrders);
  const [productList, setProductList] = useState([]);

  const [status_dlivery, setSelectStatus] = useState(Col.delivery_status);
  const [changed_status_dlivery, setChangedSelectStatus] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [opendelete, setOpenDelete] = useState(false);
  const [rowDeleteItem, setRowDeleteItem] = useState({});

  const [isModalOpenCustomer, setIsModalOpenCustomer] = useState(false);
  const [isModalOpenQty, setIsModalOpenQty] = useState(false);
  const [isModalOpenAnnuler, setIsModalOpenAnnuler] = useState(false);
  const [rowOrder, setRowOrder] = useState({});
  const [discount, setDiscount] = useState(0);
  const [qty, setQty] = useState(0);

  let total = 0;
  let total_items = 0;
  listOrders?.forEach((data) => {
    const price = data.total_price * data.items;
    total += price;
    const items_qty = data.items;
    total_items += items_qty;
  });

  useEffect(() => {
    if (listOrders) {
      const updatedProductList = listOrders?.map((data) => ({
        productId: data.prod_id,
        productName: data.name,
        productSize: data.size,
        productPrice: data.total_price,
        qty: data.items,
        nom_client: data.nom_client,
        email: data.email,
        telephone: data.telephone,
        adresse: data.adresse,
        ville: data.ville,
        date_order: data.date_order,
      }));
      setProductList(updatedProductList);
    }
  }, [listOrders]);

  useEffect(() => {
    axios
      .get(`${config_url}/api/orders/order_id/${Col.order_num}`)
      .then(async (res) => {
        await setListOrders(res.data);
      });
  }, []);

  //Select Delivery Status Function
  const handleSelectStatus = (e) => {
    setSelectStatus(e.target.value);
    setChangedSelectStatus(true);
  };
  // maked Customer as Paid Status and Earn Coins
  const makeAsPaid = (order_num, customerId, coinsPayed) => {
    axios
      .put(`${config_url}/api/orders/ispaid/${order_num}/${customerId}`, {
        amountSpent: total,
        coins_payed: coinsPayed,
        infos: productList,
      })
      .then(() => {
        toast.success("Maked Order Is Paid !!", {
          position: "top-right",
        });
      });
  };

  // Change Delivery Status
  const deliveryStatus = () => {
    if (status_dlivery === "DELIVERED") {
      makeAsPaid(listOrders[0]?.order_num, Col.custom_id, Col.coins_payed);
    }
    axios
      .post(`${config_url}/api/orders/delivery_status`, {
        order_num: Col.order_num,
        custom_id: listOrders[0]?.custom_id,
        delivery_status: status_dlivery,
      })
      .then(() => {
        toast.success("Order Delivery Status Changed !!", {
          position: "top-right",
        });
      });
    setChangedSelectStatus(false);
  };
  const openModal = (row) => {
    setIsModalOpen(true);
    setRowOrder(row);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openDelete = (row) => {
    setOpenDelete(true);
    setRowDeleteItem(row);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setRowDeleteItem({});
  };
  const openModalCustomer = () => {
    setIsModalOpenCustomer(true);
  };

  const closeModalCustomer = () => {
    setIsModalOpenCustomer(false);
  };

  const openModalQty = () => {
    setIsModalOpenQty(true);
  };

  const closeModalQty = () => {
    setIsModalOpenQty(false);
  };

  const openModalAnnuler = () => {
    setIsModalOpenAnnuler(true);
  };

  const closeModalAnnuler = () => {
    setIsModalOpenAnnuler(false);
  };

  //Filters

  const selOptions = [];
  const ids = listProds?.map((o) => o.name);
  const filtered = listProds?.filter(
    ({ name }, index) => !ids?.includes(name, index + 1)
  );

  for (let i = 0; i < filtered.length; i++) {
    if (filtered.length > 0) {
      selOptions.push({
        value: filtered[i].name,
        label: filtered[i].name,
        image: filtered[i].image,
        nemuro_shoes: JSON.parse(filtered[i].nemuro_shoes.replace(/'/g, '"')),
        qty: JSON.parse(filtered[i].qty.replace(/'/g, '"')),
        id: filtered[i].id,
      });
    }
  }

  return (
    <Fragment>
      {isModalOpen && (
        <EditItemDiscount
          closeModal={closeModal}
          setDiscount={setDiscount}
          rowOrder={rowOrder}
          discount={discount}
          productId={listOrders[0]?.prod_id}
          customerId={listOrders[0]?.custom_id}
        />
      )}{" "}
      {isModalOpenCustomer && (
        <EditCustomerInformation
          closeModalCustomer={closeModalCustomer}
          productId={listOrders[0]?.prod_id}
          customerId={listOrders[0]?.custom_id}
        />
      )}{" "}
      {isModalOpenQty && (
        <AddJustQty
          closeModalQty={closeModalQty}
          qty={qty}
          setQty={setQty}
          productId={listOrders[0]?.prod_id}
          customerId={listOrders[0]?.custom_id}
        />
      )}{" "}
      {isModalOpenAnnuler && (
        <AnnulerOrder
          closeModalAnnuler={closeModalAnnuler}
          customerId={listOrders[0]?.custom_id}
          productList={productList}
        />
      )}{" "}
      {opendelete && (
        <DeleteItemOrder
          openDelete={openDelete}
          handleCloseDelete={handleCloseDelete}
          rowDeleteItem={rowDeleteItem}
          listOrders={listOrders}
          setListOrders={setListOrders}
        />
      )}{" "}
      <div className="flex items-center justify-center bold font-sans text-2xl text-black m-6">
        <RiArrowLeftLine />
        <h2 className="">Edit Order: #{Col.order_num}</h2>{" "}
      </div>
      <div className="w-full flex  items-center justify-center justify-between gap-2">
        <div className="w-[70%]">
          <div className="bg-white rounded-2xl flex flex-col p-4">
            <AddProductToOrder />
            <div>
              {listOrders.map((item) => (
                <div className="mt-8 flex flex-col gap-4 justify-start">
                  <div className="bg-gray-100 p-4 rounded-2xl flex items-center justify-center justify-around">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14"
                    />
                    <span className="font-bold text-xl font-sans">
                      {item.name}
                    </span>
                    <div>
                      Price Ordered:
                      <span className="font-semibold text-xl">
                        {item.total_price} Dh
                      </span>{" "}
                    </div>
                    <div className="flex">
                      <span className="font-semibold text-xl bg-black text-white p-1 rounded-full">
                        {item.size}
                      </span>{" "}
                    </div>
                  </div>

                  <div className="flex items-center justify-center justify-around">
                    <Button onClick={() => openModal(item)}>
                      Edit discount
                    </Button>
                    <Button onClick={() => openModalQty()}>
                      Add Just Quantity
                    </Button>
                    <Button onClick={() => openDelete(item)}>
                      Remove item
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl flex flex-col p-4 mt-10">
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <Typography variant="h3" gutterBottom>
                Payment
              </Typography>
              {Col.payment_status === "COD" ||
              Col.payment_status === "Paid-Online" ? (
                <div className="bg-[#FFD35A] flex items-center justify-center p-2 rounded-2xl m-4 gap-8">
                  <AiOutlineFieldTime size={40} />
                  <span className="text-2xl font-bold">Payment pending</span>
                </div>
              ) : (
                <div className="bg-green-400 flex items-center justify-center p-2 rounded-2xl m-4 gap-8">
                  <AiOutlineSafety size={40} />
                  <span className="text-2xl font-bold">Payed</span>
                </div>
              )}
              <Card variant="outlined" sx={{ maxWidth: "100%" }}>
                <Divider />
                <Box sx={{ p: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography gutterBottom variant="h5" component="div">
                      Subtotal
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                      {total_items} x items
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                      {total} Dh
                    </Typography>
                  </Stack>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography gutterBottom variant="h5" component="div">
                      Shipping
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                      Standard (0.0Kg ,items 0.0kg, Package 0.0kg)
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                      {total > 1000 ? "0 Dh" : "50 Dh"}
                    </Typography>
                  </Stack>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography gutterBottom variant="h5" component="div">
                      Total
                    </Typography>

                    <Typography gutterBottom variant="h6" component="div">
                      {total > 1000 ? total : total + 50} Dh
                    </Typography>
                  </Stack>
                </Box>

                <Box sx={{ p: 2, mt: 10 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography gutterBottom variant="h5" component="div">
                      Paid
                    </Typography>

                    <Typography gutterBottom variant="h6" component="div">
                      0.0 Dh
                    </Typography>
                  </Stack>
                </Box>

                <Box sx={{ p: 2, mt: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography gutterBottom variant="h5" component="div">
                      Coins Earned:
                    </Typography>

                    <Typography gutterBottom variant="h6" component="div">
                      {total / 2.5}
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ p: 2, mt: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography gutterBottom variant="h5" component="div">
                      Coins Paid:
                    </Typography>

                    <Typography gutterBottom variant="h6" component="div">
                      {Col.coins_payed} Coins
                    </Typography>
                  </Stack>
                </Box>
                <Stack
                  direction="row"
                  spacing={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  margin={2}
                >
                  {/* <Button
                    color="primary"
                    variant="contained"
                    onClick={() =>
                      makeAsPaid(
                        listOrders[0]?.order_num,
                        Col.custom_id,
                        Col.coins_payed
                      )
                    }
                    startIcon={<AiFillCheckSquare />}
                  >
                    Make as paid
                  </Button> */}
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() => openModalAnnuler()}
                    startIcon={<AiFillCloseCircle />}
                  >
                    Cancel Order
                  </Button>
                </Stack>
              </Card>
            </Box>{" "}
          </div>
        </div>
        <div className="flex flex-col gap-6 fixed right-5 top-20 mt-[80px]">
          <div className="bg-white rounded-2xl flex flex-col p-4 gap-8 text-black relative top-0">
            <Box sx={{ ml: 2, minWidth: 220 }}>
              <FormControl sx={{ minWidth: 220 }}>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Delivery Status:
                </label>{" "}
                <Select value={status_dlivery} onChange={handleSelectStatus}>
                  <MenuItem value="CANCEL">Cancel</MenuItem>

                  <MenuItem value="OPEN">Open</MenuItem>
                  <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                  <MenuItem value="IN-TRANSPORT">In Tranport</MenuItem>
                  <MenuItem value="DELIVERED">Delivred</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {changed_status_dlivery && (
              <Button
                onClick={() => deliveryStatus()}
                variant="contained"
                color="success"
                endIcon={<RiSendPlaneFill />}
              >
                Save
              </Button>
            )}
          </div>

          <div className="bg-white rounded-2xl flex flex-col p-4 text-black relative top-0">
            <AiFillEdit
              className="right-0 absolute"
              size={40}
              onClick={() => openModalCustomer()}
            />

            <Typography gutterBottom variant="h6" component="div">
              Customer
            </Typography>
            <span className="text-sky-400 font-sans font-bold text-2xl">
              {" "}
              {listOrders[0]?.nom_client}
            </span>
            <Typography gutterBottom variant="h6" component="div">
              Contact Information
            </Typography>
            <span className="text-sky-400 font-sans font-bold text-2xl">
              {" "}
              {listOrders[0]?.email}
            </span>
            <span className="text-sky-400 font-sans font-bold text-2xl">
              {" "}
              {listOrders[0]?.telephone}
            </span>
            <Typography gutterBottom variant="h6" component="div">
              Shipping adresse
            </Typography>
            <span>Ville: {listOrders[0]?.ville}</span>
            <span>Adresse: {listOrders[0]?.adresse}</span>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default EditOrder;
