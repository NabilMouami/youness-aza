"use client";

import { useState, useEffect, Fragment } from "react";
import Pagination from "@/components/blog/Pagination";
import PuffLoader from "react-spinners/PuffLoader";

import ShopCardOnSale from "./ShopCardOnSale";

const FilterDataOnSale = ({ showItem, showPagination, filterData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const showLimit = showItem;
  const paginationItem = 4;

  const [pagination, setPagination] = useState([]);
  const [limit, setLimit] = useState(showLimit);
  const [pages, setPages] = useState(Math.ceil(filterData.length / limit));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await cratePagination();
      setLoading(false);
    };

    fetchData();
  }, [limit, filterData.length]);

  const cratePagination = async () => {
    // simulate async data fetching
    await new Promise((resolve) => setTimeout(resolve, 500)); // simulate network delay

    // set pagination
    let arr = new Array(Math.ceil(filterData.length / limit))
      .fill()
      .map((_, idx) => idx + 1);

    setPagination(arr);
    setPages(Math.ceil(filterData.length / limit));
  };

  const startIndex = currentPage * limit - limit;
  const endIndex = startIndex + limit;
  const getPaginatedProducts = filterData.slice(startIndex, endIndex);

  let start = Math.floor((currentPage - 1) / paginationItem) * paginationItem;
  let end = start + paginationItem;
  const getPaginationGroup = pagination.slice(start, end);

  const next = () => {
    setCurrentPage((page) => page + 1);
  };

  const prev = () => {
    setCurrentPage((page) => page - 1);
  };

  const handleActive = (item) => {
    setCurrentPage(item);
  };

  return (
    <>
      {loading ? (
        <div
          className="w-100 d-flex align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <PuffLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : (
        <>
          {getPaginatedProducts.map((item) => (
            <Fragment key={item.id}>
              <ShopCardOnSale item={item} />
            </Fragment>
          ))}
          <div className="w-100 d-flex align-items-center justify-content-center">
            {showPagination && (
              <Pagination
                getPaginationGroup={getPaginationGroup}
                currentPage={currentPage}
                pages={pages}
                next={next}
                prev={prev}
                handleActive={handleActive}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default FilterDataOnSale;
