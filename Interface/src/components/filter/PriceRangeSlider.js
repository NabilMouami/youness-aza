import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useEffect, useState } from "react";

const PriceRangeSlider = ({ handlePriceChange, data, price }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);

  useEffect(() => {
    if (data && data.length > 0) {
      const prices = data.map((product) => product.price);
      const calculatedMinPrice = Math.min(...prices);
      const calculatedMaxPrice = Math.max(...prices);

      setMinPrice(calculatedMinPrice);
      setMaxPrice(calculatedMaxPrice);
    }
  }, [data]);

  return (
    <div className="w-100 d-flex flex-column gap-2">
      <Slider
        range
        min={minPrice}
        max={maxPrice}
        value={price} // Use controlled price value from parent
        onChange={handlePriceChange} // Call the parent function with new price range
        className="w-100"
        trackStyle={{ backgroundColor: "black", height: 10 }}
        railStyle={{ backgroundColor: "lightblue", height: 10 }}
        handleStyle={{
          height: 20,
          width: 20,
          backgroundColor: "gray",
        }}
      />
      <div className="d-flex align-items-center justify-content-between">
        <span className="text-dark font-weight-medium">{price[0]} Dh</span>
        <span className="text-dark font-weight-medium">{price[1]} Dh</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
