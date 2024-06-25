"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Filters from "@/components/Filters";
import ProductList from "@/components/ProductList";

async function fetchProducts() {
  try {
    const res = await axios.get("http://localhost:5000/api/interface/products");
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
}

const ProductsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      const products = await fetchProducts();
      setData(products);
      setFilteredJobs(products); // Initialize filteredJobs with the fetched data
    };

    getData().catch((error) => console.error(error.message));
  }, []);

  const handleFilterChange = (filters: {
    category: string[];
    sizes: string[];
    price: number[];
  }) => {
    console.log("Filters:", filters);
    let filtered = [...data];
    console.log("Initial Data:", filtered);

    if (filters.category.length > 0) {
      filtered = filtered.filter((product) =>
        filters.category.includes(product.category)
      );
      console.log("After Category Filter:", filtered);
    }

    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) =>
        filters.sizes.includes(product.nemuro_shoes)
      );
      console.log("After Size Filter:", filtered);
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= filters.price[0] && product.price <= filters.price[1]
    );
    console.log("After Price Filter:", filtered);

    setFilteredJobs(filtered);
  };

  const handleSearch = (query: string) => {
    const filtered = data.filter((item: any) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  return (
    <div className="w-full mt-12 mb-16 bg-[#f7f8fa]">
      <div className="w-full md:px-16 px-5 mb-10 flex flex-col md:gap-1 gap-3 text-center">
        <span className="md:text-3xl text-xl font-bold text-indigo-500">
          Let's Find you the Perfect Shoes!
        </span>
        <span className="text-[15px] text-gray-600 font-medium">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum
          excepturi debitis veniam.
        </span>
      </div>
      <div className="w-full flex md:flex-row flex-col items-start relative md:px-16 px-5 gap-9">
        <Filters onFilterChange={handleFilterChange} />
        <div className="w-full">
          <ProductList products={filteredJobs} />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
