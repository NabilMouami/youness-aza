import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { config_url } from "../../config";
function DeleteItemOrder({ openDelete, handleCloseDelete, rowDeleteItem }) {
  console.log(rowDeleteItem);
  const handleDelete = () => {
    axios
      .delete(
        `${config_url}/api/orders/${rowDeleteItem.prod_id}/${rowDeleteItem.custom_id}/${rowDeleteItem.order_num}`
      )
      .then((res) => {
        toast.success("Deleted Item From Order(s) !!", {
          position: "top-right",
        });
        handleCloseDelete();
      });
  };
  return (
    <Dialog
      open={true}
      onClose={openDelete}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this item?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDelete} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteItemOrder;
