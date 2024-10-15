"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CartShow from "@/components/elements/CartShow";
import WishListShow from "@/components/elements/WishListShow";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { config_url } from "@/util/config";
import HeaderMobSticky from "../HeaderMobSticky";
import HeaderSticky from "../HeaderSticky";
import HeaderTabSticky from "../HeaderTabSticky";
import { loadAllCategories } from "@/features/categorySlice";
import { searchProducts, loadAllProducts } from "@/features/productsSlice";

export default function Header3({
  scroll,
  isMobileMenu,
  handleMobileMenu,
  isCartSidebar,
  handleCartSidebar,
}) {
  const filteredProducts = useSelector(
    (state) => state.Products.filteredProducts
  );

  const [allCollections, setAllCollections] = useState([]);
  const [query, setQuery] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const [isToggled, setToggled] = useState(false);
  const handleToggle = () => setToggled(!isToggled);
  const dispatch = useDispatch();
  useEffect(() => {
    axios.get(`${config_url}/api/collections`).then(async (res) => {
      await dispatch(loadAllCategories(res.data));
      await setAllCollections(res.data);
    });
  }, []);
  useEffect(() => {
    try {
      axios.get(`${config_url}/api/products`).then(async (res) => {
        await dispatch(loadAllProducts(res.data));
      });
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  }, []);
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    setDropdownVisible(!!value);
    dispatch(searchProducts(value));
  };
  return (
    <>
      <header>
        <div className="header-top tertiary-header-top space-bg">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-7 col-lg-12 col-md-12 ">
                <div className="header-welcome-text">
                  <span className="mr-10">
                    Livraison gratuite pour les commandes supérieures à 1000Dh
                  </span>
                  <Link href="/collections/sneakers">
                    Achetez maintenant <i className="fal fa-long-arrow-right" />
                  </Link>
                </div>
              </div>
              <div className="col-xl-5 d-none d-xl-block">
                <div className="headertoplag d-flex align-items-center justify-content-end">
                  <div className="headertoplag__lang">
                    <ul>
                      <li>
                        <Link href="/sign-in">
                          <i className="fal fa-user" />
                          Compte
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="menu-top-social">
                    <Link
                      href="https://www.facebook.com/yazasnkrz/"
                      target="_blank"
                    >
                      {" "}
                      <i className="fab fa-facebook-f" />
                    </Link>
                    <Link
                      href="https://www.instagram.com/yaza_snkrz/"
                      target="_blank"
                    >
                      {" "}
                      <i className="fab fa-instagram" />
                    </Link>
                    <Link
                      href="https://www.tiktok.com/@yaza_snkrz"
                      target="_blank"
                    >
                      {" "}
                      <i className="fab fa-tiktok" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="logo-area green-logo-area mt-30 d-none d-xl-block">
          <div className="container">
            <div className="row">
              <div className="col-xl-12 col-lg-9">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="header-search-bar">
                    <form>
                      <div className="search-info p-relative">
                        <button className="header-search-icon">
                          <i className="fal fa-search" />
                        </button>
                        <input
                          type="text"
                          value={query}
                          onChange={handleSearch}
                          placeholder="Search products..."
                        />
                      </div>
                    </form>

                    <div style={{ zIndex: 9999 }} className="position-relative">
                      {isDropdownVisible && (
                        <div className="position-absolute bg-white w-100 mt-2 shadow-lg border rounded">
                          <div className="p-2 text-muted">PRODUCTS</div>
                          {filteredProducts.length > 0 ? (
                            <div className="border-top border-bottom">
                              {filteredProducts.map((product) => (
                                <div
                                  key={product.id}
                                  className="d-flex align-items-center p-2 hover-bg-light"
                                >
                                  <Image
                                    width={50}
                                    height={50}
                                    src={product?.image}
                                    alt={product.meta_image}
                                    className="w-10 h-10 object-cover me-3"
                                  />
                                  <div>
                                    <div className="fw-semibold">
                                      <a
                                        href={`/produits/${product?.name_by_filtered}`}
                                      >
                                        {product.name}
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-2 text-muted">
                              No products found
                            </div>
                          )}
                          {query && (
                            <div className="p-2 text-primary cursor-pointer hover-underline">
                              Search for "{query}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-xl-1 col-lg-3 ml-30">
                    <div className="logo">
                      <Link href="/">
                        <Image
                          src="/assets/img/logo/logo.webp"
                          alt="yazasneakers"
                          height={100}
                          width={100}
                        />
                      </Link>
                    </div>{" "}
                  </div>

                  <ul className="cat-menu__list d-flex align-items-center ml-50 mr-50">
                    <li>
                      <a className="fw-bolder" href="/genre/homme">
                        Hommes
                      </a>
                    </li>
                    <li>
                      <a className="fw-bolder" href="/genre/femme">
                        Femmes
                      </a>
                    </li>
                    <li>
                      <a className="fw-bolder" href="/genre/enfant">
                        Enfants
                      </a>
                    </li>
                  </ul>
                  <div className="header-meta header-brand d-flex align-items-center">
                    <div className="header-meta__social d-flex align-items-center gap-2">
                      <button
                        className="header-cart p-relative tp-cart-toggle"
                        onClick={handleCartSidebar}
                      >
                        <i className="fal fa-shopping-cart" />
                        <CartShow />
                      </button>
                      <Link href="/sign-in">
                        <i className="fal fa-user" />
                      </Link>
                      <Link
                        href="/wishlist"
                        className="header-cart p-relative tp-cart-toggle"
                      >
                        <i className="fal fa-heart" />
                        <WishListShow />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main-menu-area tertiary-main-menu mt-30 d-none d-xl-block ml-40 mr-40 mb-5">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-3 mt-10">
                <div className="cat-menu__category p-relative">
                  <span onClick={handleToggle}>
                    <i className="fal fa-bars" />
                    Collections
                  </span>
                  <div
                    className="category-menu"
                    style={{ display: `${isToggled ? "block" : "none"}` }}
                  >
                    <ul className="cat-menu__list">
                      {allCollections?.map((item) => (
                        <li key={item.id}>
                          <a href={`/collections/${item.name}`}>
                            <Image
                              src={item.image}
                              alt={item.meta_image}
                              width={40}
                              height={40}
                              className="rounded-circle mr-4"
                            />
                            <span>{item.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-8 col-lg-8">
                <div className="main-menu">
                  <nav id="mobile-menu">
                    <ul>
                      <li className="ml-40">
                        <a href="/new">Nouveautés</a>
                      </li>
                      <li className="ml-40">
                        <a href="/collections/sneakers">Sneakers</a>
                      </li>
                      <li className="ml-40">
                        <a href="/collections/accessoire">Accessoires</a>
                      </li>
                      <li className="ml-40">
                        <a href="/on-sale">Sale</a>
                      </li>
                      <li className="ml-60">
                        <a href="/blog">Blog</a>
                      </li>

                      <li className="ml-60">
                        <a href="/cart">Panier</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="col-xl-2 col-lg-2">
                <div className="menu-contact">
                  <ul>
                    <li>
                      <div className="menu-contact__item">
                        <div className="menu-contact__icon">
                          <i className="fal fa-phone" />
                        </div>
                        <div className="menu-contact__info">
                          <Link
                            href="https://wa.me/212626309597"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            +212 626 30 9597
                          </Link>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <HeaderSticky
        scroll={scroll}
        isCartSidebar={isCartSidebar}
        handleCartSidebar={handleCartSidebar}
      />
      <HeaderTabSticky
        scroll={scroll}
        isMobileMenu={isMobileMenu}
        handleMobileMenu={handleMobileMenu}
        isCartSidebar={isCartSidebar}
        handleCartSidebar={handleCartSidebar}
      />
      <HeaderMobSticky
        scroll={scroll}
        isMobileMenu={isMobileMenu}
        handleMobileMenu={handleMobileMenu}
        isCartSidebar={isCartSidebar}
        handleCartSidebar={handleCartSidebar}
      />
    </>
  );
}
