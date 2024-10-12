/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { TableType } from "@/_types/adaType";
import { addCustomer } from "@/lib/features";

const Table = ({ table }: { table: TableType }) => {
  const customer = useSelector((state: any) => state.customer);
  const dispatch = useDispatch();

  const allEvents = (table: TableType) => {
    if (customer.length != 0) {
      console.log("customer", customer);
    }
    const tableNumber = {
      tableId: table.id,
      tableNumber: table.name,
    };

    dispatch(addCustomer(tableNumber));
  };

  return (
    <div
      className="flex justify-between w-full bg-gray-500 hover:bg-gray-600 p-3 cursor-pointer rounded-xl"
      onClick={() => allEvents(table)}
    >
      <div className="flex flex-col items-start justify-between p-1 h-[80px] md:h-[135px] space-y-5">
        <h3 className="font-bold text-1xl md:text-2xl">{table.name}</h3>
        <p className=" text-xs">Status: </p>
      </div>
    </div>
  );
};

export { Table };
