import { motion } from "framer-motion";
import React, { useState } from "react";
import { useQuery } from "react-query";

import { fetchCategories } from "@/_services";

import { CategoryItem } from "./CategoryItem";
import { MenuCategory } from "./MenuCategory";

const CategoryBoard = () => {
  // const queryClient = useQueryClient();
  const fetchCurrentTables = () => fetchCategories();

  const { isLoading, data: categories } = useQuery("categories", fetchCurrentTables, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const [quantity, setQuantity] = useState(1);
  const [categoryId, setCategoryId] = useState<string>();
  const [idCategoryItemId, setCategoryItemId] = useState<number>();
  const [subCategory, setSubCategory] = useState<any>();

  const openSubCategory = (category: any) => {
    setCategoryId(category.id);
    setSubCategory(category.subCategories);
  };

  const openMenuItem = (category: any) => {
    console.log("category:", category);
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
        className={`${categoryId ? "h-1/2" : "h-full"} overflow-y-scroll scrollbar-hide p-3 border-2 border-neutral-900`}
      >
        {subCategory && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2 pt-16"
          >
            {subCategory.map((category: any, index: any) => (
              <CategoryItem
                key={index}
                category={category}
                selectedCategoryId={categoryId}
                onClick={() => openMenuItem(category)}
              />
            ))}
          </motion.div>
        )}

        <div className="absolute top-0 left-0 w-full bg-[#121212] border-b-2 border-neutral-900 overflow-y-scroll">
          <section className="flex w-fit">
            {categories.map((category: any, index: any) => (
              <button
                key={index}
                onClick={() => openSubCategory(category)}
                className={`md:text-xl font-semibold px-8 py-2 md:py-4 ${category.id == categoryId && "border-green-600 border-b-2"}`}
              >
                <p className="w-max">{category.names["en"]}</p>
              </button>
            ))}
          </section>
        </div>
      </div>

      {/* {categoryDetails?.length > 0 && (
        <div className="h-1/2 overflow-y-scroll scrollbar-hide border-2 border-neutral-900">
          <MenuCategory
            menuCategory={categoryDetails}
            selectedMenuCategoryItem={idCategoryItemId}
            quantity={quantity}
            setQuantity={setQuantity}
            setCategoryItemId={setCategoryItemId}
          />
        </div>
      )} */}
    </div>
  );
};

export { CategoryBoard };
