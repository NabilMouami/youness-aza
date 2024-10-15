"use client";

import { deleteCart } from "@/features/shopSlice";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useMemo } from "react";

export default function HeaderCart({ isCartSidebar, handleCartSidebar }) {
  const { cart } = useSelector((state) => state.shop) || {};

  const dispatch = useDispatch();

  // delete cart item
  const deleteCartHandler = (id, size) => {
    dispatch(deleteCart({ id, size }));
  };

  // qty handler
  const total = useMemo(() => {
    let sum = 0;

    cart?.forEach((data) => {
      const price =
        data.item.price_promo !== 0 ? data.item.price_promo : data.item.price;
      sum += price;
    });
    return sum;
  }, [cart]);

  return (
    <Fragment>
      <div
        className={`tpcartinfo tp-cart-info-area p-relative ${
          isCartSidebar ? "tp-sidebar-opened" : ""
        }`}
      >
        <button className="tpcart__close" onClick={handleCartSidebar}>
          <i className="fal fa-times" />
        </button>
        <div className="tpcart">
          <h4 className="tpcart__title">Votre Panier</h4>
          <div className="tpcart__product">
            <div className="tpcart__product-list">
              <ul>
                {cart?.map((data, i) => (
                  <li key={i}>
                    <div className="tpcart__item">
                      <div className="tpcart__img">
                        <img src={data.item.image} alt="tpcart" />
                        <div
                          className="tpcart__del"
                          onClick={() =>
                            deleteCartHandler(data.item?.id, data.size)
                          }
                        >
                          <button>
                            <i className="far fa-times-circle" />
                          </button>
                        </div>
                      </div>
                      <div className="tpcart__content">
                        <div className="d-flex justify-content-center align-items-center">
                          <span className="tpcart__content-title">
                            <Link
                              href={`/produits/${data.item.name_by_filtered}`}
                            >
                              {data.item.name}
                            </Link>
                          </span>
                          <span
                            className="btn btn-sm btn-dark text-white ml-20"
                            style={{
                              borderRadius: "25px",
                              padding: "0.25rem 0.3rem",
                              fontSize: "0.5rem",
                              cursor: "pointer", // Disable cursor if blocked
                            }}
                          >
                            {data.size}
                          </span>
                        </div>

                        <div className="tpcart__cart-price">
                          <span className="new-price">
                            {data.item.price_promo !== 0
                              ? data.item.price_promo
                              : data.item.price}{" "}
                            Dh
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="tpcart__checkout">
              <div className="tpcart__total-price d-flex justify-content-between align-items-center">
                <span> Subtotal:</span>
                <span className="heilight-price">{total.toFixed(2)} Dh</span>
              </div>
              <div className="tpcart__checkout-btn">
                <Link className="tpcart-btn mb-10" href="/cart">
                  Voir le panier{" "}
                </Link>
                <a className="tpcheck-btn" href="/checkout">
                  Commander
                </a>
              </div>
            </div>
          </div>
          <div className="tpcart__free-shipping text-center">
            <span>
              Livraison gratuite pour les commandes <b>supérieures à 1000Dh</b>
            </span>
          </div>
        </div>
      </div>
      <div
        className={`cartbody-overlay ${isCartSidebar ? "opened" : ""}`}
        onClick={handleCartSidebar}
      />
    </Fragment>
  );
}
