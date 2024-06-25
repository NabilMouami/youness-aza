import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "./Nav.modules.css";

const Nav = ({ children }) => {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  const showSideBar = () => {
    setShow(!show);
  };
  const Logout = async () => {
    await localStorage.removeItem("token");
    await navigate("/");
  };
  const links = [
    {
      url: "/app/list-produits",
      i_class: "bx bxl-unity",
      link_title: "Products",
      key: 1,
    },
    {
      url: "/app/categories",
      i_class: "bx bxl-deezer",
      link_title: "Categoies",
      key: 2,
    },
    {
      url: "/app/hiden-produits",
      i_class: "bx bxs-low-vision",
      link_title: "Hiden Produits",
      key: 3,
    },
    {
      url: "utilisateurs",
      i_class: "bx bxs-user ",
      link_title: "Users",
      key: 4,
    },
  ];

  return (
    <>
      <header
        className={`header ${show ? "add_body_padding" : " "}  `}
        id="admin-dash-header"
      >
        <div className="header_toggle">
          <i
            className={`bx bx-menu ${show ? "bx-x" : " "}`}
            id="header-toggle"
            onClick={showSideBar}
          ></i>
        </div>
        <div className="dropdown sidebar-profile">
          <span
            className="d-flex align-items-center justify-content-center p-3 link-dark text-decoration-none dropdown-toggle"
            id="dropdownUser3"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://img.icons8.com/color/48/000000/circled-user-male-skin-type-4--v1.png"
              alt="avatar"
              className="avatar rounded-circle"
            />
          </span>
        </div>
      </header>

      <aside
        className={`sidebar ${show ? "review" : " "} `}
        id="admin-dash-nav"
      >
        <nav className="admin-dash-nav">
          <div>
            <div className="nav_logo">
              {" "}
              <img src="/logo.webp" alt="logo" className="logo" />{" "}
            </div>
            <div className="nav_list">
              {links.map((link) => (
                <NavLink to={link.url} className="nav_link " key={link.key}>
                  <i className={`${link.i_class}  nav_icon`}></i>{" "}
                  <span className="nav_name">{link.link_title}</span>{" "}
                </NavLink>
              ))}
            </div>
          </div>
          <span className="nav_link" onClick={() => Logout()}>
            {" "}
            <i className="bx bx-log-out bx-sm nav_icon"></i>{" "}
            <span className="nav_name">SignOut</span>{" "}
          </span>
        </nav>
      </aside>

      <main className={` ${show ? "add_body_padding" : "main"} `}>
        {" "}
        {children}{" "}
      </main>
    </>
  );
};

export default Nav;
