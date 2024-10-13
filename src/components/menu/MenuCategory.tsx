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
    <div className="grid lg:grid-cols-5 grid-cols-3 gap-2 p-3">
      {menuCategory?.map((menuCategory: any, index: any) => (
        <>
          <motion.div
            key={"cat" + menuCategory.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-between p-3 h-[150px] cursor-pointer bg-neutral-800 hover:bg-neutral-700 transition-all ease-out duration-500"
          >
            <div className="flex flex-col items-start justify-between">
              <article className="w-[50%] md:w-full">
                <h3 className="font-bold">{menuCategory.title}</h3>
                <p className="text-xs text-[#818497]">€ {menuCategory.price}</p>
              </article>
              {selectedMenuCategoryItem == menuCategory.id && quantity > 0 && (
                <button onClick={() => addItems(menuCategory)} className="font-bold bg-green-600 px-6 py-2">
                  ADD
                </button>
              )}
            </div>
            <div className="absolute top-0 right-0 p-4 h-full flex flex-col justify-between items-center">
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
