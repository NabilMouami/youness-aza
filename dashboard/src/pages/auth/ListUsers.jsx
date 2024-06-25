import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { RiChatDeleteFill, RiEdit2Line } from "react-icons/ri";
import { DataGrid } from "@mui/x-data-grid";
import { detailsProduct } from "../../slices/detailsProduct";
import { useDispatch } from "react-redux";

import Box from "@mui/material/Box";

function ListUsers() {
  const [listUsers, setListUsers] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get("http://localhost:5000/api/users").then((res) => {
      setListUsers(res.data);
    });
  }, []);

  const details = (dts) => {
    dispatch(detailsProduct(dts));

    navigate("/app/changer-user/" + dts.id);
  };
  const deleteEmployee = (id) => {
    axios.delete(`http://localhost:5000/api/users/${id}`, {}).then(() => {
      setListUsers(listUsers.filter((row) => row.id !== id));
    });
  };
  function popup(id, fname, lname) {
    Swal.fire({
      title: "Êtes vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, supprimez " + fname + " " + lname,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEmployee(id);
        Swal.fire("Supprimé!", "Utilisateur a été supprimé.", "success");
      }
    });
  }
  const columns = [
    {
      field: "nom",
      headerName: "Nom:",
      headerClassName: "super-app-theme--cell",

      width: 140,
      editable: true,
    },
    {
      field: "prenom",
      headerName: "Prenom:",
      headerClassName: "super-app-theme--cell",

      width: 140,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email:",
      headerClassName: "super-app-theme--cell",

      width: 240,
      editable: true,
    },
    {
      field: "role",
      headerName: "Role:",
      headerClassName: "super-app-theme--cell",

      width: 140,
    },

    {
      field: "modification",
      headerName: "Modifications",
      width: 130,
      renderCell: (params) => {
        return (
          <>
            <div className="flex mt-3 gap-4">
              <div>
                <RiEdit2Line
                  className="collabListEdit"
                  onClick={() => details(params.row)}
                />
              </div>
              <div>
                <RiChatDeleteFill
                  className="collabListDelete"
                  onClick={() => {
                    popup(params.row.id, params.row.nom, params.row.prenom);
                  }}
                />
              </div>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <div className="collabList">
      <Link to="/app/ajoute-utilisateur">
        <button className="addnewCollab">
          <span className="text-xl mr-5">+</span>Ajouter un Utilisateur
        </button>
      </Link>
      <Box
        sx={{
          height: "auto",
          width: "90%",
          marginLeft: "50px",
          "& .super-app-theme--cell": {
            backgroundColor: "#fff",
            color: "#1a3e72",
            fontWeight: "700",
          },
        }}
      >
        <DataGrid
          rows={listUsers}
          columns={columns}
          getRowId={(row) => row.id}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </div>
  );
}

export default ListUsers;
