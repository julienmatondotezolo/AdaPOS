import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { remove } from "@/lib/features";

const CartItems = () => {
  const dispatch = useDispatch();
  const allCartItems = useSelector((state: any) => state.cart);

  const handleRemove = (e: any, id: any) => {
    e.preventDefault();
    dispatch(remove(id));
  };

  return (
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
  );
};

export { CartItems };
