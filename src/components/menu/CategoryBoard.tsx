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
    select: (data) => data.sort((a: any, b: any) => a.order - b.order),
    onSuccess(data) {
      if (data && data.length > 0) {
        const firstCategory = data[0];

        setCategoryId(firstCategory.id);
        setSubCategories(firstCategory.subCategories);
      }
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
      <div className="flex h-full overflow-scroll pb-12">
        <p className="m-auto">Loading categories...</p>
      </div>
    );

  if (!categories)
    return (
      <div className="flex h-full overflow-scroll pb-12">
        <p className="m-auto">No categories</p>
      </div>
    );

  return (
    <div className="relative flex flex-col h-full">
      <div
        className={`${menuItemId ? "h-1/2" : "h-full"} overflow-y-scroll scrollbar-hide p-3 border-t-2 border-r-2 dark:border-neutral-900`}
      >
        {subCategories && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-16"
          >
            {subCategories
              .sort((a: any, b: any) => a.order - b.order)
              .map((category: any) => (
                <SubCategoryItem
                  key={category.id}
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

      {menuItemId ? (
        <div className="flex h-1/2 overflow-y-scroll scrollbar-hide border-2 border-neutral-900">
          <MenuItem
            items={menuItems}
            selectedMenuItem={menuItemId}
            quantity={quantity}
            setQuantity={setQuantity}
            setMenuItemId={setMenuItemId}
          />
        </div>
      ) : (
        <div className="h-1/2 border-2 border-neutral-900 p-8">
          <p className="h-1/2">Select sub category</p>
        </div>
      )}
    </div>
  );
};

export { CategoryBoard };
