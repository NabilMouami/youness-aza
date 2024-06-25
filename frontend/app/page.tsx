"use client";

import { useState, Suspense, useEffect } from "react";
import axios from "axios";
import SliderItem from "@/components/widgets/slider-item";
import SliderThumbnailItem from "@/components/widgets/slider-thumbnail-item";
import Arrows from "@/components/widgets/arrows";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import Services from "@/components/Services";
import BannerCategories from "@/components/BannerCategories";
import { store } from "@/lib/store";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const [listProducts, setListProducts] = useState<any>([]);
  const [itemActive, setItemActive] = useState<number>(1);
  const countItems = 3;
  const { loadProducts } = store();

  const onNext = () => {
    setItemActive(itemActive + 1);
    if (itemActive >= countItems) {
      setItemActive(1);
    }
  };

  const onPrevius = () => {
    setItemActive(itemActive - 1);
    if (itemActive === 1) {
      setItemActive(3);
    }
  };
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/interface/products")
      .then(async (res) => {
        await setListProducts(res.data);
        await loadProducts(res.data);
      });
  }, []);
  return (
    <div>
      <div className="h-screen relative">
        <ul>
          <SliderItem
            itemActive={itemActive}
            id={1}
            image="/imgs/air-force-1.jpeg"
            brand="Air Force 1"
            name="Air Force 1"
            desc="El Dodge Challenger es un potente muscle car con diseño clásico y altas prestaciones, destacando por su fuerza y estilo impactante."
          />
          <SliderItem
            itemActive={itemActive}
            id={2}
            image="/imgs/jordan-black.jpg"
            brand="Air Jordan"
            name="Air Jordan"
            desc="El Dodge Camaro es un icónico muscle car con líneas agresivas, rendimiento poderoso y una estética moderna que cautiva a los amantes de la velocidad."
          />
          <SliderItem
            itemActive={itemActive}
            id={3}
            image="/imgs/dunk.jpg"
            brand="Dunk"
            name="Dunk"
            desc="El Dodge Charger es una sedán deportivo con diseño imponente, potente rendimiento y características de alto nivel, fusionando estilo y velocidad."
          />
        </ul>
        {/* Buttons arrows */}
        <Arrows onClickPrev={() => onPrevius()} onClickNext={() => onNext()} />
        {/* Thumbnails */}
        <ul className="absolute bottom-0 z-10 flex sm:justify-end gap-3 w-full h-[250px] px-14 overflow-y-hidden overflow-x-auto">
          <SliderThumbnailItem
            itemActive={itemActive}
            image="/imgs/air-force-1.jpeg"
            id={1}
            name="Air Force 1"
            onClick={() => setItemActive(1)}
          />
          <SliderThumbnailItem
            itemActive={itemActive}
            image="/imgs/jordan-black.jpg"
            id={2}
            name="Air Jordan"
            onClick={() => setItemActive(2)}
          />
          <SliderThumbnailItem
            itemActive={itemActive}
            image="/imgs/dunk.jpg"
            id={3}
            name="Dunk"
            onClick={() => setItemActive(3)}
          />
        </ul>
      </div>
      <Services />
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">Featured Products</h1>
        <Suspense fallback={<Skeleton />}>
          <ProductList products={listProducts} />
        </Suspense>
      </div>
    </div>
  );
}
