import React, { Fragment, useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { config_url } from "../../config";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};

function EditItemDiscount({
  closeModal,
  setDiscount,
  discount,
  rowOrder,
  productId,
  customerId,
}) {
  const Detail = useSelector((state) => state.Load);
  const { Col } = Detail;
  const [discounted, setDiscounted] = useState(false);
  const [type_discount, setSelectTypeDiscount] = useState("amount");
  const [percentage, setPercentage] = useState(10);
  const [value_discounted, setValueDiscounted] = useState(rowOrder.total_price);
  useEffect(() => {
    let calculatedDiscount = 0;
    if (type_discount === "percentage") {
      calculatedDiscount = (rowOrder.total_price * percentage) / 100;
    } else if (type_discount === "amount") {
      calculatedDiscount = rowOrder.total_price - discount;
    }
    setValueDiscounted(calculatedDiscount);
  }, [type_discount, percentage, discount, rowOrder.total_price, setDiscount]);

  const discountOrder = () => {
    axios
      .post(`${config_url}/api/orders/discount_price`, {
        order_num: Col.order_num,
        prod_id: productId,
        custom_id: customerId,
        discount: value_discounted,
      })
      .then((res) => {
        toast.success("Discount Price Product !!", {
          position: "top-right",
        });
      });
  };

  const handleSelectDiscount = (e) => {
    setSelectTypeDiscount(e.target.value);
  };

  return (
    <Fragment>
      <Modal
        open={true} // Modal is controlled by parent component
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="w-full bg-gray-100 p-2 mb-4">
            <Typography variant="h5" gutterBottom>
              Edit Item Discount
            </Typography>
          </div>
          <Divider />
          <div className="mt-4 flex items-center justify-center justify-between">
            <Box sx={{ ml: 2, minWidth: 220 }}>
              <FormControl sx={{ minWidth: 220 }}>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Discount Type:
                </label>
                <Select value={type_discount} onChange={handleSelectDiscount}>
                  <MenuItem value="amount">Amount</MenuItem>
                  <MenuItem value="percentage">Percentage</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {type_discount === "amount" ? (
              <FormControl sx={{ m: 1 }} variant="standard">
                <Input
                  onChange={(e) => {
                    setDiscount(e.target.value);
                    setDiscounted(true);
                  }}
                  defaultValue="0"
                  id="standard-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">MAD</InputAdornment>
                  }
                />
              </FormControl>
            ) : (
              <FormControl sx={{ m: 1 }} variant="standard">
                <InputLabel id="percentage-label">Percentage</InputLabel>
                <Select
                  labelId="percentage-label"
                  value={percentage}
                  onChange={(e) => {
                    setPercentage(e.target.value);
                    setDiscounted(true);
                  }}
                >
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}%
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>
          <div className="m-4">
            <TextField
              id="outlined-multiline-static"
              label="Reason for discount"
              multiline
              rows={4}
            />
          </div>
          <Divider />
          {discounted && (
            <div>
              <Typography variant="h5" gutterBottom>
                Value Discounted: {value_discounted}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={discountOrder}
              >
                Apply Discount
              </Button>
            </div>
          )}
        </Box>
      </Modal>
    </Fragment>
  );
}

export default EditItemDiscount;
