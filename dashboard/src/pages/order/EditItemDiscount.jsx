import React, { Fragment, useState } from "react";
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
  productId,
  customerId,
}) {
  const Detail = useSelector((state) => state.Load);
  const { Col } = Detail;
  const [changed_status_dlivery, setChangedSelectStatus] = useState(false);
  const [status_dlivery, setSelectStatus] = useState(Col.delivery_status);

  const discountOrder = () => {
    axios
      .post(`${config_url}/api/orders/dsicount_price`, {
        order_num: Col.order_num,
        prod_id: productId,
        custom_id: customerId,
        discount: discount,
      })
      .then((res) => {
        toast.success("Discount Price Product !!", {
          position: "top-right",
        });
      });
  };

  const handleSelectStatus = (e) => {
    setSelectStatus(e.target.value);
    setChangedSelectStatus(true);
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
                  Delivery Status:
                </label>{" "}
                <Select value={status_dlivery} onChange={handleSelectStatus}>
                  <MenuItem value="OPEN">Discount</MenuItem>
                  <MenuItem value="CONFIRMED">Porcentage</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <FormControl sx={{ m: 1 }} variant="standard">
              <Input
                onChange={(e) => setDiscount(e.target.value)}
                defaultValue="0"
                id="standard-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">MAD</InputAdornment>
                }
              />
            </FormControl>{" "}
          </div>
          <div className="mt-4 mb-4">
            <TextField
              id="outlined-multiline-static"
              label="Reason for discount"
              multiline
              rows={4}
            />
          </div>
          <Divider />
          {discount !== 0 && (
            <div className="right-0 mt-4 ">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => discountOrder()}
              >
                Save
              </Button>
            </div>
          )}

          <div className="bottom-0 mt-4">
            <Button variant="outlined" color="error">
              Remove discount
            </Button>
          </div>
        </Box>
      </Modal>
      <div></div>
    </Fragment>
  );
}

export default EditItemDiscount;
