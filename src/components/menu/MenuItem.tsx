/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { MenuType } from "@/_types/adaType";

const MenuItem = ({ menu }: { menu: MenuType }) => {
  const customer = useSelector((state: any) => state.customer);
  const dispatch = useDispatch();

  return (
    <div className="flex justify-between w-full bg-gray-500 hover:bg-gray-600 p-3 cursor-pointer rounded-xl">
      <div className="flex flex-col items-start justify-between p-1 h-[80px] md:h-[135px] space-y-5">
        <h3 className="font-bold text-1xl md:text-2xl">{menu.name}</h3>
        <p className=" text-xs">Items: </p>
      </div>
    </div>
  );
};

export { MenuItem };
