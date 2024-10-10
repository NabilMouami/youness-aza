import { useRoutes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import PublicRoutesLayout from "./layouts/PublicRoutesLayout";
import ListUsers from "./pages/auth/ListUsers";
import AddUser from "./pages/auth/AddUser";
import AddProduit from "./pages/produit/AddProduit";
import ListProduits from "./pages/produit/ListProduits";
import HidenProduits from "./pages/produit/HidenProduits";
import DetailsProd from "./pages/produit/DetailsProd";
import UpdProduit from "./pages/produit/UpdProduit";

//import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Page404 from "./pages/page404";
import AddCategory from "./pages/category/AddCategory";
import AddProdGroup from "./pages/produitgroup/AddProdGroup";
import AddGroupe from "./pages/produitgroup/AddGroupe";
import ListOrders from "./pages/order/ListOrders";
import ListCategories from "./pages/category/ListCategories";
import EditOrder from "./pages/order/EditOrder";
import ListCustomers from "./pages/customer/ListCustomers";
import CustomerDetailsOrder from "./pages/customer/CustomerDetailsOrder";
import AddBlog from "./pages/blog/AddBlog";
import ListBlogs from "./pages/blog/ListBlogs";
import ListCollections from "./pages/collection/ListCollections";
import AddCollection from "./pages/collection/AddCollection";
import ListProdRelGroup from "./pages/produitgroup/ListProdRelGroup";
import UpdCustomer from "./pages/customer/UpdCustomer";
import UpdUser from "./pages/auth/UpdUser";
export default function Router() {
  return useRoutes([
    {
      path: "/app",
      element: <DashboardLayout />,
      children: [
        { path: "utilisateurs", element: <ListUsers /> },
        { path: "ajoute-utilisateur", element: <AddUser /> },
        { path: "changer-user/:id", element: <UpdUser /> },
        { path: "clients", element: <ListCustomers /> },
        { path: "clients/orders/:id", element: <CustomerDetailsOrder /> },
        {
          path: "clients/changer-infos-client/:id",
          element: <UpdCustomer />,
        },
        { path: "ajoute-produit", element: <AddProduit /> },
        { path: "list-produits", element: <ListProduits /> },
        { path: "hiden-produits", element: <HidenProduits /> },
        { path: "changer-produit/:id", element: <UpdProduit /> },
        { path: "details-produit/:id", element: <DetailsProd /> },
        { path: "ajoute-categorie", element: <AddCategory /> },
        { path: "list-categories", element: <ListCategories /> },
        { path: "ajoute-collection", element: <AddCollection /> },

        { path: "list-collections", element: <ListCollections /> },
        { path: "list-groupes", element: <ListProdRelGroup /> },

        { path: "ajoute-blog", element: <AddBlog /> },
        { path: "list-blogs", element: <ListBlogs /> },

        { path: "ajoute-produit-to-group", element: <AddProdGroup /> },
        { path: "ajoute-groupe", element: <AddGroupe /> },
        { path: "list-orders", element: <ListOrders /> },
        { path: "details-order/:id", element: <EditOrder /> },
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
