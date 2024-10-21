import { motion } from "framer-motion";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { fetchCategories, fetchMenuItemByCategoryId } from "@/_services";

import { CategoryItem } from "./CategoryItem";
import { MenuItem } from "./MenuItem";
import { SubCategoryItem } from "./SubCategoryItem";

const CategoryBoard = () => {
  const [categoryId, setCategoryId] = useState<string>();
  const [subCategoryId, setSubCategoryId] = useState<string>();
  const [subCategories, setSubCategories] = useState<any>();
  const [quantity, setQuantity] = useState(1);
  const [menuItemId, setMenuItemId] = useState<string>();

  const queryClient = useQueryClient();
  const fetchCurrentTables = () => fetchCategories();

  // Define the mutation for fetching menu items
  const { mutate: fetchMenuItems, data: menuItems } = useMutation(fetchMenuItemByCategoryId, {
    onSuccess: () => {
      queryClient.invalidateQueries("menuItems");
    },
  });

  const { isLoading, data: categories } = useQuery("categories", fetchCurrentTables, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    onSuccess(data) {
      const firstCategory = data[0];

      setCategoryId(firstCategory.id);
      setSubCategories(firstCategory.subCategories);
    },
  });

  const openSubCategory = (category: any) => {
    setMenuItemId("");
    setSubCategoryId("");
    setCategoryId(category.id);
    setSubCategories(category.subCategories);
  };

  const openMenuItem = (category: any) => {
    setSubCategoryId(category.id);
    fetchMenuItems({ categoryId: category.id });
    setMenuItemId(category.id);
  };

  if (isLoading)
    return (
      <div className="flex h-full overflow-scroll pb-12 border-2 border-neutral-900">
        <p className="m-auto">Loading categories</p>
      </div>
    );

  return (
    <div className="relative flex flex-col h-full">
      <div
        className={`${menuItemId ? "h-1/2" : "h-full"} overflow-y-scroll scrollbar-hide p-3 border-2 border-neutral-900`}
      >
        {subCategories && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-16"
          >
            {subCategories.map((category: any, index: any) => (
              <SubCategoryItem
                key={index}
                category={category}
                selectedCategoryId={subCategoryId}
                onClick={() => openMenuItem(category)}
              />
            ))}
          </motion.div>
        )}

        {categories && (
          <CategoryItem
            categories={categories}
            categoryId={categoryId}
            onClick={(category) => openSubCategory(category)}
          />
        )}
      </div>

      {menuItemId && (
        <div className="h-1/2 overflow-y-scroll scrollbar-hide border-2 border-neutral-900">
          <MenuItem
            items={menuItems}
            selectedMenuItem={menuItemId}
            quantity={quantity}
            setQuantity={setQuantity}
            setMenuItemId={setMenuItemId}
          />
        </div>
      )}
    </div>
  );
};

export { CategoryBoard };
