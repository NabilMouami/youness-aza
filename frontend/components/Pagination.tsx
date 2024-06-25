"use client";

import { useState } from "react";
import ReactPaginate from "react-paginate";
import ProductCard from "./ProductCard";

function Items({ currentItems }: { currentItems: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
      {currentItems &&
        currentItems.map((item) => <ProductCard key={item._id} item={item} />)}
    </div>
  );
}

const Pagination = ({
  items,
  itemsPerPage,
}: {
  items: any[];
  itemsPerPage: number;
}) => {
  const [itemOffset, setItemOffset] = useState(0);
  const [itemStart, setItemStart] = useState(1);
  const endOffset = itemOffset + itemsPerPage;

  // Debug: Log the items to ensure they are an array
  console.log("Items:", items);

  // Ensure items is an array before calling slice
  const currentItems = Array.isArray(items)
    ? items.slice(itemOffset, endOffset)
    : [];
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    const newStart = newOffset + 1;
    setItemOffset(newOffset);
    setItemStart(newStart);
  };

  return (
    <>
      <Items currentItems={currentItems} />
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center">
        <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel=""
          pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
          pageClassName="mr-6"
          containerClassName="flex text-base font-semibold font-titleFont py-10"
          activeClassName="bg-black text-white"
        />

        <p className="text-base font-normal text-lightText">
          Products from {itemStart} to {Math.min(endOffset, items.length)} of{" "}
          {items.length}
        </p>
      </div>
    </>
  );
};

export default Pagination;
