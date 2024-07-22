import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  RiNotification3Line,
  RiArrowDownSLine,
  RiSettings3Line,
  RiLogoutCircleRLine,
  RiThumbUpLine,
  RiChat3Line,
  RiTranslate,
  RiUser2Fill,
} from "react-icons/ri";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import "./Nav.modules.css";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Nav = ({ children }) => {
  const [show, setShow] = useState(true);
  const [orders, setOrders] = useState([]);
  console.log(orders);
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
      url: "/app/list-orders",
      i_class: "bx bx-cart-add",
      link_title: "Orders",
      key: 2,
    },
    {
      url: "/app/list-categories",
      i_class: "bx bx-purchase-tag-alt",
      link_title: "Categoies",
      key: 3,
    },
    {
      url: "/app/ajoute-produit-to-group",
      i_class: "bx bx-link",
      link_title: "Relation Products",
      key: 4,
    },

    {
      url: "/app/hiden-produits",
      i_class: "bx bxs-low-vision",
      link_title: "Hiden Produits",
      key: 5,
    },
    {
      url: "utilisateurs",
      i_class: "bx bxs-user ",
      link_title: "Users",
      key: 6,
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
        <Menu
          menuButton={
            <MenuButton className="relative hover:bg-secondary-100 p-2 rounded-lg transition-colors">
              <RiNotification3Line />
              <span className="absolute -top-0.5 right-0 bg-primary py-0.5 px-[5px] box-content text-black rounded-full text-[8px] font-bold">
                {orders.length}
              </span>
            </MenuButton>
          }
          align="end"
          arrow
          transition
          arrowClassName="bg-secondary-100"
          menuClassName="bg-secondary-100 p-4"
        >
          <h1 className="text-gray-300 text-center font-medium">
            Notificaciones (2)
          </h1>
          <hr className="my-6 border-gray-500" />
          <MenuItem className="p-0 hover:bg-transparent">
            <Link
              to="/"
              className="text-gray-300 flex flex-1 items-center gap-4 py-2 px-4 hover:bg-secondary-900 transition-colors rounded-lg"
            >
              <img
                src="https://img.freepik.com/foto-gratis/feliz-optimista-guapo-gerente-ventas-latina-apuntando-lado-mirando-camara_1262-12679.jpg"
                className="w-8 h-8 object-cover rounded-full"
              />
              <div className="text-sm flex flex-col">
                <div className="flex items-center justify-between gap-4">
                  <span>Jorge Luis Trejo</span>{" "}
                  <span className="text-[8px]">21/10/2022</span>
                </div>
                <p className="text-gray-500 text-xs">
                  Lorem ipsum dolor sit amet...
                </p>
              </div>
            </Link>
          </MenuItem>
          <MenuItem className="p-0 hover:bg-transparent">
            <Link
              to="/"
              className="text-gray-300 flex flex-1 items-center gap-4 py-2 px-4 hover:bg-secondary-900 transition-colors rounded-lg"
            >
              <RiThumbUpLine className="p-2 bg-blue-200 text-blue-700 box-content rounded-full" />
              <div className="text-sm flex flex-col">
                <div className="flex items-center justify-between gap-4">
                  <span>Nuevo like</span>{" "}
                  <span className="text-[8px]">21/10/2022</span>
                </div>
                <p className="text-gray-500 text-xs">
                  A Jorge Trejo le gusta tu pub...
                </p>
              </div>
            </Link>
          </MenuItem>
          <MenuItem className="p-0 hover:bg-transparent">
            <Link
              to="/"
              className="text-gray-300 flex flex-1 items-center gap-4 py-2 px-4 hover:bg-secondary-900 transition-colors rounded-lg"
            >
              <RiChat3Line className="p-2 bg-yellow-200 text-yellow-700 box-content rounded-full" />
              <div className="text-sm flex flex-col">
                <div className="flex items-center justify-between gap-4">
                  <span>Nuevo comentario</span>{" "}
                  <span className="text-[8px]">21/10/2022</span>
                </div>
                <p className="text-gray-500 text-xs">
                  Jorge Trejo ha comentado tu...
                </p>
              </div>
            </Link>
          </MenuItem>
          <hr className="my-6 border-gray-500" />
          <MenuItem className="p-0 hover:bg-transparent flex justify-center cursor-default">
            <Link
              to="/"
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Todas las notificaciones
            </Link>
          </MenuItem>
        </Menu>
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
