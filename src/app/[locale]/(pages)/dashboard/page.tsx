"use client";

import React from "react";
import { useSelector } from "react-redux";

import { Cart, MenuBoard, Navigation, TableBoard, TimeHeader } from "@/components";

function Dashboard() {
  const customer = useSelector((state: any) => state.customer);

  return (
    <div className="h-full w-full">
      <TimeHeader />
      <Navigation />
      <section className="flex flex-col md:flex-row">
        <div className="w-full md:w-8/12">{customer.length > 0 ? <MenuBoard /> : <TableBoard />}</div>
        <div className="w-full md:w-2/12">
          <Cart />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
