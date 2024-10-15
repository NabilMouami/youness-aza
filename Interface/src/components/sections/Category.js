"use client";

import Link from "next/link";
import Image from "next/image";
import axios from "axios";

import React, { useState, useEffect } from "react";
import { config_url } from "@/util/config";
import { useDispatch } from "react-redux";
import { loadAllCategories } from "@/features/categorySlice";
export default function Category() {
  const [allCategories, setAllCategories] = useState([]);
  console.log(allCategories);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${config_url}/api/categories`).then(async (res) => {
      await dispatch(loadAllCategories(res.data));
      await setAllCategories(res.data);
    });
  }, []);
  return (
    <>
      <section className="category-area pt-70">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="tpsection mb-40">
                <h4 className="tpsection__title">
                  Top{" "}
                  <span>
                    {" "}
                    Categories{" "}
                    <img src="/assets/img/icon/title-shape-01.jpg" alt="" />
                  </span>
                </h4>
              </div>
            </div>
          </div>
          <div className="custom-row category-border pb-45 justify-content-xl-between">
            {allCategories?.map((item) => (
              <div className="tpcategory mb-40" key={item.id}>
                <div
                  className="tpcategory__icon p-relative"
                  onClick={() => handleNavigation(item.category_names)}
                >
                  <Image
                    src={`${config_url}/categories/${item.image}`}
                    alt={item.meta_image}
                    className="fn__svg"
                    width={100}
                    height={100}
                  />
                  <span>20</span>
                </div>
                <div className="tpcategory__content">
                  <h5 className="tpcategory__title">
                    <Link href={`/produit/${item.name}`}>{item.name}</Link>
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
