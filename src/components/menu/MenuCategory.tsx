/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";

import { add } from "@/lib/features";

interface MenuCategoryProps {
  menuCategory: any;
  selectedMenuCategoryItem: number | undefined;
  quantity: number;
  setQuantity: any;
  setCategoryItemId: any;
}

const MenuCategory = ({
  menuCategory,
  selectedMenuCategoryItem,
  quantity,
  setQuantity,
  setCategoryItemId,
}: MenuCategoryProps) => {
  const dispatch = useDispatch();

  const inCreament = (id: number) => {
    setCategoryItemId(id);
    setQuantity(quantity + 1);
  };

  const deCrement = (id: number) => {
    setCategoryItemId(id);
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
    <div className="grid grid-cols-4 lg:grid-cols-5 gap-2 p-3">
      {menuCategory?.map((menuCategory: any, index: any) => (
        <>
          <motion.div
            key={index + "cat" + menuCategory.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`flex justify-between p-3 h-[120px] md:h-[150px] cursor-pointer ${selectedMenuCategoryItem == menuCategory.id && quantity > 0 ? "bg-green-600 hover:bg-green-500" : "bg-neutral-800 hover:bg-neutral-700"} transition-all ease-out duration-100`}
          >
            <div onClick={() => addItems(menuCategory)} className="flex md:flex-col items-start justify-between w-full">
              <article className="text-sm md:text-base w-full md:w-[50%]">
                <h3 className="font-bold">{menuCategory.title}</h3>
                <p className="hidden md:block text-xs text-[#818497]">€ {menuCategory.price}</p>
                {selectedMenuCategoryItem == menuCategory.id && quantity > 0 && (
                  <button className="hidden md:block font-bold bg-green-600 px-6 py-2">ADD</button>
                )}
              </article>
            </div>
            <div className="absolute left-0 bottom-0 md:left-auto md:top-0 md:right-0 p-1 md:p-4 w-full md:w-fit md:h-full flex md:flex-col justify-between items-center">
              <Plus
                onClick={() => inCreament(menuCategory.id)}
                className="bg-neutral-900 hover:bg-neutral-800 p-2 box-content"
                size={15}
              />
              <p>{selectedMenuCategoryItem == menuCategory.id ? quantity : "0"}</p>
              <Minus
                onClick={() => deCrement(menuCategory.id)}
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
