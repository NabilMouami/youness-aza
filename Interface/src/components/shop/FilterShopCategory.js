"use client";
import { useState, Fragment, useEffect } from "react";
import { addCart } from "@/features/shopSlice";
import { addWishlist } from "@/features/wishlistSlice";
import ShopCard from "./ShopCard";
import Pagination from "@/components/blog/Pagination";

const FilterShopCategory = ({
  showItem,
  showPagination,
  listProducts,
  selectedCategories,
}) => {
  let [currentPage, setCurrentPage] = useState(1);
  let showLimit = showItem,
    paginationItem = 4;

  let [pagination, setPagination] = useState([]);
  let [limit, setLimit] = useState(showLimit);
  let [pages, setPages] = useState(Math.ceil(listProducts.length / limit));
  useEffect(() => {
    cratePagination();
  }, [limit, pages, listProducts.length]);

  const cratePagination = () => {
    // set pagination
    let arr = new Array(Math.ceil(listProducts.length / limit))
      .fill()
      .map((_, idx) => idx + 1);

    setPagination(arr);
    setPages(Math.ceil(listProducts.length / limit));
  };

  const startIndex = currentPage * limit - limit;
  const endIndex = startIndex + limit;
  const getPaginatedProducts = listProducts.slice(startIndex, endIndex);

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

  const addToCart = (id) => {
    const item = listProducts?.find((item) => item.id === id);
    dispatch(addCart({ product: item }));
  };

  const addToWishlist = (id) => {
    const item = listProducts?.find((item) => item.id === id);
    dispatch(addWishlist({ product: item }));
  };

  const filteredProducts = listProducts.filter((product) => {
    const productCategories = product.category_names
      .split(",")
      .map((cat) => cat.trim());
    return (
      selectedCategories.length === 0 ||
      selectedCategories.some((category) =>
        productCategories.includes(category)
      )
    );
  });

  if (!filteredProducts) {
    return <div>Product not found</div>;
  }
  return (
    <>
      {getPaginatedProducts.map((item) => (
        <Fragment key={item.id}>
          <ShopCard
            item={item}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
          />
        </Fragment>
      ))}
      <div className="bottom-0">
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
  );
};

export default FilterShopCategory;
