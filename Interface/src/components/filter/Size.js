"use client";

import React from "react";

function SizeSidebar({
  toggleSizeDropdown,
  isSizeDropdownOpen,
  displayedSizes,
  allSizes,
  sizes,
  setSizes,
  showMoreSizes,
  setShowMoreSizes,
}) {
  const handleCheckboxChange = (e) => {
    const { checked, value } = e.target;
    setSizes((prev) =>
      checked ? [...prev, value] : prev.filter((size) => size !== value)
    );
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex align-items-center justify-content-between">
        <span className="font-weight-semibold text-dark">Size</span>
        <i
          className={`fa fa-chevron-${isSizeDropdownOpen ? "down" : "up"}`}
          onClick={toggleSizeDropdown}
        ></i>
      </div>
      {isSizeDropdownOpen && (
        <div className="w-100 d-flex flex-column gap-2">
          {displayedSizes.map((size) => (
            <div key={size} className="w-100 d-flex align-items-center gap-2">
              <input
                type="checkbox"
                value={size}
                checked={sizes.includes(size)}
                onChange={handleCheckboxChange}
                className="form-check-input"
              />
              <span className="text-dark font-weight-semibold mt-15">
                {size}
              </span>
            </div>
          ))}
          {allSizes.length > 5 && (
            <button
              onClick={() => setShowMoreSizes(!showMoreSizes)}
              className="text-primary btn btn-link p-0 mt-2"
            >
              {showMoreSizes ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SizeSidebar;
