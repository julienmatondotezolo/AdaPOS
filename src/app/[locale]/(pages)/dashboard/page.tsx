"use client";

import React from "react";
import { useSelector } from "react-redux";

import { Cart, MenuBoard, Navigation, TableBoard, TimeHeader } from "@/components";

function Dashboard() {
  const table = useSelector((state: any) => state.table);

  return (
    <div className="h-full w-full">
      <TimeHeader />
      <Navigation />
      <section className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-9/12">{table.length > 0 ? <MenuBoard /> : <TableBoard />}</div>
        <div className="w-full md:w-3/12">
          <Cart />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
