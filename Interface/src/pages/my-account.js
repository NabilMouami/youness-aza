"use client";
import dynamic from "next/dynamic";
import { config_url } from "@/util/config";
import axios from "axios";
import Image from "next/image";
import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import Layout from "@/components/layout/Layout";
const CartItems = dynamic(() => import("@/components/elements/CartItems"), {
  loading: () => <p>Loading...</p>,
});
import Link from "next/link";
import { useSelector } from "react-redux";
export default function MyAccount() {
  const { customerInfo } = useSelector((state) => state.Customer) || {};
  const [firstName, setNom] = useState(customerInfo.firstName);
  const [lastName, setPrenom] = useState(customerInfo.lastName);
  const [email, setEmail] = useState(customerInfo.email);
  const [telephone, setTelephone] = useState(customerInfo.telephone);

  const [password, setPassword] = useState("");
  const post = { firstName, lastName, email, password, telephone };
  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .put(`${config_url}/api/customers/${customerInfo.id}`, post)
      .then(() => {
        toast.success("Changement Success !!", {
          position: "bottom-left",
        });
      });
  };

  return (
    <Fragment>
      <Layout headerStyle={3} footerStyle={1}>
        <section className="track-area pt-80 pb-40">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-sm-12">
                <div className="tptrack__product mb-40">
                  <form
                    className="tptrack__content grey-bg-3"
                    onSubmit={submitHandler}
                  >
                    <div className="tptrack__item d-flex mb-20">
                      <div className="tptrack__item-icon">
                        <img src="/assets/img/icon/sign-up.png" alt="" />
                      </div>
                      <div className="tptrack__item-content">
                        <h4 className="tptrack__item-title">My Account</h4>
                        <p>
                          Your personal data will be used to support your
                          experience throughout this website, to manage access
                          to your account.
                        </p>
                      </div>
                    </div>
                    <div className="tptrack__id mb-10">
                      <div className="form-sign">
                        <span>
                          <i className="fal fa-user" />
                        </span>
                        <input
                          defaultValue={customerInfo.lastName}
                          type="text"
                          placeholder="nom:"
                          onChange={(event) => {
                            setNom(event.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="tptrack__id mb-10">
                      <div className="form-sign">
                        <span>
                          <i className="fal fa-user" />
                        </span>
                        <input
                          defaultValue={customerInfo.firstName}
                          type="text"
                          placeholder="prenom:"
                          onChange={(event) => {
                            setPrenom(event.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <div className="tptrack__id mb-10">
                      <div className="form-sign">
                        <span>
                          <i className="fal fa-envelope" />
                        </span>
                        <input
                          defaultValue={customerInfo.email}
                          type="email"
                          placeholder="Email address"
                          onChange={(event) => {
                            setEmail(event.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="tptrack__id mb-10">
                      <div className="form-sign">
                        <span>
                          <i className="fal fa-phone" />
                        </span>
                        <input
                          type="text"
                          defaultValue={telephone}
                          placeholder="Numero Telephone"
                          onChange={(e) => setTelephone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="tptrack__email mb-10">
                      <div className="form-sign">
                        <span>
                          <i className="fal fa-key" />
                        </span>
                        <input
                          type="password"
                          placeholder="New Password To Change"
                          defaultValue={password}
                          onChange={(event) => {
                            setPassword(event.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="tpsign__account">
                      Total Coins Balance:
                      <span className="ml-10 text-success">
                        {customerInfo.balance}
                      </span>
                      <img
                        width="20"
                        height="20"
                        src="/assets/img/logo/coins.png"
                        className="mr-10"
                        alt="icon-coins"
                      />
                    </div>
                    <div className="tptrack__btn">
                      <button
                        className="tptrack__submition tpsign__reg"
                        type="submit"
                      >
                        Update Now
                        <i className="fal fa-long-arrow-right" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </Fragment>
  );
}
