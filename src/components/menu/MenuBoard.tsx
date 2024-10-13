import { motion } from "framer-motion";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";

import { MenuType } from "@/_types/adaType";

import menus from "../../app/api/api";
import { MenuCategory } from "./MenuCategory";
import { MenuItem } from "./MenuItem";

const menuData: MenuType[] = [
  {
    id: 0,
    name: "Starter (Veg)",
    category: "Starter1",
  },
  {
    id: 1,
    name: "Starter (Non-Veg)",
    category: "Starter2",
  },
  {
    id: 2,
    name: "Main Course",
    category: "mainCourse",
  },
  {
    id: 3,
    name: "Pizza",
    category: "Pizza",
  },
  {
    id: 4,
    name: "Dessert",
    category: "Dessert",
  },
];

const MenuBoard = () => {
  const queryClient = useQueryClient();

  const [quantity, setQuantity] = useState(0);
  const [idCategory, setCategoryId] = useState<number>();
  const [categoryDetails, setCategoryDetails] = useState<any>();

  const getCategory = (category: string) => {
    const newArr = menus.filter((a: any) => a.category === category);

    setCategoryDetails(newArr);
    console.log(newArr);
  };

  const openMenuCategory = (menuCategory: string, menuId: number) => {
    getCategory(menuCategory);
    setCategoryId(menuId);
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="grid lg:grid-cols-5 grid-cols-4 gap-2 p-3 border-2 border-neutral-900"
      >
        {menuData.map((menu, i) => (
          <MenuItem
            key={i}
            menu={menu}
            selectedMenuId={idCategory}
            onClick={() => openMenuCategory(menu.category, menu.id)}
          />
        ))}
      </motion.div>
      <div className="p-4 h-[334px] border-2 border-neutral-900">
        {categoryDetails?.length > 0 ? (
          <MenuCategory
            menuCategory={categoryDetails}
            selectedMenuId={idCategory}
            quantity={quantity}
            setQuantity={setQuantity}
            setCategoryId={setCategoryId}
          />
        ) : (
          <small className="text-neutral-600">Select any category. </small>
        )}
      </div>
    </div>
  );
};

export { MenuBoard };
