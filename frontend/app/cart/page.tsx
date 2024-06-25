"use client";
import { FaQuestionCircle } from "react-icons/fa";
import { store } from "@/lib/store";
import Container from "@/components/Container";
import CartProduct from "@/components/cart/CartProduct";
import FormattedPrice from "@/components/FormattedPrice";
import { useEffect, useState } from "react";
import CheckoutBtn from "@/components/cart/CheckoutBtn";
import Link from "next/link";

const Cart = () => {
  const [totalAmt, setTotalAmt] = useState({ price: 0, price_promo: 0 });
  const shippingAmt = 25;
  const taxAmt = 15;
  const { cartProduct } = store();
  console.log(cartProduct);
  useEffect(() => {
    const totals = cartProduct.reduce(
      (sum: any, product: any) => {
        sum.price += product?.price * product?.quantity;
        sum.price_promo += product?.price_promo * product?.quantity;
        return sum;
      },
      { price: 0, price_promo: 0 }
    );

    setTotalAmt(totals);
  }, [cartProduct]);
  {
    console.log(cartProduct);
  }
  return (
    <Container>
      {cartProduct?.length > 0 ? (
        <>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>
          <div className="mt-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>

              <div className="divide-y divide-gray-200 border-b border-t border-gray-200">
                {cartProduct.map((product: any) => (
                  <CartProduct product={product} key={product?.id} />
                ))}
              </div>
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
            >
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Order summary
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    <span>{totalAmt?.price} Dh</span>
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex items-center text-sm text-gray-600">
                    <span>Shipping estimate</span>

                    <FaQuestionCircle
                      className="h-5 w-5 text-gray-400 ml-2"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    <span>{shippingAmt} Dh</span>
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex text-sm text-gray-600">
                    <span>Tax estimate</span>

                    <FaQuestionCircle
                      className="h-5 w-5 text-gray-400 ml-2"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    <span>{taxAmt} Dh</span>
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">
                    Total Discount
                  </dt>
                  <dd className="text-base font-medium text-gray-500">
                    <span>{totalAmt?.price - totalAmt?.price_promo} Dh</span>
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">
                    Order total
                  </dt>
                  <dd className="text-lg font-bold text-gray-900">
                    <span>
                      {totalAmt?.price_promo + shippingAmt + taxAmt} Dh
                    </span>
                  </dd>
                </div>
              </dl>

              <CheckoutBtn
                products={cartProduct}
                totalAmt={totalAmt?.price_promo + shippingAmt + taxAmt}
              />
            </section>
          </div>
        </>
      ) : (
        <div className="bg-white h-96 flex flex-col gap-2 items-center justify-center py-5 rounded-lg border border-gray-200 drop-shadow-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>
          <p className="text-lg max-w-[600px] text-center text-gray-600 tracking-wide leading-6">
            Your cart is empty. Lorem ipsum dolor sit amet consectetur,
            adipisicing elit. Ducimus vel dolorem facilis blanditiis atque
            explicabo assumenda quibusdam officia pariatur totam. Quia numquam
            obcaecati asperiores, voluptas magni corrupti porro sunt ab.
          </p>
          <Link href="/products">
            <button className="bg-gray-800 text-gray-200 px-8 py-4 rounded-md hover:bg-black hover:text-white duration-200 uppercase text-sm font-semibold tracking-wide">
              go to shopping
            </button>
          </Link>
        </div>
      )}
    </Container>
  );
};

export default Cart;
