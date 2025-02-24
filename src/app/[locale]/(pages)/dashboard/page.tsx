"use client";

import React, { useEffect } from "react";

import { Cart, CategoryBoard, Navigation, TableBoard, TimeHeader, WaiterSelector } from "@/components";
import { useAppSelector, useSocket } from "@/hooks";

function Dashboard() {
  const DEV_MODE: string | undefined = process.env.NEXT_PUBLIC_DEBUG_MODE;
  const currentWaiter = useAppSelector((state) => state.currentWaiter.currentWaiter);

  const zenchefRestaurantId = process.env.NEXT_PUBLIC_ZENCHEF_RESTAURANT_ID;

  const { socketJoinRoom } = useSocket();

  useEffect(() => {
    if (currentWaiter && !DEV_MODE) socketJoinRoom(zenchefRestaurantId, currentWaiter.id, currentWaiter.name);
  }, [currentWaiter, socketJoinRoom, zenchefRestaurantId, DEV_MODE]);

  const table = useAppSelector((state) => state.table);

  if (!currentWaiter)
    return (
      <div className="flex m-auto h-screen w-screen">
        <WaiterSelector />
      </div>
    );

  if (currentWaiter)
    return (
      <div className="h-full w-full">
        <TimeHeader waiterName={currentWaiter.name} />
        <Navigation />
        <section className="flex flex-col justify-between md:flex-row w-full h-[calc(100vh-120px)] overflow-hidden">
          <div
            className={`w-full ${table.length ? "h-[50%] sm:h-max md:h-full md:w-8/12" : "h-[calc(100%-180px)] sm:h-[calc(100%-90px)] md:h-full"}`}
          >
            {table.length > 0 ? <CategoryBoard /> : <TableBoard roomId="69084" />}
            {/* {table.length > 0 ? <CategoryBoard /> : <TableCanvas roomId="69084" />} */}
          </div>
          {table.length > 0 && (
            <div className={`md:w-4/12 w-full ${table.length && "h-fit md:h-full"} overflow-hidden`}>
              <Cart />
            </div>
          )}
        </section>
      </div>
    );
}

export default Dashboard;
