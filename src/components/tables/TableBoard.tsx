import { motion } from "framer-motion";
import React from "react";

import { TableType } from "@/_types/adaType";

import { Table } from "./Table";

const tableData: TableType[] = [
  {
    id: 0,
    name: "Table 1",
    min: 0,
    max: 0,
    is_bookable: false,
    ordered: false,
  },
  {
    id: 1,
    name: "Table 2",
    min: 0,
    max: 0,
    is_bookable: false,
    ordered: false,
  },
  {
    id: 2,
    name: "Table 3",
    min: 0,
    max: 0,
    is_bookable: false,
    ordered: false,
  },
  {
    id: 3,
    name: "Table 4",
    min: 0,
    max: 0,
    is_bookable: false,
    ordered: false,
  },
  {
    id: 4,
    name: "Table 5",
    min: 0,
    max: 0,
    is_bookable: false,
    ordered: false,
  },
  {
    id: 5,
    name: "Table 6",
    min: 0,
    max: 0,
    is_bookable: false,
    ordered: false,
  },
];

const TableBoard = () => {
  // const queryClient = useQueryClient();

  Table;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="grid lg:grid-cols-6 grid-cols-4 gap-2 p-3 border-2 border-neutral-900"
    >
      {tableData.map((table, i) => (
        <Table key={i} table={table} />
      ))}
    </motion.div>
  );
};

export { TableBoard };
