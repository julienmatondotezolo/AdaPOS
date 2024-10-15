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
      <section className="flex flex-col justify-between md:flex-row w-full h-[calc(100vh-120px)] overflow-hidden">
        <div
          className={`w-full ${table.length ? "h-[50%] sm:h-max md:h-full" : "h-[calc(100%-180px)] sm:h-[calc(100%-90px)] md:h-full"} md:w-9/12`}
        >
          {table.length > 0 ? <MenuBoard /> : <TableBoard />}
        </div>
        <div className={`md:w-3/12 w-full ${table.length && "h-fit md:h-full"} overflow-hidden`}>
          <Cart />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
