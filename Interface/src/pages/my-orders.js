"use client";
import dynamic from "next/dynamic";
import { config_url } from "@/util/config";
import axios from "axios";
import Image from "next/image";
import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

import Layout from "@/components/layout/Layout";
const CartItems = dynamic(() => import("@/components/elements/CartItems"), {
  loading: () => <p>Loading...</p>,
});
import Link from "next/link";
import { useSelector } from "react-redux";
export default function Checkout() {
  const { customerInfo } = useSelector((state) => state.Customer) || {};
  const [listOrdersCustomer, setListOrdersCustomer] = useState([]);
  const [listOrders, setListOrders] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [coinsPending, setCoinsPending] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);

  useEffect(() => {
    if (!customerInfo || !listOrders[0]) {
      setCoinsPending(0);
      setTotalCoins(0);
      return; // Exit early if data is missing
    }

    const currentDate = new Date();
    const deliveryDate = new Date(customerInfo.delivery_date || "");

    // Check if delivery_date is more than a month from the current date
    const oneMonthLater = new Date(
      currentDate.setMonth(currentDate.getMonth() + 1)
    );

    let pendingCoins = customerInfo.coins_pending || 0; // Default to 0 if undefined

    if (deliveryDate > oneMonthLater) {
      pendingCoins = 0; // Set coins_pending to 0 if delivery_date is more than a month away
    }

    setCoinsPending(pendingCoins);

    const balance = listOrders[0]?.balance || 0;

    // Check if coins_pending equals balance
    if (pendingCoins === balance) {
      setTotalCoins(balance);
    } else {
      // Calculate total coins by adding balance and pending coins
      setTotalCoins(balance + pendingCoins);
    }
  }, [customerInfo, listOrders]);

  useEffect(() => {
    axios
      .get(`${config_url}/api/customers/orders/${customerInfo?.id}`)
      .then((res) => {
        console.log("API Response:", res.data);

        // Ensure proper data structure
        if (res.data && res.data.data) {
          setListOrdersCustomer(res.data.data.data);
          setListOrders(res.data.data.data || []); // Update this based on actual structure
        }
      })
      .catch((err) => {
        console.error("API Error:", err);
      });
  }, []);
  const totalSumPrice = listOrders.reduce((accumulator, order) => {
    return accumulator + order.total_price_sum;
  }, 0);

  useEffect(() => {
    if (listOrders.length > 0) {
      // Parse the original date string using dayjs
      const parsedDate = dayjs(
        listOrders[listOrders.length - 1]?.date_order,
        "YYYY-MM-DD HH:mm"
      );

      // Calculate the new date by adding 1 month
      const availableDate = parsedDate.add(1, "month");

      // Format the new date as a string and set it in the state
      setNewDate(availableDate.format("YYYY-MM-DD HH:mm"));
    }
  }, [listOrders]);

  return (
    <Fragment>
      <Layout headerStyle={3} footerStyle={1}>
        <section
          className="cart-area pt-80 pb-80 wow fadeInUp"
          data-wow-duration=".8s"
          data-wow-delay=".2s"
        >
          <div className="container">
            <div className="row">
              <div className="col-12">
                {listOrders.length === 0 ? (
                  // Display "No orders made" when listOrders is empty
                  <div className="text-center">
                    <h2>Aucune commande effectuée</h2>
                  </div>
                ) : (
                  // Display table and order total information if listOrders is not empty
                  <form>
                    <div className="table-content table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="product-thumbnail">Image</th>
                            <th className="cart-product-name">Produit Nom</th>
                            <th className="cart-product-name">Size</th>
                            <th className="product-price">Prix ​​unitaire</th>
                            <th className="product-price">Date Order</th>
                            <th className="product-remove">Delivery Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listOrders?.map((data, index) => {
                            return (
                              <tr className="cart-item" key={index}>
                                <td className="product-thumbnail">
                                  <Image
                                    src={data.product_image}
                                    alt="cart added product"
                                    width={80}
                                    height={80}
                                  />
                                </td>

                                <td className="product-name">
                                  {data.product_name}
                                </td>
                                <td className="product-name">
                                  <button
                                    className="btn btn-sm btn-dark text-white"
                                    style={{
                                      borderRadius: "25px",
                                      padding: "0.25rem 0.75rem",
                                    }} // Smaller padding
                                  >
                                    {data.size}
                                  </button>
                                </td>

                                <td className="product-price">
                                  {data.total_price_sum} Dh
                                </td>

                                <td className="product-price">
                                  {data.date_order}
                                </td>
                                <td className="product-remove">
                                  {data.delivery_status}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="row justify-content-end">
                      <div className="col-md-5 ">
                        <div className="cart-page-total">
                          <h2>Order total Informations</h2>
                          <ul className="mb-20">
                            <li>
                              Total Price Ordered{" "}
                              <span>{totalSumPrice || 0} Dh</span>
                            </li>
                            <li>
                              Total Coins: <span>{totalCoins || 0} Coins.</span>{" "}
                              <span>
                                ({coinsPending !== undefined ? coinsPending : 0}{" "}
                                Pending)
                              </span>
                            </li>
                            <li>
                              Coins available after Date:{" "}
                              <span>
                                {customerInfo.delivery_date ||
                                  listOrders[listOrders.length - 1]
                                    ?.date_order}{" "}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </Fragment>
  );
}
