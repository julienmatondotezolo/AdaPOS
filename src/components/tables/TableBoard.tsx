import { motion } from "framer-motion";
import React from "react";

import tableData from "../../app/api/tables";
import { Table } from "./Table";

const TableBoard = () => {
  // const queryClient = useQueryClient();

  Table;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="grid grid-cols-4 lg:grid-cols-6 gap-2 p-3 border-2 border-neutral-900"
    >
      {tableData.map((table, i) => (
        <Table key={i} table={table} />
      ))}
    </motion.div>
  );
};

export { TableBoard };
