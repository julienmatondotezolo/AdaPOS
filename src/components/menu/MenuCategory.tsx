/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { add } from "@/lib/features";

interface MenuCategoryProps {
  menuCategory: any;
  selectedMenuId: number | undefined;
  quantity: number;
  setQuantity: any;
  setCategoryId: any;
}

const MenuCategory = ({ menuCategory, selectedMenuId, quantity, setQuantity, setCategoryId }: MenuCategoryProps) => {
  const dispatch = useDispatch();

  const inCreament = (id: number) => {
    setCategoryId(id);
    setQuantity(quantity + 1);
  };

  const deCrement = (id: number) => {
    setCategoryId(id);
    if (quantity == 0) return;

    setQuantity(quantity - 1);
  };

  const addItems = (data: any) => {
    const { id, title, price, category } = data;
    const newData = { id, title, price: price * quantity, category, quantity: quantity };

    if (quantity > 0) {
      dispatch(add(newData));
      setQuantity(0);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 grid-cols-3 gap-2 p-3">
      {menuCategory?.map((menuItem: any, index: any) => (
        <>
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-between p-3 h-[150px] cursor-pointer bg-neutral-800 hover:bg-neutral-700 transition-all ease-out duration-500"
          >
            <div className="flex flex-col items-start justify-between">
              <article className="w-[50%] md:w-full">
                <h3 className="font-bold">{menuItem.title}</h3>
                <p className="text-xs text-[#818497]">€ {menuItem.price}</p>
              </article>
              {selectedMenuId == menuItem.id && quantity > 0 && (
                <button onClick={() => addItems(menuItem)} className="bg-green-700 px-6 py-2">
                  ADD
                </button>
              )}
            </div>
            <div className="absolute top-0 right-0 p-4 h-full flex flex-col justify-between items-center">
              <Plus
                onClick={() => inCreament(menuItem.id)}
                className="bg-neutral-900 hover:bg-neutral-800 p-2 box-content"
                size={15}
              />
              <p>{selectedMenuId == menuItem.id ? quantity : "0"}</p>
              <Minus
                onClick={() => deCrement(menuItem.id)}
                className="bg-neutral-900 hover:bg-neutral-800 p-2 box-content"
                size={15}
              />
            </div>
          </motion.div>
        </>
      ))}
    </div>
  );
};

export { MenuCategory };
