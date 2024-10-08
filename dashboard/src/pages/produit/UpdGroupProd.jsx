import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { config_url } from "../../config";
import { styled } from "@mui/material/styles";

import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { toast } from "react-toastify";
import {
  MdCloudUpload,
  MdDelete,
  MdOutlineFilter,
  MdVideoLibrary,
  MdEditDocument,
} from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import { RiCloseLargeFill } from "react-icons/ri";
import { Typography } from "@mui/material";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));
function UpdGroupProd() {
  const Detail = useSelector((state) => state.Load);
  const { Col } = Detail;

  const [categoryArray, setCategoryArray] = useState(
    Col.category_names.split(", ") || []
  );

  const [productsGroupe, setListProductsGroupe] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  console.log(categoryName);
  const handleDelete = (chipToDelete) => async () => {
    await setCategoryName(chipToDelete);
    await popup(chipToDelete);
  };
  function popup(chipToDelete) {
    Swal.fire({
      title: "Êtes vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, supprimez Le Relation !!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${config_url}/api/categorie/${Col.id}/${chipToDelete}`);
        Swal.fire("Supprimé!", "Category a été supprimé.", "success");
      }
    });
  }
  useEffect(() => {
    axios
      .get(`${config_url}/api/product_group/${Col.id}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setListProductsGroupe(res.data);
        } else {
          console.error(
            "Invalid data structure received for categories:",
            res.data
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);
  return (
    <div className="flex flex-col gap-4">
      <h3>Already Related Groupe(s) (you can remove anyone from system):</h3>
      <Paper
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          listStyle: "none",
          p: 0.5,
          m: 0,
        }}
        component="ul"
      >
        {productsGroupe?.map((data, index) => {
          let icon;

          return (
            <ListItem key={index}>
              <Chip
                icon={icon}
                label={data.name}
                onDelete={handleDelete(data)}
              />
            </ListItem>
          );
        })}
      </Paper>
    </div>
  );
}

export default UpdGroupProd;
