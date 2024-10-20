import { motion } from "framer-motion";
import React from "react";
import { useQuery } from "react-query";

import { fetchTableByRoomId } from "@/_services";
import { TableType } from "@/_types";

import { Table } from "./Table";

const TableBoard = ({ roomId }: { roomId: string }) => {
  const fetchCurrentTables = () => fetchTableByRoomId({ roomId });

  const { isLoading, data: tables } = useQuery("tables", fetchCurrentTables, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    onSuccess(data) {
      const filteredData = data.tables.sort((a: any, b: any) => a.name.localeCompare(b.name));

      return filteredData;
    },
    keepPreviousData: true,
  });

  if (isLoading)
    return (
      <div className="flex h-full overflow-scroll pb-12 border-2 border-neutral-900">
        <p className="m-auto">Loading tables...</p>
      </div>
    );

  return (
    <div className="h-full overflow-scroll pb-12 border-2 border-neutral-900">
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="grid grid-cols-4 lg:grid-cols-8 gap-2 p-3">
        {tables.tables.map((table: TableType, i: React.Key | null | undefined) => (
          <Table key={i} table={table} />
        ))}
      </motion.div>
    </div>
  );
};

export { TableBoard };
