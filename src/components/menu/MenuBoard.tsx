import { motion } from "framer-motion";
import React, { useState } from "react";

import menusCategory from "../../app/api/menuCategory";
import menusItems from "../../app/api/menuItems";
import { MenuCategory } from "./MenuCategory";
import { MenuItem } from "./MenuItem";

const MenuBoard = () => {
  // const queryClient = useQueryClient();

  const [quantity, setQuantity] = useState(0);
  const [idCategoryId, setCategoryId] = useState<string>();
  const [idCategoryItemId, setCategoryItemId] = useState<number>();
  const [categoryDetails, setCategoryDetails] = useState<any>();

  const getCategory = (category: string) => {
    const newArr = menusItems.filter((a: any) => a.category === category);

    setCategoryDetails(newArr);
  };

  const openMenuCategory = (menuCategory: string) => {
    getCategory(menuCategory);
    setCategoryId(menuCategory);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="h-1/2 overflow-y-scroll scrollbar-hide p-3 border-2 border-neutral-900">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2"
        >
          {menusCategory.map((menu, i) => (
            <MenuItem
              key={i}
              menu={menu}
              selectedMenuCategory={idCategoryId}
              onClick={() => openMenuCategory(menu.category)}
            />
          ))}
        </motion.div>
      </div>
      <div className="h-1/2 overflow-y-scroll scrollbar-hide border-2 border-neutral-900">
        {categoryDetails?.length > 0 ? (
          <MenuCategory
            menuCategory={categoryDetails}
            selectedMenuCategoryItem={idCategoryItemId}
            quantity={quantity}
            setQuantity={setQuantity}
            setCategoryItemId={setCategoryItemId}
          />
        ) : (
          <small className="text-neutral-600 text-lg p-4">Select any category. </small>
        )}
      </div>
    </div>
  );
};

export { MenuBoard };
