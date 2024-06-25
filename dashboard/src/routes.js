import { Navigate, useRoutes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import PublicRoutesLayout from "./layouts/PublicRoutesLayout";
import ListUsers from "./pages/auth/ListUsers";
import AddProduit from "./pages/produit/AddProduit";
import ListProduits from "./pages/produit/ListProduits";
import HidenProduits from "./pages/produit/HidenProduits";
import DetailsProd from "./pages/produit/DetailsProd";
import UpdProduit from "./pages/produit/UpdProduit";

//import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Page404 from "./pages/page404";
import AddCategory from "./pages/category/AddCategory";
export default function Router() {
  return useRoutes([
    {
      path: "/app",
      element: <DashboardLayout />,
      children: [
        { path: "utilisateurs", element: <ListUsers /> },
        { path: "ajoute-produit", element: <AddProduit /> },
        { path: "list-produits", element: <ListProduits /> },
        { path: "hiden-produits", element: <HidenProduits /> },
        { path: "changer-produit/:id", element: <UpdProduit /> },
        { path: "details-produit/:id", element: <DetailsProd /> },
        { path: "ajoute-categorie", element: <AddCategory /> },
      ],
    },
    {
      path: "/",
      element: <PublicRoutesLayout />,
      children: [
        { index: true, element: <Login /> },
        { path: "page404", element: <Page404 /> },
      ],
    },
  ]);
}
