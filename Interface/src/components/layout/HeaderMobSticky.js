import Link from "next/link";
import CartShow from "../elements/CartShow";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/features/customerSlice";
import { useRouter } from "next/router";

export default function HeaderMobSticky({
  scroll,
  isMobileMenu,
  handleMobileMenu,
  isCartSidebar,
  handleCartSidebar,
}) {
  const { customerInfo } = useSelector((state) => state.Customer) || {};
  const dispatch = useDispatch();
  const router = useRouter();
  const Logout = async () => {
    await localStorage.removeItem("token");
    await dispatch(logout());
    await router.push("/");
  };

  return (
    <>
      <div
        id="header-mob-sticky"
        className={`tp-md-lg-header d-md-none pt-20 pb-20 ${
          scroll ? "header-sticky" : ""
        }`}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-3 d-flex align-items-center">
              <div className="header-canvas flex-auto">
                <button className="tp-menu-toggle" onClick={handleMobileMenu}>
                  <i className="far fa-bars" />
                </button>
              </div>
            </div>
            <div className="col-6 d-flex justify-content-center align-items-center">
              <div className="logo text-center">
                <Link href="/">
                  <Image
                    src="/assets/img/logo/logo.webp"
                    alt="yazasneakers"
                    height={70}
                    width={70}
                  />
                </Link>
              </div>
              {customerInfo && Object.keys(customerInfo).length !== 0 && (
                <div className="header-meta__search-5">
                  <div className="header-meta__lang">
                    <ul className="font-small">
                      <li>
                        <a>
                          <i className="fal fa-user" />
                          {customerInfo.firstName} {customerInfo.lastName}
                          <span>
                            <i className="fal fa-angle-down" />
                          </span>
                        </a>
                        <ul className="header-meta__lang-submenu">
                          <li onClick={() => Logout()}>
                            <i className="fa fa-sign-out-alt text-success"></i>
                            Logout
                          </li>
                          <li>
                            {" "}
                            <img
                              width="20"
                              height="20"
                              src="/assets/img/logo/coins.png"
                              alt="coins-logo"
                            />{" "}
                            {customerInfo?.balance} Coins
                          </li>
                          <li>
                            <i className="fa fa-receipt text-success"></i>

                            <Link href="/my-orders">Commandes</Link>
                          </li>
                          <li>
                            <i className="fal fa-user" />

                            <Link href="/my-account"> Mon Compte</Link>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="col-3">
              <div className="header-meta-info d-flex align-items-center justify-content-end ml-25">
                <div className="header-meta m-0 d-flex align-items-center">
                  <div className="header-meta__social d-flex align-items-center">
                    <button
                      className="header-cart p-relative tp-cart-toggle"
                      onClick={handleCartSidebar}
                    >
                      <i className="fal fa-shopping-cart" />
                      <CartShow />
                    </button>
                    {customerInfo && Object.keys(customerInfo).length === 0 && (
                      <Link href="/sign-in">
                        <i className="fal fa-user" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
