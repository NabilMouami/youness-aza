import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";
import { RiChatDeleteFill, RiEdit2Line } from "react-icons/ri";
import { config_url } from "../../config";
import { Modal, Box, TextField, Button } from "@mui/material";
const TableComponent = ({ sizes, quantities, onEditClick }) => {
  const Detail = useSelector((state) => state.Load);
  const { Col } = Detail;
  const [items, setItems] = useState([]);
  const [sizeShoes, setSizeShoes] = useState([]); // To hold the sizes
  const [sizeQuantities, setSizeQuantities] = useState([]); // To hold the quantities
  const [showSaveSizes, setShowSiveSizes] = useState(false);
  // Initialize items with sizes and quantities when component mounts
  useEffect(() => {
    const initialItems = sizes.map((size, index) => ({
      id: Math.random(),
      value: size,
      quantity: quantities[index] || "",
    }));
    setItems(initialItems);
  }, [sizes, quantities]);

  // Add List Of Numero Shoes (Sizes)
  const addListItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      { id: Math.random(), value: "", quantity: "" },
    ]);
    setShowSiveSizes(true);
  };

  // Update sizeShoes and sizeQuantities arrays based on current items
  useEffect(() => {
    const sizeValues = items.map((item) => `"${item.value}"`);
    const quantityValues = items.map((item) => `"${item.quantity}"`);
    setSizeShoes(sizeValues);
    setSizeQuantities(quantityValues);
  }, [items]);

  // Handler for quantity input change
  const handleQuantityChange = (event, index) => {
    const newItems = [...items];
    newItems[index].quantity = event.target.value;
    setItems(newItems);
    setShowSiveSizes(true);
  };

  // Handler for size input change
  const handleInputChange = (event, index) => {
    const newItems = [...items];
    newItems[index].value = event.target.value;
    setItems(newItems);
    setShowSiveSizes(true);
  };

  // Handler for removing list item
  const removeListItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };
  const nemuro_shoes = JSON.stringify(items.map((item) => item.value));
  const qty = JSON.stringify(items.map((item) => item.quantity));
  console.log(nemuro_shoes, qty);
  const saveData = () => {
    axios
      .post(`${config_url}/api/produit/size_qty/${Col.id}`, {
        nemuro_shoes,
        qty,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Size</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Modifications</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td className="py-2 px-4 border-b">
                {item.value || sizes[index]}
              </td>
              <td className="py-2 px-4 border-b">
                {item.quantity || quantities[index]}
              </td>
              <td className="py-2 px-4 border-b">
                <div className="flex items-center justify-center mt-3 gap-4">
                  <RiEdit2Line
                    className="collabListEdit"
                    onClick={() => onEditClick(item.value, item.quantity)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="w-full flex flex-col items-center justify-center font-semibold bg-white rounded-2xl h-auto mt-4 p-2">
        <div className="w-100 flex items-center justify-center gap-4 mt-4 mb-4">
          <h2 className="w-70">List Size Shoes:</h2>
          <span
            className="bg-sky-400 text-white mt-4 mb-4 p-2 rounded-2xl cursor-pointer"
            onClick={addListItem}
          >
            Add Size
          </span>
        </div>

        <ul>
          {items.map((item, index) => (
            <li key={item.id} className="mt-4 flex items-center space-between">
              <input
                type="text"
                className="bg-gray-200 border-gray-200 rounded py-3 px-4 focus:outline-none focus:border-sky-500"
                value={item.value}
                onChange={(event) => handleInputChange(event, index)}
                placeholder={`Size ${index + 1}`}
              />
              <input
                type="number"
                className="bg-gray-200 border-gray-200 rounded py-3 px-4 focus:outline-none focus:border-sky-500 ml-2"
                value={item.quantity}
                onChange={(event) => handleQuantityChange(event, index)}
                placeholder="Quantity"
              />
              <RiChatDeleteFill
                size={50}
                className="text-red-500 ml-2"
                onClick={() => removeListItem(index)}
              />
            </li>
          ))}
          {showSaveSizes && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              endIcon={<RiEdit2Line />}
              onClick={() => saveData()}
            >
              Save
            </Button>
          )}
        </ul>
      </div>
    </div>
  );
};
const UpdQtyShoes = ({ mySizes, myQuantities }) => {
  const [sizes, setSizes] = useState(mySizes);
  const [quantities, setQuantities] = useState(myQuantities);
  const [open, setOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const Detail = useSelector((state) => state.Load);
  const { Col } = Detail;
  const handleOpen = (size, currentQuantity) => {
    setSelectedSize(size);
    setNewQuantity(currentQuantity);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateQuantity = async () => {
    try {
      const response = await axios.post(`${config_url}/api/update-quantity`, {
        productId: Col.id, // Replace with actual product ID
        shoeSize: selectedSize,
        qtyToUpdate: newQuantity,
      });

      if (response.status === 200) {
        const updatedQuantities = quantities.map((qty, index) =>
          sizes[index] === selectedSize ? parseInt(newQuantity, 10) : qty
        );
        setQuantities(updatedQuantities);
        Swal.fire("Success", "Quantity updated successfully", "success");
        handleClose();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      Swal.fire("Error", "Failed to update quantity", "error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <TableComponent
        sizes={sizes}
        quantities={quantities}
        onEditClick={handleOpen}
      />
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Edit Quantity</h2>
          <TextField
            label="New Quantity"
            type="number"
            fullWidth
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateQuantity}
            sx={{ mt: 2 }}
          >
            Update
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdQtyShoes;
