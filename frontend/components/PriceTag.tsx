import { twMerge } from "tailwind-merge";
import FormattedPrice from "./FormattedPrice";

interface Props {
  price?: number;
  price_promo?: number;
  className?: string;
}
const PriceTag = ({ price, price_promo, className }: Props) => {
  return (
    <div className={twMerge("flex items-center gap-2", className)}>
      <p className="line-through text-gray-500 font-medium">
        <span>{price}</span>
      </p>
      <p className="font-bold text-skyText">
        <span>{price_promo}</span>
      </p>
    </div>
  );
};

export default PriceTag;
