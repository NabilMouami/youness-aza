"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadAllProducts } from "@/features/productsSlice";
import axios from "axios";
import { config_url } from "@/util/config";
import WhiteProduct from "./WhiteProduct";

export default function Product1() {
  const { categoryList } = useSelector((state) => state.Categories) || {};
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(
    categoryList?.[0]?.id || null
  );
  const [listProducts, setListProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      axios.get(`${config_url}/api/products`).then(async (res) => {
        await setListProducts(res.data);
        await dispatch(loadAllProducts(res.data));
        await setLoading(false);
      });
    } catch (error) {
      console.error("Failed to fetch product:", error);
      setLoading(false);
    }
  }, []);

  const handleOnClick = (categoryId, category) => {
    setActiveCategory(categoryId);
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <>
      <section className="product-area pt-95 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-12">
              <div className="tpsection mb-40">
                <h4 className="tpsection__title">
                  Popular{" "}
                  <span>
                    {" "}
                    Products{" "}
                    <img
                      src="/assets/img/icon/title-shape-01.jpg"
                      alt="underline-logo"
                    />
                  </span>
                </h4>
              </div>
            </div>
          </div>
          <div className="tab-content" id="nav-tabContent">
            <div
              className={"tab-pane fade show active"}
              id="nav-category"
              role="tabpanel"
              aria-labelledby="nav-category-tab"
            >
              <WhiteProduct />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
