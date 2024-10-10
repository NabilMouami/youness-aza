import "./users.css";
import { useState } from "react";
import { RiMailAddFill, RiUser2Fill, RiUser2Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import { config_url } from "../../config";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
} from "@mui/material";

const roles = ["Admin", "Super-Admin"];

function UpdUser() {
  const Detail = useSelector((state) => state.Load);
  const { Col } = Detail;
  const [nom, setNom] = useState(Col.lastName);
  const [prenom, setPrenom] = useState(Col.firstName);
  const [email, setEmail] = useState(Col.email);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(Col.role);

  const handleSelect = (e) => {
    setRole(e.target.value);
  };

  const post = { nom, prenom, email, password, role };

  const submitHandler = (e) => {
    e.preventDefault();
    axios.put(`${config_url}/api/users/${Col.id}`, post).then(() => {
      toast.success("Changement User Success !!", {
        position: "top-right",
      });
    });
  };

  return (
    <div className="user">
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <div className="userShowTopTitle">
              <span className="userShowUsername">
                {Col.nom + " " + Col.prenom}
              </span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Détails du compte</span>
            <div className="userShowInfo">
              <RiUser2Fill className="userShowIcon" />
              <span className="userShowInfoTitle">{Col.lastName}</span>
            </div>
            <div className="userShowInfo">
              <RiUser2Line className="userShowIcon" />
              <span className="userShowInfoTitle">{Col.firstName}</span>
            </div>
            <span className="userShowTitle">Détails du contact</span>
            <div className="userShowInfo">
              <RiMailAddFill className="userShowIcon" />
              <span className="userShowInfoTitle">{Col.email}</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Change User</span>
          <form className="userUpdateForm" onSubmit={submitHandler}>
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Lastname</label>
                <input
                  type="text"
                  placeholder="nom"
                  className="userUpdateInput"
                  defaultValue={Col.lastName}
                  onChange={(event) => {
                    setNom(event.target.value);
                  }}
                />
              </div>
              <div className="userUpdateItem">
                <label>Firstname</label>
                <input
                  type="text"
                  placeholder="prénom"
                  className="userUpdateInput"
                  defaultValue={Col.firstName}
                  onChange={(event) => {
                    setPrenom(event.target.value);
                  }}
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  placeholder="email@gmail.com"
                  className="userUpdateInput"
                  defaultValue={Col.email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </div>
              <div className="userUpdateItem">
                <label>New Password To Change</label>
                <input
                  type="password"
                  placeholder="***********"
                  className="userUpdateInput"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </div>

              <div className="userUpdateItem">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={3}
                >
                  <FormLabel component="legend">Roles</FormLabel>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      aria-label="roles"
                      name="roles"
                      value={role}
                      onChange={handleSelect}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                      }}
                    >
                      {roles.map((role) => (
                        <FormControlLabel
                          key={role}
                          value={role}
                          control={<Radio />}
                          label={role}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              </div>
            </div>
            <div className="userUpdateRight">
              <button type="submit" className="userUpdateButton">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdUser;
