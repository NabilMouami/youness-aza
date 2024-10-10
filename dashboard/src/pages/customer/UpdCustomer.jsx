import { useState } from "react";
import { RiMailAddFill, RiUser2Fill, RiUser2Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import { config_url } from "../../config";
import "./users.css";

const roles = [
  "Fornisseur",
  "Waiter",
  "Stock Manager",
  "Admin",
  "Super-Admin",
  "Plancha",
  "Friteuse",
  "Saladerie",
  "Dressing",
];

function UpdCustomer() {
  const Detail = useSelector((state) => state.Load);
  const { Col } = Detail;
  const [firstName, setNom] = useState(Col.firstName);
  const [lastName, setPrenom] = useState(Col.lastName);
  const [email, setEmail] = useState(Col.email);
  const [telephone, setTelephone] = useState(Col.telephone);

  const [password, setPassword] = useState("");

  const post = { firstName, lastName, email, password, telephone };
  const submitHandler = (e) => {
    e.preventDefault();
    axios.put(`${config_url}/api/customers/${Col.id}`, post).then(() => {
      toast.success("Changement Success !!", {
        position: "bottom-left",
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
                {Col.firstName + " " + Col.lastName}
              </span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Détails du compte</span>
            <div className="userShowInfo">
              <RiUser2Fill className="userShowIcon" />
              <span className="userShowInfoTitle">{Col.firstName}</span>
            </div>
            <div className="userShowInfo">
              <RiUser2Line className="userShowIcon" />
              <span className="userShowInfoTitle">{Col.lastName}</span>
            </div>
            <span className="userShowTitle">Détails du contact</span>
            <div className="userShowInfo">
              <RiMailAddFill className="userShowIcon" />
              <span className="userShowInfoTitle">{Col.email}</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
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
                  readOnly
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
                  readOnly
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  placeholder="email@gmail.com"
                  className="userUpdateInput"
                  defaultValue={Col.email}
                  readOnly
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
                <label>Numero TelePhone:</label>
                <input
                  type="text"
                  placeholder="+212........"
                  className="userUpdateInput"
                  defaultValue={Col.telephone}
                  onChange={(event) => {
                    setTelephone(event.target.value);
                  }}
                  readOnly
                />
              </div>
            </div>
            <div className="mt-10">
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

export default UpdCustomer;
