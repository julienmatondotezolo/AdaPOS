import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { removeCustomer } from "@/lib/features";

function Navigation() {
  const dispatch = useDispatch();
  const customer = useSelector((state: any) => state.customer);
  const isTableSelected = customer.length > 0 ? false : true;

  const goBack = () => {
    dispatch(removeCustomer([]));
  };

  return (
    <div className="w-full p-4 flex items-center border-2 border-neutral-900">
      <article className="flex items-center space-x-4">
        {!isTableSelected && <ArrowLeft className=" cursor-pointer" onClick={() => goBack()} />}
        <section className="flex flex-col dark:text-white">
          <motion.h3 initial={{ x: 30 }} animate={{ x: 0 }} className="text-xl font-semibold">
            {isTableSelected ? "Tables" : "Menus"}
          </motion.h3>
          <small className="text-xs font-medium">{isTableSelected ? "16 tables" : "Items"}</small>
        </section>
      </article>
    </div>
  );
}

export { Navigation };
