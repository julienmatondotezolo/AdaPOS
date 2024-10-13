/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */

import { ChevronDown } from "lucide-react";
import React from "react";

import { MenuType } from "@/_types/adaType";

interface MenuItemProps {
  menu: MenuType;
  selectedMenuId: number | undefined;
  onClick: (menuCategory: string, menuId: number) => void;
}

const MenuItem = ({ menu, selectedMenuId, onClick }: MenuItemProps) => {
  const isSelected = selectedMenuId == menu.id;

  return (
    <div
      onClick={() => onClick(menu.category, menu.id)}
      className="relative overflow-hidden flex justify-between w-full bg-gray-500 hover:bg-gray-600 p-3 cursor-pointer rounded-xl"
    >
      <div className="flex flex-col items-start justify-between p-1 h-[80px] md:h-[135px] space-y-5">
        <h3 className="font-bold text-1xl md:text-2xl">{menu.name}</h3>
        <p className=" text-xs">Items: </p>
      </div>

      {isSelected && (
        <div className="absolute top-0 right-0 p-1 bg-black opacity-40 h-full flex items-end">
          <ChevronDown />
        </div>
      )}
    </div>
  );
};

export { MenuItem };
