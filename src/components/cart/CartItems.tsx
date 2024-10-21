/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { MenuType } from "@/_types";
import { remove, removeAll } from "@/lib/features";

import { Invoice } from "./Invoice";

const CartItems = () => {
  const dispatch = useDispatch();
  const [invoiceShow, setInvoiceShow] = useState(false);
  const allCartItems = useSelector((state: any) => state.cart);

  // const total = useSelector(selectTotal);

  // const subTotal = total;
  // const tax = (5.25 / 100) * total;

  const handleRemove = (e: any, id: any) => {
    e.preventDefault();
    dispatch(remove(id));
  };

  const handleRemoveAll = (e: any) => {
    e.preventDefault();
    if (allCartItems.length === 0) {
      return;
    }
    dispatch(removeAll("remove"));
  };

  const showInvoice = () => {
    if (allCartItems.length === 0) {
      alert("Add items to cart.");
      return;
    }
    setInvoiceShow(true);
  };

  return (
    <>
      <motion.div
        transition={{ duration: 0.5 }}
        exit={{ y: "50%", opacity: 0 }}
        className={`flex flex-col ${allCartItems.length > 0 && "h-[50px] sm:h-[100px] md:h-[50vh]"} overflow-y-scroll scrollbar-hide`}
      >
        {allCartItems.length > 0 ? (
          <AnimatePresence>
            {allCartItems.map((cart: MenuType, index: number) => (
              <motion.div
                key={index}
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.2 }}
                exit={{ y: "50%", opacity: 0, scale: 0.5 }}
                className="relative flex justify-between w-full pl-2 py-2 border-2 border-neutral-900 box-border"
              >
                <div className="flex w-3/4 flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium text-white">
                      {index + 1}. &nbsp;{cart.name} &nbsp;{" "}
                    </p>
                  </div>

                  {cart.selectedAside && (
                    <div className="flex items-cente text-xs sm:space-x-1">
                      <p className="font-bold">Aside:</p>
                      <p className="font-normal">{cart.selectedAside}</p>
                    </div>
                  )}
                </div>
                <div className="flex w-2/4 justify-between items-end md:items-center overflow-hidden">
                  <p className="lg:inline-flex text-xs mr-4 md:text-xs lg:text-sm text-white">
                    Qty: <strong className="ml-2">{cart.quantity}</strong>
                  </p>
                  <div onClick={(e) => handleRemove(e, cart.id)} className="w-12 h-full bg-red-500/20 hover:bg-red-500">
                    <Trash2 className="cursor-pointer h-full mx-auto" width={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center">
            <ShoppingCart className="text-neutral-600" />
            <small className=" text-neutral-600 mt-2">No items.</small>
          </div>
        )}
      </motion.div>
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-3 gap-0">
          <div className="text-center p-2 text-sm font-semibold cursor-pointer border-2 border-neutral-900 bg-neutral-800 hover:bg-neutral-700 transition-all ease-out duration-50">
            <button>Note</button>
          </div>
          <div className="text-center p-2 text-sm font-semibold cursor-pointer border-2 border-neutral-900 bg-neutral-800 hover:bg-neutral-700 transition-all ease-out duration-50">
            <button>Extra</button>
          </div>
          <div
            onClick={handleRemoveAll}
            className={`text-center p-2 text-sm font-semibold cursor-pointer border-2 border-neutral-900 ${allCartItems.length > 0 ? "bg-red-500/20 hover:bg-red-500" : "bg-neutral-800 cursor-not-allowed"} transition-all ease-out duration-50 `}
          >
            <button>Clear</button>
          </div>
        </div>
        {/* <div className="flex flex-col pl-8 pr-8 py-2 space-y-2">
          {payment && (
            <p className="text-center text-xs font-semibold text-green-500">
              Payment done. <small className="font-normal text-white"> Now you can place order.</small>{" "}
            </p>
          )}
          <div className="flex flex-row items-center justify-between text-xs font-bold text-gray-600 ">
            <p>Tax 5.25%</p>
            <p>€ {tax.toFixed(2)}</p>
          </div>
          <div className="flex flex-row items-center justify-between text-xs font-bold text-gray-600 ">
            <p>Items:</p>
            <p>{allCartItems.length}</p>
          </div>
          <div className="flex flex-row items-center justify-between text-sm font-bold ">
            <p>Total</p>
            <p>€ {subTotal.toFixed(2)}</p>
          </div>
        </div> */}
        <div className="flex w-full justify-between">
          <button
            onClick={showInvoice}
            className={`w-1/4 py-4 text-center border-2 border-neutral-900 ${allCartItems.length > 0 ? "bg-[#3441d4]" : "bg-neutral-500 cursor-not-allowed"}`}
          >
            Print
          </button>
          <button
            className={`w-3/4 py-4 text-center font-bold border-2 border-neutral-900 ${allCartItems.length > 0 ? " bg-green-600" : "bg-neutral-500 cursor-not-allowed"}`}
          >
            Send to kitchen
          </button>
        </div>
      </div>
      {invoiceShow && <Invoice open={invoiceShow} setIsOpen={setInvoiceShow} />}
    </>
  );
};

export { CartItems };
