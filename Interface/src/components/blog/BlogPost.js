"use client";
import React, { useState, useEffect } from "react";

import BlogCard1 from "./BlogCard1";
import Pagination from "./Pagination";
export default function BlogPost({ style, blogs, showItem, showPagination }) {
  let [currentPage, setCurrentPage] = useState(1);
  let showLimit = showItem,
    paginationItem = 4;

  let [pagination, setPagination] = useState([]);
  let [limit, setLimit] = useState(showLimit);
  let [pages, setPages] = useState(Math.ceil(blogs.length / limit));

  useEffect(() => {
    cratePagination();
  }, [limit, pages, blogs.length]);

  const cratePagination = () => {
    // set pagination
    let arr = new Array(Math.ceil(blogs.length / limit))
      .fill()
      .map((_, idx) => idx + 1);

    setPagination(arr);
    setPages(Math.ceil(blogs.length / limit));
  };

  const startIndex = currentPage * limit - limit;
  const endIndex = startIndex + limit;
  const getPaginatedProducts = blogs.slice(startIndex, endIndex);

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
      {getPaginatedProducts.length === 0 && <h3>No Blogs Found </h3>}

      {getPaginatedProducts.map((item) => (
        <React.Fragment key={item.id}>
          <BlogCard1 item={item} />
        </React.Fragment>
      ))}

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
    </>
  );
}
