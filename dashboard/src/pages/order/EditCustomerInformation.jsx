import React, { Fragment, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { config_url } from "../../config";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RiPhoneCameraFill, RiPhoneFill } from "react-icons/ri";

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

function EditCustomerInformation({
  closeModalCustomer,
  productId,
  customerId,
}) {
  const Detail = useSelector((state) => state.Load);
  const { Col } = Detail;
  const [nom_client, setNomClient] = useState(Col.nom_client);
  const [telephone, setTelephone] = useState(Col.telephone);
  const [email, setEmail] = useState(Col.email);
  const [ville, setVille] = useState(Col.ville);
  const [adresse, setAdresse] = useState(Col.adresse);
  const [code_postal, setCodePostal] = useState(Col.code_postal);

  const updateCustomerInformations = () => {
    axios
      .post(`${config_url}/api/orders/customer_information`, {
        order_num: Col.order_num,
        prod_id: productId,
        custom_id: customerId,
        nom_client: nom_client,
        telephone: telephone,
        adresse: adresse,
        ville: ville,
        code_postal: code_postal,
        email: email,
      })
      .then((res) => {
        toast.success("Changed Information Client !!", {
          position: "top-right",
        });
      });
  };
  return (
    <Fragment>
      <Modal
        open={true} // Modal is controlled by parent component
        onClose={closeModalCustomer}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="w-full bg-gray-100 p-2 mb-4">
            <Typography variant="h5" gutterBottom>
              Edit Information Client
            </Typography>
          </div>
          <Divider />
          <div className="mt-4 flex items-center justify-center justify-between">
            <TextField
              id="outlined-basic"
              label="Customer Name"
              variant="outlined"
              onChange={(e) => setNomClient(e.target.value)}
              defaultValue={nom_client}
            />
            <TextField
              id="outlined-basic"
              label="Email Customer"
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              defaultValue={email}
            />
            <FormControl sx={{ m: 1 }} variant="standard">
              <InputLabel htmlFor="standard-adornment-amount">
                Telephone
              </InputLabel>
              <Input
                defaultValue={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                id="standard-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">
                    <RiPhoneFill />
                  </InputAdornment>
                }
              />
            </FormControl>{" "}
          </div>
          <div className="flex items-center justify-center justify-between mt-4 mb-4">
            <TextField
              id="outlined-multiline-static"
              label="Adresse"
              defaultValue={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              multiline
              rows={4}
            />
            <TextField
              id="outlined-basic"
              label="Ville"
              variant="outlined"
              onChange={(e) => setVille(e.target.value)}
              defaultValue={ville}
            />
            <TextField
              id="outlined-basic"
              label="Code Postal"
              variant="outlined"
              onChange={(e) => setCodePostal(e.target.value)}
              defaultValue={code_postal}
            />
          </div>
          <Divider />
          <div className="right-0 mt-4 ">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => updateCustomerInformations()}
            >
              Save
            </Button>
          </div>
        </Box>
      </Modal>
      <div></div>
    </Fragment>
  );
}

export default EditCustomerInformation;
