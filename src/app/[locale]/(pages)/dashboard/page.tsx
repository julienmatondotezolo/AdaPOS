"use client";

import React from "react";

import { TableBoard, TimeHeader } from "@/components";

function Dashboard() {
  return (
    <div className="h-full w-full">
      <TimeHeader />
      <TableBoard />
    </div>
  );
}

export default Dashboard;
