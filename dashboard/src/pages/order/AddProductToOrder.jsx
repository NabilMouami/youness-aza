import { Fragment, useState, useEffect } from "react";
import { RiArrowLeftLine, RiSendPlaneFill } from "react-icons/ri";
import { AiFillEdit, AiOutlineFieldTime } from "react-icons/ai";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { toast } from "react-toastify";
import SelectOpt from "react-select";

import { useSelector } from "react-redux";
import axios from "axios";
import { config_url } from "../../config";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

function AddProductToOrder() {
  const Detail = useSelector((state) => state.Load);
  const { Col } = Detail;
  const [listProds, setListProds] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  console.log(selectedSizes);
  const [show_btn, setShowBtn] = useState(false);
  const [productId, setProdId] = useState();
  const [total_price, setTotalPrice] = useState();
  const selOptions = [];
  const ids = listProds?.map((o) => o.name);
  const filtered = listProds?.filter(
    ({ name }, index) => !ids?.includes(name, index + 1)
  );

  for (let i = 0; i < filtered.length; i++) {
    if (filtered.length > 0) {
      selOptions.push({
        value: filtered[i].name,
        label: filtered[i].name,
        image: filtered[i].image,
        nemuro_shoes: JSON.parse(filtered[i].nemuro_shoes.replace(/'/g, '"')),
        qty: JSON.parse(filtered[i].qty.replace(/'/g, '"')),
        prod_id: filtered[i].id,
        total_price:
          filtered[i].price_promo === 0
            ? filtered[i].price
            : filtered[i].price_promo,
      });
    }
  }

  const handleLoadProducts = () => {
    axios
      .get(`${config_url}/api/products`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then(async (res) => {
        await setListProds(res.data);
      });
  };
  const handle = (e) => {
    console.log(e);
    setProdId(e.prod_id);
    setTotalPrice(e.total_price);
  };

  const handleCheckboxChange = (size) => {
    setShowBtn(true);
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const addProductToOrder = () => {
    axios
      .post(`${config_url}/api/orders/dashboard`, {
        nom_client: Col.nom_client,
        telephone: Col.telephone,
        adresse: Col.adresse,
        ville: Col.ville,
        code_postal: Col.code_postal,
        email: Col.email,
        prod_id: productId,
        size: selectedSizes[0],
        custom_id: Col.custom_id,
        payment_status: "COD",
        total_price: total_price,
        order_num: Col.order_num,
      })
      .then((res) => {
        toast.success("Changed Information Client !!", {
          position: "top-right",
        });
      });
  };

  const formatOptionLabel = ({ value, label, image, nemuro_shoes, qty }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <img src={image} alt={label} style={{ width: 50, height: 50 }} />
      <div>{label}</div>
      <div>
        Available Qty:{" "}
        {qty.map((qt) => (
          <button className="rounded-full p-1 ml-1 bg-black text-white">
            {qt}
          </button>
        ))}
      </div>
      <div>
        Sizes:
        {nemuro_shoes.map((size) => (
          <label key={size} style={{ marginLeft: 5 }}>
            <input
              type="checkbox"
              value={size}
              checked={selectedSizes.includes(size)}
              onChange={() => handleCheckboxChange(size)}
            />
            {size}
          </label>
        ))}
      </div>
    </div>
  );
  return (
    <div>
      <Box sx={{ width: "100%", maxWidth: "100%" }}>
        <Typography variant="h3" gutterBottom>
          Add Product
        </Typography>
      </Box>{" "}
      <div className="flex items-center justify-center justify-between">
        <SelectOpt
          className="Options"
          options={selOptions}
          onChange={handle}
          formatOptionLabel={formatOptionLabel}
        />
        {show_btn && (
          <Button variant="contained" onClick={() => addProductToOrder()}>
            Order Product
          </Button>
        )}
        <Button variant="contained" onClick={() => handleLoadProducts()}>
          Browse
        </Button>
      </div>
    </div>
  );
}

export default AddProductToOrder;
