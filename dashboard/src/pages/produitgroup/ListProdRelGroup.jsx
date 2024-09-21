import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

import Paper from "@mui/material/Paper";
import Swal from "sweetalert2";
import { RiDeleteBin6Fill, RiAddCircleFill } from "react-icons/ri";
import { config_url } from "../../config";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function ListProdRelGroup() {
  const [listProdsGroup, setListProdsGroup] = useState([]);

  useEffect(() => {
    axios
      .get(`${config_url}/api/product_group`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setListProdsGroup(res.data);
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

  const handleDelete = (groupId, productId) => {
    Swal.fire({
      title: "Êtes vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, supprimez le produit!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${config_url}/api/groupe/${groupId}/${productId}`)
          .then((response) => {
            Swal.fire("Supprimé!", "Le produit a été supprimé.", "success");

            // Update the state to remove the deleted product from the list
            setListProdsGroup((prevGroups) =>
              prevGroups.map((group) => {
                if (group.group_id === groupId) {
                  return {
                    ...group,
                    product_names: group.product_names.filter(
                      (product, index) => group.product_ids[index] !== productId
                    ),
                    product_ids: group.product_ids.filter(
                      (id) => id !== productId
                    ),
                  };
                }
                return group;
              })
            );
          })
          .catch((error) => {
            Swal.fire("Erreur!", "Une erreur s'est produite.", "error");
            console.error("Error deleting product:", error);
          });
      }
    });
  };

  const handleDeleteGroupe = (groupId) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, supprimez le groupe!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${config_url}/api/groupes/${groupId}`)
          .then((response) => {
            Swal.fire("Supprimé!", "Le groupe a été supprimé.", "success");

            // Update the state to remove the deleted group from the list
            setListProdsGroup((prevGroups) =>
              prevGroups.filter((group) => group.group_id !== groupId)
            );
          })
          .catch((error) => {
            Swal.fire("Erreur!", "Une erreur s'est groupe.", "error");
            console.error("Error deleting Groupe:", error);
          });
      }
    });
  };

  return (
    <Fragment>
      <div className="flex items-center justify-center gap-10 mb-10">
        <Link to="/app/ajoute-groupe">
          <Button variant="outlined" startIcon={<RiAddCircleFill />}>
            Ajoute Groupe
          </Button>
        </Link>
        <Link to="/app/ajoute-produit-to-group">
          <Button variant="outlined" startIcon={<RiAddCircleFill />}>
            Affect Product To Groupe
          </Button>
        </Link>
      </div>
      <div className="container mx-auto my-8">
        <table className="table-auto min-w-full border-collapse border border-gray-300 rounded-2xl overflow-hidden">
          <thead>
            <tr className="text-black">
              <th className="py-2 px-4 border border-gray-300 bg-gray-200">
                Groupe(s)
              </th>
              <th className="py-2 px-4 border border-gray-300 bg-gray-200">
                Products
              </th>
              <th className="py-2 px-4 border border-gray-300 bg-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {listProdsGroup?.map((item) => (
              <tr key={item.group_id}>
                <td className="py-2 px-4 border border-gray-300">
                  {item.group_name}
                </td>
                <td className="py-2 px-4 border border-gray-300">
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
                    {item.product_names?.map((data, index) => {
                      const productId = item.product_ids[index]; // Get product_id corresponding to the current product name
                      return (
                        <ListItem key={index}>
                          <Chip
                            label={data} // Display product name
                            onDelete={() =>
                              handleDelete(item.group_id, productId)
                            } // Pass group_id and product_id to handleDelete
                          />
                        </ListItem>
                      );
                    })}
                  </Paper>
                </td>

                <td className="py-2 px-4 border border-gray-300">
                  <div className="flex items-center justify-center">
                    <RiDeleteBin6Fill
                      className="collabListDelete"
                      onClick={() =>
                        // Example usage of handleDelete function
                        // This may need adjustment based on actual product ids
                        handleDeleteGroupe(item.group_id)
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}

export default ListProdRelGroup;
