/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */

import { ChevronDown } from "lucide-react";
import React from "react";

import { MenuType } from "@/_types/adaType";

interface CategoryItemProps {
  category: any;
  selectedCategoryId: string | undefined;
  onClick: (categoryId: string) => void;
}

const CategoryItem = ({ category, selectedCategoryId, onClick }: CategoryItemProps) => {
  const isSelected = selectedCategoryId == category.id;

  if (category)
    return (
      <div
        onClick={() => onClick(category.id)}
        className="relative overflow-hidden flex justify-between w-full bg-gray-500 hover:bg-gray-600 p-3 cursor-pointer"
      >
        <div className="flex flex-col items-start justify-between p-1 h-[80px] md:h-[105px] space-y-5">
          <h3 className="font-bold md:text-xl">{category.names["en"]}</h3>
          {/* <p className="hidden md:block text-xs">Sub items: {category.subCategories.length}</p> */}
        </div>

        {isSelected && (
          <div className="absolute top-0 right-0 p-1 bg-black opacity-40 h-full flex items-end">
            <ChevronDown />
          </div>
        )}
      </div>
    );
};

export { CategoryItem };
