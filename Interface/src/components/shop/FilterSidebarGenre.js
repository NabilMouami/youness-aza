"use client";
import { useCallback, useEffect, useState } from "react";
import { AiFillFilter, AiOutlineFilter } from "react-icons/ai";
import { CircularProgress } from "@mui/material"; // MUI circular loader

import BrandLevel from "../filter/Brand";
import SizeSidebar from "../filter/Size";
import PriceRangeSlider from "../filter/PriceRangeSlider";

const FilterSidebarGenre = ({ onFilterChange, data }) => {
  const [contract, setContract] = useState([]);
  const [genre, setGenre] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [price, setPrice] = useState([0, 2000]);

  const [showMoreSizes, setShowMoreSizes] = useState(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Collect all sizes and their count (occurrence in products)
  const [allSizes, setAllSizes] = useState([]);

  useEffect(() => {
    const sizeMap = new Map(); // Use a map to track sizes and count occurrences

    data.forEach((product) => {
      const shoeSizes = JSON.parse(product.nemuro_shoes); // Parse the size array

      shoeSizes.forEach((size) => {
        if (sizeMap.has(size)) {
          sizeMap.set(size, sizeMap.get(size) + 1); // Increment count for repeated sizes
        } else {
          sizeMap.set(size, 1); // Initialize count for new size
        }
      });
    });

    // Create an array from the map and sort by size (numerically/alphabetically)
    const collectedSizes = Array.from(sizeMap)
      .sort((a, b) => Number(a[0]) - Number(b[0])) // Sort by size value
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

  // useEffect(() => {
  //   setShowFilters(!showFilters);
  // }, [genre, contract, sizes]);

  const handlePriceChange = (value) => {
    setPrice(value); // Update price state in parent
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const prices = data.map((product) => product.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      setPrice([minPrice, maxPrice]); // Set initial price range based on data
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
            <div className="product-sidebar__widget mb-30">
              <div className="product-sidebar__info product-info-list">
                <h4 className="product-sidebar__title mb-25">Collections</h4>
                <BrandLevel
                  data={data}
                  contract={contract}
                  setContract={setContract}
                />
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default FilterSidebarGenre;
