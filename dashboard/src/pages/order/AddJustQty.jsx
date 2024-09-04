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

function AddJustQty({
  closeModalQty,

  setQty,
  qty,
  productId,
  customerId,
}) {
  const Detail = useSelector((state) => state.Load);
  const { Col } = Detail;
  const AddJustQtyOfOrder = () => {
    axios
      .post(`${config_url}/api/orders/add_qty`, {
        order_num: Col.order_num,
        prod_id: productId,
        custom_id: customerId,
        qty: qty,
      })
      .then((res) => {
        toast.success("Qty Added !!", {
          position: "top-right",
        });
      });
  };

  return (
    <Fragment>
      <Modal
        open={true} // Modal is controlled by parent component
        onClose={closeModalQty}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="w-full bg-gray-100 p-2 mb-4">
            <Typography variant="h5" gutterBottom>
              Add Just Qty Of Product
            </Typography>
          </div>
          <Divider />
          <div className="mt-4 flex items-center justify-center justify-between">
            <Box sx={{ ml: 2, minWidth: 220 }}>
              <form className="max-w-sm mx-auto">
                <label
                  for="number-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select a number:
                </label>
                <input
                  type="number"
                  defaultValue={qty}
                  onChange={(e) => setQty(e.target.value)}
                  id="number-input"
                  aria-describedby="helper-text-explanation"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="90210"
                  required
                />
              </form>
            </Box>
          </div>

          <Divider />
          {qty !== 0 && (
            <div className="right-0 mt-4 ">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => AddJustQtyOfOrder()}
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
    </Fragment>
  );
}

export default AddJustQty;
