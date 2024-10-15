// pages/categories/[category].js

"use client";
import Head from "next/head";
import dynamic from "next/dynamic";

import { config_url } from "@/util/config";

const Layout = dynamic(() => import("@/components/layout/Layout"), {
  ssr: false,
});
import FilterData from "@/components/shop/FilterData";
import { Fragment, useState } from "react";

import FilterSidebarGenre from "@/components/shop/FilterSidebarGenre";

function GenreProduct({ initialData }) {
  const pathname = window.location.pathname;
  const category = pathname.split("/")[2]; // Extracts category from the URL path
  const [data, setData] = useState(initialData || []); // Set initialData from SSR
  const [filteredJobs, setFilteredJobs] = useState([]);

  const handleFilterChange = (filters) => {
    let filtered = [...data];

    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) => {
        const productSizes = JSON.parse(product.nemuro_shoes);

        // Extract size numbers from filters.sizes (ignoring counts in parentheses)
        const selectedSizes = filters.sizes.map((size) => size.split(" ")[0]);

        return selectedSizes.some((size) => productSizes.includes(size));
      });
    }
    if (filters.category.length > 0) {
      // Ensure unique categories from the filter
      const uniqueCategories = Array.from(new Set(filters.category));

      // Filter products based on unique categories
      filtered = filtered.filter((product) => {
        // Handle cases where the category may be null
        if (!product.category) {
          return false;
        }

        // Split the product categories if they are comma-separated
        const productCategories = product.category
          .toLowerCase() // Normalize to lower case for comparison
          .split(",") // Split into an array if it's a comma-separated string
          .map((cat) => cat.trim()); // Trim whitespace

        // Check if any of the unique categories are included in the product categories
        return uniqueCategories.some((category) =>
          productCategories.includes(category.toLowerCase())
        );
      });
    }

    if (filters.genre.length > 0) {
      filtered = filtered.filter((product) => {
        // Normalize genres by converting to lowercase
        const productGenres = product.genre
          .toLowerCase()
          .split(",")
          .map((g) => g.trim());
        const filterGenres = filters.genre.map((g) => g.toLowerCase());

        // Check if any of the product genres match the filter genres
        const matches = productGenres.some((genre) =>
          filterGenres.includes(genre)
        );

        return matches;
      });
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= filters.price[0] && product.price <= filters.price[1]
    );

    setFilteredJobs(filtered);
  };

  return (
    <Fragment>
      <Head>
        {/* Men's Products */}
        <title>{`Shop Men's Products | At Yazasneakers`}</title>
        <meta
          name="description"
          content={`Discover our wide selection of men's products. Shop now for the best deals on men's shoes and accessories.`}
        />
        <meta property="og:title" content={`Shop Men's Products`} />
        <meta
          property="og:description"
          content={`Discover men's products and get the best deals on shoes and accessories.`}
        />
        <meta
          property="og:image"
          content="https://your-image-url.com/men.jpg"
        />
        <meta property="og:url" content={`https://your-site.com/genre/homme`} />

        {/* Women's Products */}
        <title>{`Shop Women's Products | At Yazasneakers`}</title>
        <meta
          name="description"
          content={`Discover our wide selection of women's products. Shop now for the best deals on women's shoes and accessories.`}
        />
        <meta property="og:title" content={`Shop Women's Products`} />
        <meta
          property="og:description"
          content={`Discover women's products and get the best deals on shoes and accessories.`}
        />
        <meta
          property="og:image"
          content="https://your-image-url.com/women.jpg"
        />
        <meta property="og:url" content={`https://your-site.com/genre/femme`} />

        {/* Kids' Products */}
        <title>{`Shop Kids' Products | At Yazasneakers`}</title>
        <meta
          name="description"
          content={`Discover our wide selection of kids' products. Shop now for the best deals on kids' shoes and accessories.`}
        />
        <meta property="og:title" content={`Shop Kids' Products`} />
        <meta
          property="og:description"
          content={`Discover kids' products and get the best deals on shoes and accessories.`}
        />
        <meta
          property="og:image"
          content="https://your-image-url.com/kids.jpg"
        />
        <meta
          property="og:url"
          content={`https://your-site.com/genre/enfant`}
        />
      </Head>

      <Layout headerStyle={3} footerStyle={1}>
        {" "}
        <div className="pt-40">
          <h3 className="text-center fw-bolder fs-4 text-uppercase">
            Genre Produits {category}{" "}
          </h3>
          <div className="product-area pt-30 pb-20">
            <div className="container">
              <div className="row">
                <div className="col-lg-2 col-md-12">
                  <div className="tpsidebar product-sidebar__product-category">
                    <FilterSidebarGenre
                      onFilterChange={handleFilterChange}
                      data={initialData}
                    />{" "}
                  </div>
                </div>
                <div className="col-lg-10 col-md-12">
                  <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-2">
                    <FilterData
                      showItem={20}
                      style={1}
                      //showPagination
                      filterData={filteredJobs}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </Fragment>
  );
}
// getServerSideProps to fetch data from the Express API
export async function getServerSideProps(context) {
  const { slug } = context.params; // Extract category from route params

  try {
    // Fetch data from your Express.js API
    const res = await fetch(`${config_url}/api/interface/genre/${slug}`);
    const data = await res.json();

    // If the category is not found, return 404
    if (!res.ok) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        initialData: data, // Pass the fetched data as props
      },
    };
  } catch (error) {
    return {
      props: {
        initialData: [],
        error: error.message, // Handle any error
      },
    };
  }
}
export default GenreProduct;
