import React, { Fragment, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { config_url } from "../../config";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress

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

function AnnulerOrder({ closeModalAnnuler, customerId, productList }) {
  const Detail = useSelector((state) => state.Load);
  const { Col } = Detail;
  const [justification, setJustification] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const AnnulerCommande = () => {
    setLoading(true); // Set loading to true when the button is clicked

    setTimeout(() => {
      axios
        .put(
          `${config_url}/api/orders/annuler/${Col.order_num}/${customerId}`,
          {
            justification: justification,
            infos: productList,
          }
        )
        .then(() => {
          toast.success("Order Is Canceled !!", {
            position: "top-right",
          });
          closeModalAnnuler();
        })
        .finally(() => {
          setLoading(false); // Set loading to false after the request is complete
        });
    }, 2000); // Simulate a delay of 2 seconds
  };

  return (
    <Fragment>
      <Modal
        open={true} // Modal is controlled by parent component
        onClose={closeModalAnnuler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AiOutlineClose
            onClick={() => closeModalAnnuler()}
            className="fixed right-2 top-2 text-3xl text-white bg-red-500 rounded p-1"
          />

          <div className="w-full bg-gray-100 p-2 mb-4">
            <Typography variant="h5" gutterBottom>
              Cancel Order Of Client
            </Typography>
          </div>
          <Divider />
          <div className="mt-4 flex items-center justify-center justify-between">
            <Box sx={{ ml: 2, minWidth: 220 }}>
              <div className="mt-4 mb-4">
                <TextField
                  id="outlined-multiline-static"
                  label="Justification"
                  multiline
                  defaultValue={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  rows={10}
                />
              </div>
            </Box>
          </div>

          <Divider />
          <div className="right-0 mt-4 ">
            <Button
              variant="outlined"
              color="error"
              onClick={AnnulerCommande}
              disabled={loading} // Disable the button when loading
            >
              {loading ? <CircularProgress size={24} /> : "Cancel Order"}
            </Button>
          </div>
        </Box>
      </Modal>
    </Fragment>
  );
}

export default AnnulerOrder;
