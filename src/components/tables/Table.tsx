/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { useDispatch } from "react-redux";

import { TableType } from "@/_types/adaType";
import { addTable } from "@/lib/features";

const Table = ({ table }: { table: TableType }) => {
  const dispatch = useDispatch();

  const allEvents = (table: TableType) => {
    const tableNumber = {
      tableId: table.id,
      tableNumber: table.name,
    };

    dispatch(addTable(tableNumber));
  };

  return (
    <div
      className={`flex justify-between w-full bg-gray-500 hover:bg-gray-600 p-2 md:p-3 cursor-pointer`}
      onClick={() => allEvents(table)}
    >
      <div className="flex m-auto flex-col justify-center h-[80px] md:h-[120px] space-y-5">
        <h3 className="font-bold text-sm md:text-xl">{table.name}</h3>
      </div>
    </div>
  );
};

export { Table };
