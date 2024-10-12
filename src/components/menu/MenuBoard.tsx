import { motion } from "framer-motion";
import React from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";

import { MenuType } from "@/_types/adaType";

import { MenuItem } from "./MenuItem";

const menuData: MenuType[] = [
  {
    id: 0,
    name: "Starter (Veg)",
  },
  {
    id: 1,
    name: "Starter (Non-Veg)",
  },
  {
    id: 2,
    name: "Main Course",
  },
  {
    id: 3,
    name: "Pizza",
  },
  {
    id: 4,
    name: "Dessert",
  },
];

const MenuBoard = () => {
  const queryClient = useQueryClient();

  return (
    <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="grid lg:grid-cols-5 grid-cols-4 gap-2 p-3">
      {menuData.map((menu, i) => (
        <MenuItem key={i} menu={menu} />
      ))}
    </motion.div>
  );
};

export { MenuBoard };
