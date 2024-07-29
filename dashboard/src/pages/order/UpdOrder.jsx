import React, { Fragment } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

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

function UpdOrder({ closeModal }) {
  return (
    <Fragment>
      <Modal
        open={true} // Modal is controlled by parent component
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          <input />
        </Box>
      </Modal>
      <div></div>
    </Fragment>
  );
}

export default UpdOrder;
