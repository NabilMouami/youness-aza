"use client";

import WishlistItems from "@/components/elements/WishlistItems";
import Layout from "@/components/layout/Layout";
import { Fragment } from "react";

export default function Wishlist() {
  return (
    <Fragment>
      <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Wishlist">
        <div
          className="cart-area pt-80 pb-80 wow fadeInUp"
          data-wow-duration=".8s"
          data-wow-delay=".2s"
        >
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="table-content table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="product-thumbnail">Image</th>
                        <th className="cart-product-name">Produit Nom</th>
                        <th className="product-price">Taille</th>
                        <th className="product-subtotal">Prix ​​unitaire</th>
                        <th className="product-add-to-cart">
                          Ajoute Au Panier
                        </th>
                        <th className="product-remove">Retirer</th>
                      </tr>
                    </thead>
                    <tbody>
                      <WishlistItems />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </Fragment>
  );
}
