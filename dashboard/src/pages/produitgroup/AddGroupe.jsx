import { Fragment, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { config_url } from "../../config";
import axios from "axios";
function AddGroupe() {
  const [groupe, setGroupe] = useState("");
  return (
    <Fragment>
      <form className="flex items-center justify-center gap-8">
        <TextField id="outlined-basic" label="Groupe Name" variant="outlined" />
        <Button variant="contained" type="submit">
          Send
        </Button>
      </form>
    </Fragment>
  );
}

export default AddGroupe;
