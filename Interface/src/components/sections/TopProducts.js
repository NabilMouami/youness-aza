"use client";
import axios from "axios";

import { Fragment, useState, useEffect } from "react";
import { config_url } from "@/util/config";
import Preloader from "@/components/elements/Preloader";
import FilterDataLatestArrival from "../shop/FilterDataLatestArrival";
export default function TopProducts() {
  const [data, setData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${config_url}/api/products/top-products`)
      .then((res) => {
        setData(res.data);
        setFilteredJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Preloader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Fragment>
      <div className="pt-40">
        <h3 className="text-center fw-bolder fs-4 text-uppercase">
          Dernières arrivées de produits:
        </h3>
        <div className="product-area pt-30 pb-20">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="row row-cols-xxl-6 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-2">
                  <FilterDataLatestArrival
                    showItem={4}
                    style={1}
                    //showPagination
                    filterData={filteredJobs}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
