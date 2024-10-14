import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { removeTable } from "@/lib/features";

function Navigation() {
  const dispatch = useDispatch();
  const table = useSelector((state: any) => state.table);
  const isTableSelected = table.length > 0 ? false : true;

  const goBack = () => {
    dispatch(removeTable([]));
  };

  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark"); // Toggle theme based on current theme
  };

  return (
    <div className="w-full border-2 border-neutral-900">
      <section className="w-full md:w-9/12 p-4 flex justify-between items-center">
        <article className="flex items-center space-x-4">
          {!isTableSelected && <ArrowLeft className=" cursor-pointer" onClick={() => goBack()} />}
          <section className="flex flex-col dark:text-white">
            <motion.h3 initial={{ x: 30 }} animate={{ x: 0 }} className="text-xl font-semibold">
              {isTableSelected ? "Tables" : "Menus"}
            </motion.h3>
            <small className="text-xs font-medium">{isTableSelected ? "16 tables" : "Items"}</small>
          </section>
        </article>
        {/* <form className="flex cursor-pointer">
          <Search size={20} />
        </form> */}
        <button onClick={toggleTheme} className="ml-4 p-2 border rounded">
          {theme === "dark" ? "Switch" : "Switch"}
        </button>
      </section>
    </div>
  );
}

export { Navigation };
