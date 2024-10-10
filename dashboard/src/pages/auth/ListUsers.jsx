import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { config_url } from "../../config";

import { RiChatDeleteFill, RiEdit2Line } from "react-icons/ri";
import { DataGrid } from "@mui/x-data-grid";
import { detailsProduct } from "../../slices/detailsProduct";
import { useDispatch } from "react-redux";

import Box from "@mui/material/Box";

function ListUsers() {
  const [listUsers, setListUsers] = useState([]);
  console.log(listUsers);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${config_url}/api/users`).then((res) => {
      setListUsers(res.data);
    });
  }, []);

  const details = (dts) => {
    dispatch(detailsProduct(dts));

    navigate("/app/changer-user/" + dts.id);
  };
  const deleteEmployee = (id) => {
    axios.delete(`${config_url}/api/users/${id}`).then(() => {
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
      field: "lastName",
      headerName: "Lastname:",
      headerClassName: "super-app-theme--cell",

      width: 140,
    },
    {
      field: "firstName",
      headerName: "Firstname:",
      headerClassName: "super-app-theme--cell",

      width: 140,
    },
    {
      field: "email",
      headerName: "Email:",
      headerClassName: "super-app-theme--cell",

      width: 400,
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
                    popup(
                      params.row.id,
                      params.row.firstName,
                      params.row.lastName
                    );
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
          <span className="text-xl mr-5">+</span>Add User
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
        />
      </Box>
    </div>
  );
}

export default ListUsers;
