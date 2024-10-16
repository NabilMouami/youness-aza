import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { RiEye2Fill, RiChatDeleteFill, RiEdit2Line } from "react-icons/ri";
import { DataGrid } from "@mui/x-data-grid";
import { detailsProduct } from "../../slices/detailsProduct";
import { useDispatch } from "react-redux";
import { config_url } from "../../config";
import Box from "@mui/material/Box";

function ListCustomers() {
  const [listUsers, setListUsers] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${config_url}/api/customers`).then((res) => {
      setListUsers(res.data);
    });
  }, []);

  const details = (dts) => {
    dispatch(detailsProduct(dts));

    navigate("/app/clients/orders/" + dts.id);
  };

  const detailsCustomer = (dts) => {
    dispatch(detailsProduct(dts));

    navigate("/app/clients/changer-infos-client/" + dts.id);
  };
  const deleteEmployee = (id) => {
    axios.delete(`${config_url}/api/users/${id}`, {}).then(() => {
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
      field: "firstName",
      headerName: "Nom:",
      headerClassName: "super-app-theme--cell",

      width: 140,
      editable: true,
    },
    {
      field: "lastName",
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
      field: "modification",
      headerName: "Modifications",
      width: 130,
      renderCell: (params) => {
        return (
          <>
            <div className="flex mt-3 gap-4">
              <div>
                <RiEye2Fill
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
              <div>
                <RiEdit2Line
                  className="collabListDelete"
                  onClick={() => detailsCustomer(params.row)}
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

export default ListCustomers;
