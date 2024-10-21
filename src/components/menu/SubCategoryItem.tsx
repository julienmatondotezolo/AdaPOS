/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */

import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import React from "react";

interface SubCategoryItemProps {
  category: any;
  selectedCategoryId: string | undefined;
  onClick: (categoryId: string) => void;
}

const SubCategoryItem = ({ category, selectedCategoryId, onClick }: SubCategoryItemProps) => {
  const locale = useLocale();
  const isSelected = selectedCategoryId == category.id;

  if (category)
    return (
      <div
        onClick={() => onClick(category.id)}
        className="relative overflow-hidden flex justify-between w-full bg-gray-500 hover:bg-gray-600 p-3 cursor-pointer"
      >
        <div className="flex flex-col items-start justify-between h-[80px] md:h-[65px] space-y-5">
          <h3 className="font-bold text-md">{category.names[locale]}</h3>
          {/* <p className="hidden md:block text-xs">{category.id}</p> */}
        </div>

        {isSelected && (
          <div className="absolute top-0 right-0 p-1 bg-black opacity-40 h-full flex items-end">
            <ChevronDown />
          </div>
        )}
      </div>
    );
};

export { SubCategoryItem };
