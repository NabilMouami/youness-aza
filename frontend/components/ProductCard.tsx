"use client";
import { useState } from "react";
import Image from "next/image";
import { MdOutlineStarOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { detailsProduct } from "@/redux/slices/detailsProduct";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import FormattedPrice from "./FormattedPrice";
import AddToCardBtn from "./AddToCardBtn";
import ProductCardSideView from "./ProductCardSideView";
import Link from "next/link";
const config_url = `http://localhost:5000`;

const ProductCard = ({ item }: any) => {
  const imagesArray = JSON.parse(item.images) || [];
  const validImages = [item.image, ...imagesArray].filter(
    (image: string) => image
  );

  const images = {
    img1: `${config_url}/images/${validImages[0]}`,
    img2: `${config_url}/images/${validImages[1] || ""}`,
    img3: `${config_url}/images/${validImages[2] || ""}`,
    img4: `${config_url}/images/${validImages[3] || ""}`,
  };
  const dispatch = useDispatch();

  const router = useRouter();
  const details = (product: any) => {
    router.push(`/product/${product.id}`);
    dispatch(detailsProduct(product));
  };

  const percentage = ((item?.price - item?.price_promo) / item?.price) * 100;

  let [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }
  return (
    <div className="border border-gray-200 rounded-lg p-1 overflow-hidden hover:border-black duration-200 cursor-pointer">
      <Link href={`/product/${item.id}`}>
        <div className="w-full h-60 relative p-2 group">
          <span
            onClick={open}
            className="bg-black text-skyText absolute left-0 right-0 w-16 text-xs text-center py-1 rounded-md font-semibold inline-block z-10"
          >
            save {percentage.toFixed(0)}%
          </span>
          <Image
            src={images.img1}
            alt=""
            fill
            sizes="25vw"
            className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
          />
          <Image
            src={images.img3}
            alt=""
            fill
            sizes="25vw"
            className="absolute object-cover rounded-md"
          />
          <ProductCardSideView product={item} />
        </div>
        <div className="flex flex-col gap-2 px-2 pb-2">
          <h3 className=" text-xs uppercase font-semibold text-lightText">
            {item?.category}
          </h3>
          <h2 className="text-lg font-bold line-clamp-2">{item?.name}</h2>
          <div className="text-base text-lightText flex items-center">
            <MdOutlineStarOutline />
            <MdOutlineStarOutline />
            <MdOutlineStarOutline />
            <MdOutlineStarOutline />
            <MdOutlineStarOutline />
          </div>

          <AddToCardBtn product={item} />
        </div>
        <Transition appear show={isOpen}>
          <Dialog
            as="div"
            className="relative z-10 focus:outline-none"
            onClose={close}
          >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <TransitionChild
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 transform-[scale(95%)]"
                  enterTo="opacity-100 transform-[scale(100%)]"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 transform-[scale(100%)]"
                  leaveTo="opacity-0 transform-[scale(95%)]"
                >
                  <DialogPanel className="w-full max-w-md rounded-xl bg-black z-50 p-6 backdrop-blur-2xl">
                    <DialogTitle
                      as="h3"
                      className="text-base/7 font-medium text-white"
                    >
                      Hurry up!
                    </DialogTitle>
                    <p className="mt-2 text-sm/6 text-white/50">
                      You are going to save{" "}
                      <span className="text-skyText">
                        <FormattedPrice
                          amount={item?.regularPrice - item?.discountedPrice}
                        />{" "}
                      </span>
                      from this product.
                    </p>
                    <p className="text-sm/6 text-white/50">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Sequi, consequatur?
                    </p>
                    <div className="mt-4">
                      <Button
                        className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                        onClick={close}
                      >
                        Got it, thanks!
                      </Button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </Link>
    </div>
  );
};

export default ProductCard;
