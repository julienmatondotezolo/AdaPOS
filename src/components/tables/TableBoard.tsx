import { motion } from "framer-motion";
import { openDB } from "idb";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { fetchTableByRoomId } from "@/_services";
import { zenchefTable } from "@/_types";

import { Table } from "./Table";

// Add interface for table lock status
interface TableLockStatus {
  tableNumber: string;
  orderId: string;
  status: "locked" | "unlocked";
}

const TableBoard = ({ roomId }: { roomId: string }) => {
  const [tableLockStatuses, setTableLockStatuses] = useState<Record<string, TableLockStatus>>({});

  // Initialize and check IndexedDB for locked tables
  useEffect(() => {
    const initDB = async () => {
      const db = await openDB("restaurant-db", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("tables")) {
            db.createObjectStore("tables", { keyPath: "tableNumber" });
          }
          if (!db.objectStoreNames.contains("orders")) {
            db.createObjectStore("orders", { keyPath: "id" });
          }
        },
      });

      // Get all table statuses
      const allTableStatuses = await db.getAll("tables");
      const statusMap = allTableStatuses.reduce(
        (acc, status) => ({
          ...acc,
          [status.tableNumber]: status,
        }),
        {},
      );

      setTableLockStatuses(statusMap);
    };

    initDB();
  }, []);

  const fetchCurrentTables = () => fetchTableByRoomId({ roomId });

  const { isLoading, data: tables } = useQuery("tables", fetchCurrentTables, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (data) => data.tables.sort((a: any, b: any) => a.name - b.name),
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
        {tables.map((table: zenchefTable, i: React.Key | null | undefined) => (
          <Table key={i} table={table} lockStatus={tableLockStatuses[table.name]} />
        ))}
      </motion.div>
    </div>
  );
};

export { TableBoard };
