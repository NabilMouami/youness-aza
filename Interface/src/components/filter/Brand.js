"use client";

import { useSelector } from "react-redux";

const BrandLevel = ({ data, contract, setContract }) => {
  // Extract unique categories, handling multi-category strings and null values
  const uniqueCategories = Array.from(
    new Set(
      data
        .map((item) => item.category)
        .filter((category) => category) // Remove null values
        .flatMap((category) => category.split(",").map((cat) => cat.trim())) // Split multi-category strings
    )
  );

  const handleCheckboxChange = (e, setState) => {
    const { checked, value } = e.target;
    setState(checked ? [value] : []); // Allow only one checkbox to be checked
  };

  return (
    <>
      {uniqueCategories.map((category, index) => (
        <div className="form-check" key={index}>
          <input
            className="form-check-input"
            id={`brand${index}`}
            type="checkbox"
            checked={contract.includes(category)}
            value={category}
            onChange={(e) => handleCheckboxChange(e, setContract)}
          />
          <label className="form-check-label" htmlFor={`brand${index}`}>
            {category
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </label>
        </div>
      ))}
    </>
  );
};

export default BrandLevel;
