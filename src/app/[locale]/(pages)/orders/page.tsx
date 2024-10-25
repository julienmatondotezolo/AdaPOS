"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import React from "react";
import { useQuery } from "react-query";

import { fetchOrder } from "@/_services";
import { TimeHeader } from "@/components";

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);

  date.setHours(date.getHours() + 2);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

function Orders() {
  const locale = useLocale();

  const { isLoading, data: orders } = useQuery("order", fetchOrder, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    select: (data) => data.sort((a: any, b: any) => b.createdTime - a.createdTime),
  });

  if (isLoading)
    return (
      <div className="flex h-full overflow-scroll pb-12">
        <p className="m-auto">Loading categories</p>
      </div>
    );

  return (
    <>
      <TimeHeader />
      <div className="h-full overflow-scroll pb-12 border-2 border-neutral-900">
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="grid grid-cols-4 lg:grid-cols-4 gap-2 p-3">
          {orders.map((order: any, index: any) => {
            const totalCouvert = order.orderMenuItems.reduce(
              (sum: number, menuItem: any) => sum + menuItem.quantity,
              0,
            ); // Calculate total quantity

            return (
              <div
                key={index}
                className="flex flex-col justify-between w-full bg-secondary hover:bg-gray-600 p-4 md:p-3 cursor-pointer text-white"
              >
                <div className="flex flex-col">
                  <article className="mb-4 pb-2 border-b border-neutral-400/30">
                    <p className="text-xl font-bold">Table: {order.table}</p>
                    <p className="text-xs">{formatDate(order.createdTime)}</p>
                  </article>
                  <section className="bg-black/10 p-4 w-full">
                    {order.orderMenuItems.map((menuItems: any, index: any) => (
                      <div key={index} className="flex justify-between py-1">
                        <p>{menuItems.menuItem.names[locale]}</p>
                        <section className="w-12">
                          <p>Qty: {menuItems.quantity}</p>
                        </section>
                      </div>
                    ))}
                  </section>
                </div>
                <p className="mt-6 text-lg">
                  Total couvert: <b className="bold">{totalCouvert}</b>
                </p>{" "}
                {/* Display total quantity */}
              </div>
            );
          })}
        </motion.div>
      </div>
    </>
  );
}

export default Orders;
