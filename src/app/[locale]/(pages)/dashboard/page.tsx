"use client";

import React from "react";
import { useSelector } from "react-redux";

import { Cart, CategoryBoard, Navigation, TableBoard, TimeHeader } from "@/components";

function Dashboard() {
  // const fetchCurrentRooms = () => fetchRooms();

  // const { isLoading, data: rooms } = useQuery("rooms", fetchCurrentRooms, {
  //   refetchOnWindowFocus: true,
  //   refetchOnMount: true,
  //   onSuccess(data) {
  //     console.log("data:", data);
  //   },
  // });

  const table = useSelector((state: any) => state.table);

  return (
    <div className="h-full w-full">
      <TimeHeader />
      <Navigation />
      <section className="flex flex-col justify-between md:flex-row w-full h-[calc(100vh-120px)] overflow-hidden">
        <div
          className={`w-full ${table.length ? "h-[50%] sm:h-max md:h-full md:w-8/12" : "h-[calc(100%-180px)] sm:h-[calc(100%-90px)] md:h-full"}`}
        >
          {table.length > 0 ? <CategoryBoard /> : <TableBoard roomId="69084" />}
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
