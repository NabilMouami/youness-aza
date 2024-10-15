import Layout from "@/components/layout/Layout";
import Banner3 from "@/components/sections/Banner3";
import Shop from "@/components/sections/Shop";
import TopProducts from "@/components/sections/TopProducts";
export const metadata = {
  title: "Yaza Sneakers Shoes Products",
  description: "Ecommerce App",
};
export default function Home() {
  return (
    <>
      <Layout headerStyle={3} footerStyle={1}>
        <Banner3 />
        <TopProducts />
        <Shop />
      </Layout>
    </>
  );
}
