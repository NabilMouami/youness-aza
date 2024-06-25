"use client";

import { useCallback, useEffect, useState } from "react";
import { MdClose, MdExpandMore, MdExpandLess } from "react-icons/md";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface FiltersProps {
  onFilterChange: (filters: {
    category: string[];
    sizes: string[];
    price: number[];
  }) => void;
}

const Filters = ({ onFilterChange }: FiltersProps) => {
  const [contract, setContract] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [price, setPrice] = useState<number[]>([0, 2000]);

  const [showMoreSizes, setShowMoreSizes] = useState<boolean>(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState<boolean>(false);

  const allSizes = [
    "36 (6)",
    "36.5 (11)",
    "37.5 (21)",
    "37.5 (21)",
    "38",
    "38.5",
    "39",
    "39.5",
    "40",
  ];
  const displayedSizes = showMoreSizes ? allSizes : allSizes.slice(0, 5);

  const memoFilterChange = useCallback(onFilterChange, []);
  useEffect(() => {
    memoFilterChange({ category: contract, sizes, price });
  }, [contract, sizes, price, memoFilterChange]);

  const handleCloseFilters = () => {
    setContract([]);
    setSizes([]);
    setPrice([0, 2000]);
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const isChecked = e.target.checked;
    const filterValue = e.target.value;

    setState((prev) => {
      if (isChecked) {
        return [...prev, filterValue];
      } else {
        return prev.filter((value) => value !== filterValue);
      }
    });
  };

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPrice(value);
    }
  };

  const toggleSizeDropdown = () => {
    setIsSizeDropdownOpen(!isSizeDropdownOpen);
  };

  return (
    <div className="md:sticky relative md:top-10 md:w-[500px] w-full">
      <div className="w-full bg-white rounded-lg p-5 border border-gray-200">
        <div className="w-full flex items-center justify-between">
          <span className="text-gray-800 font-semibold text-[15px]">
            Filter Shoes
          </span>
          <MdClose
            color="#000"
            size={30}
            className="bg-red-500 p-1 rounded-full"
            onClick={handleCloseFilters}
          />
        </div>
        <div className="w-full flex md:flex-col flex-row justify-between gap-4 mt-5">
          {/* Brand Filter */}
          <div className="flex flex-col gap-4">
            <span className="text-gray-800 font-semibold text-[15.5px]">
              Brand
            </span>
            <div className="w-full flex flex-col gap-2">
              {["air-force-1", "air-jordan", "dunk"].map((brand) => (
                <div key={brand} className="w-full flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={brand}
                    checked={contract.some((c) => c === brand)}
                    onChange={(e) => handleCheckboxChange(e, setContract)}
                    className="w-[16px] h-[16px]"
                  />
                  <span className="text-gray-800 font-medium text-[15px]">
                    {brand
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-semibold text-[15.5px]">
                Size
              </span>
              {isSizeDropdownOpen ? (
                <MdExpandLess
                  color="#000"
                  size={30}
                  onClick={toggleSizeDropdown}
                  className="cursor-pointer right-0"
                />
              ) : (
                <MdExpandMore
                  color="#000"
                  size={30}
                  onClick={toggleSizeDropdown}
                  className="cursor-pointer right-0"
                />
              )}
            </div>
            {isSizeDropdownOpen && (
              <div className="w-full flex flex-col gap-2">
                {displayedSizes.map((size) => (
                  <div key={size} className="w-full  flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={size}
                      checked={sizes.some((s) => s === size)}
                      onChange={(e) => handleCheckboxChange(e, setSizes)}
                      className="w-[16px] h-[16px]"
                    />
                    <span className="text-gray-800 font-semibold text-[20px]">
                      {size}
                    </span>
                  </div>
                ))}
                {allSizes.length > 5 && (
                  <button
                    onClick={() => setShowMoreSizes(!showMoreSizes)}
                    className="text-blue-500 hover:underline mt-2"
                  >
                    {showMoreSizes ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            )}
          </div>
          {/* Price Filter */}
          <div className="flex flex-col gap-4">
            <span className="text-gray-800 font-semibold text-[15.5px]">
              Price
            </span>
            <div className="w-full flex flex-col gap-2">
              <Slider
                range
                min={0}
                max={2000}
                value={price}
                onChange={handlePriceChange}
                className="w-full"
                trackStyle={{ backgroundColor: "black", height: 10 }}
                railStyle={{ backgroundColor: "lightblue", height: 10 }}
                handleStyle={{
                  height: 20,
                  width: 20,
                  backgroundColor: "gray",
                }}
              />
              <span className="text-gray-800 font-medium text-[15px]">
                Price: From: {price[0]} Dh To: {price[1]} Dh
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
