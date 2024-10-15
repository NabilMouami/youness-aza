import Link from "next/link";
import { config_url } from "@/util/config";

export default function BlogCard1({ item }) {
  // Function to format date to "MMM dd, yyyy"
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <>
      <article className="postbox__item format-image mb-60 transition-3">
        <div className="postbox__thumb w-img mb-25">
          <img src={item.image} alt={item.meta_image} />
        </div>
        <div className="postbox__content">
          <div className="postbox__meta mb-15">
            <span>
              <i className="fal fa-clock" /> {formatDate(item.date_created)}
            </span>
          </div>
          <h3 className="postbox__title mb-20">{item.title}</h3>
          <div className="postbox__text mb-30">
            <p>{item.description}</p>
          </div>
        </div>
      </article>
    </>
  );
}
