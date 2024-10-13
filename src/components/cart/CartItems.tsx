import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { remove, selectTotal } from "@/lib/features";

const CartItems = () => {
  const dispatch = useDispatch();
  const allCartItems = useSelector((state: any) => state.cart);
  const total = useSelector(selectTotal);
  const subTotal = total;

  const handleRemove = (e: any, id: any) => {
    e.preventDefault();
    dispatch(remove(id));
  };

  return (
    <div>
      <motion.div
        transition={{ duration: 0.5 }}
        exit={{ y: "50%", opacity: 0 }}
        className="flex flex-col space-y-1 h-[55vh] overflow-y-scroll scrollbar-hide"
      >
        {allCartItems.length > 0 ? (
          <AnimatePresence>
            {allCartItems.map((cart: any, index: number) => (
              <motion.div
                key={index}
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.2 }}
                exit={{ y: "50%", opacity: 0, scale: 0.5 }}
                className="relative flex justify-between w-full border-2 border-neutral-900"
              >
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium text-white">
                      {index + 1}. &nbsp;{cart.title} &nbsp;{" "}
                    </p>
                    {/* <div className="ml-2 flex flex-shrink-0">
                    <p className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-white">
                      € {cart.price}
                    </p>
                  </div> */}
                  </div>

                  <div className="mt-2 sm:flex sm:justify-between items-center">
                    <Plus className="bg-neutral-900 hover:bg-neutral-800 p-2 box-content" size={15} />
                    <p>{cart.quantity}</p>
                    <Minus className="bg-neutral-900 hover:bg-neutral-800 p-2 box-content" size={15} />
                  </div>
                </div>
                <div className="flex items-center overflow-hidden space-x-6">
                  <p className="inline-flex rounded-full px-2 font-semibold leading-5 text-white">€ {cart.price}</p>
                  <Trash2
                    onClick={(e) => handleRemove(e, cart.id)}
                    className="cursor-pointer p-4 h-full box-content bg-red-500/20 hover:bg-red-500"
                    size={18}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center mt-24">
            <ShoppingCart className="text-neutral-600" />
            <small className=" text-neutral-600 mt-2">No items.</small>
          </div>
        )}
      </motion.div>
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-3 gap-0">
          <div className="bg-[#151a34] text-center p-2 text-sm font-semibold hover:bg-[#1f2544] cursor-pointer border border-black rounded-tl-lg">
            <button>Discount</button>
          </div>
          <div className="bg-[#151a34] text-center p-2 text-sm font-semibold hover:bg-[#1f2544] cursor-pointer border border-black rounded-tl-lg">
            <button>Discount</button>
          </div>
          <div className="bg-[#151a34] text-center p-2 text-sm font-semibold hover:bg-[#1f2544] cursor-pointer border border-black rounded-tl-lg">
            <button>Discount</button>
          </div>
        </div>
        <div className="flex flex-col pl-8 pr-8 py-2 space-y-2">
          {/* /Total  */}
          {/* {payment && (
            <p className="text-center text-xs font-semibold text-green-500">
              Payment done. <small className="font-normal text-white"> Now you can place order.</small>{" "}
            </p>
          )}
          <div className="flex flex-row items-center justify-between text-xs font-bold text-gray-600 ">
            <p>Tax 5.25%</p>
            <p>₹{tax.toFixed(2)}</p>
          </div>
          <div className="flex flex-row items-center justify-between text-xs font-bold text-gray-600 ">
            <p>Subtotal</p>
            <p>₹{total.toFixed(2)}</p>
          </div> */}
          <div className="flex flex-row items-center justify-between text-sm font-bold ">
            <p>Total</p>
            <p>€ {subTotal.toFixed(2)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-0 pt-2 text-center bottom-0 w-full">
          <div className={allCartItems.length > 0 ? `bg-[#3441d4]` : `bg-gray-500 border-r border-gray-700`}>
            <button
              className={
                allCartItems.length > 0 ? "py-4 text-center pt-2" : " py-4 text-center pt-2 cursor-not-allowed"
              }
            >
              KOT
            </button>
          </div>
          <div className={allCartItems.length > 0 ? `bg-[#5b45b0]` : `bg-gray-500`}>
            <button
              className={
                allCartItems.length > 0 ? "py-4 text-center pt-2" : " py-4 text-center pt-2 cursor-not-allowed"
              }
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CartItems };
