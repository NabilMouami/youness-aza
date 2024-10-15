"use client";
import { useCallback, useEffect, useState } from "react";
import { AiFillFilter, AiOutlineFilter } from "react-icons/ai";
import { CircularProgress } from "@mui/material";
import CategoryLevel from "../filter/Categories";
import SizeSidebar from "../filter/Size";
import PriceRangeSlider from "../filter/PriceRangeSlider";

const FilterSidebar = ({ onFilterChange, data }) => {
  const [contract, setContract] = useState([]);
  const [genre, setGenre] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [price, setPrice] = useState([0, 2000]); // Moved price state here

  const [showMoreSizes, setShowMoreSizes] = useState(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Collect all sizes and their count (occurrence in products)
  const [allSizes, setAllSizes] = useState([]);

  useEffect(() => {
    const sizeMap = new Map();
    data.forEach((product) => {
      const shoeSizes = JSON.parse(product.nemuro_shoes);
      shoeSizes.forEach((size) => {
        if (sizeMap.has(size)) {
          sizeMap.set(size, sizeMap.get(size) + 1);
        } else {
          sizeMap.set(size, 1);
        }
      });
    });
    const collectedSizes = Array.from(sizeMap)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([size, count]) => `${size} (${count})`);
    setAllSizes(collectedSizes);
  }, [data]);

  const displayedSizes = showMoreSizes ? allSizes : allSizes.slice(0, 5);

  const memoFilterChange = useCallback(onFilterChange, []);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Simulate loading time for filters
    }, 1000);

    memoFilterChange({ category: contract, sizes, price, genre });
  }, [genre, contract, sizes, price, memoFilterChange]);

  useEffect(() => {
    setShowFilters(!showFilters);
  }, [genre, contract, sizes]);

  const handlePriceChange = (value) => {
    setPrice(value); // Update price state in parent
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const prices = data.map((product) => product.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPrice([minPrice, maxPrice]);
    }
  }, [data]);

  const toggleSizeDropdown = () => {
    setIsSizeDropdownOpen(!isSizeDropdownOpen);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="product-sidebar">
      <div
        className="filter-toggle"
        onClick={toggleFilters}
        style={{ cursor: "pointer", marginBottom: "20px" }}
      >
        {showFilters ? (
          <AiFillFilter size={24} />
        ) : (
          <AiOutlineFilter size={24} />
        )}
        <span style={{ marginLeft: "10px" }}>Filters</span>
        <hr />
      </div>

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px 0",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        showFilters && (
          <>
            {/* Filter Genre */}
            <div className="product-sidebar__widget mb-30">
              <div className="product-sidebar__info product-info-list">
                <h4 className="product-sidebar__title mb-25">Genre:</h4>
                <CategoryLevel genre={genre} setGenre={setGenre} />
              </div>
            </div>

            {/* Filter Price */}
            <div className="product-sidebar__widget mb-30">
              <div className="product-sidebar__info product-info-list">
                <h4 className="product-sidebar__title mb-25">Filter Price:</h4>
                <PriceRangeSlider
                  handlePriceChange={handlePriceChange}
                  data={data}
                  price={price} // Pass current price range as props
                />
              </div>
            </div>

            {/* Filter Size */}
            <div className="product-sidebar__widget mb-30">
              <div className="product-sidebar__info product-info-list">
                <SizeSidebar
                  toggleSizeDropdown={toggleSizeDropdown}
                  isSizeDropdownOpen={isSizeDropdownOpen}
                  displayedSizes={displayedSizes}
                  allSizes={allSizes}
                  sizes={sizes}
                  setSizes={setSizes}
                  showMoreSizes={showMoreSizes}
                  setShowMoreSizes={setShowMoreSizes}
                />
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default FilterSidebar;
