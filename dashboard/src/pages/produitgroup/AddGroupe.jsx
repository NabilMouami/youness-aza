import { Fragment, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { config_url } from "../../config";
import axios from "axios";
import { toast } from "react-toastify";

function AddGroupe() {
  const [groupe, setGroupe] = useState("");

  const addGroupe = () => {
    axios
      .post(`${config_url}/api/groupes`, {
        groupe,
      })
      .then((res) => {
        toast.success("Groupe Name Is Added !!");
        setGroupe("");
      });
  };
  return (
    <Fragment>
      <form className="flex items-center justify-center gap-8">
        <TextField
          onChange={(e) => setGroupe(e.target.value)}
          id="outlined-basic"
          label="Groupe Name"
          variant="outlined"
        />
        <Button variant="contained" onClick={() => addGroupe()}>
          Send
        </Button>
      </form>
    </Fragment>
  );
}

export default AddGroupe;
