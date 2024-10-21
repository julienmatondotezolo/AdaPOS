import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
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

  return (
    <div className="w-full border-b-2 dark:border-neutral-900">
      <section className={`w-full ${table.length && "md:w-8/12"} p-4 flex justify-between items-center`}>
        <article className="flex items-center space-x-4">
          {!isTableSelected && <ArrowLeft className=" cursor-pointer" onClick={() => goBack()} />}
          <section className="flex flex-col">
            <motion.h3 initial={{ x: 30 }} animate={{ x: 0 }} className="text-xl font-semibold">
              {isTableSelected ? "Tables" : "Menus"}
            </motion.h3>
            <small className="text-xs font-medium">{isTableSelected ? "16 tables" : "Items"}</small>
          </section>
        </article>
        {table.length > 0 && (
          <form className="flex cursor-pointer">
            <Search size={20} />
          </form>
        )}
      </section>
    </div>
  );
}

export { Navigation };
