/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { openDB } from "idb";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { TableType } from "@/_types/adaType";
import { useAppDispatch } from "@/hooks";
import { addReopened, addTable } from "@/lib/features";

import { Dialog } from "../ui"; // Import Dialog component

interface TableLockStatus {
  tableNumber: string;
  orderId: string;
  status: "locked" | "unlocked";
}

interface TableProps {
  table: TableType;
  lockStatus?: TableLockStatus;
}

const Table = ({ table, lockStatus }: TableProps) => {
  const text = useTranslations("Index");
  const dispatch = useAppDispatch();
  const [couvert, setCouvert] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false); // State to control dialog visibility
  const [openOrderDialog, setOpenOrderDialog] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);

  const handleConfirmCouvert = async (e: any) => {
    e.preventDefault();

    if (couvert !== null) {
      const tableNumber = {
        tableId: table.id,
        tableNumber: table.name,
        couvert: couvert,
      };

      dispatch(addTable(tableNumber));
      setOpenDialog(false);
    }
  };

  const handleTableClick = async () => {
    if (lockStatus?.status === "locked") {
      // If table is locked, fetch and show the current order
      const db = await openDB("restaurant-db", 1);
      const order = await db.get("orders", lockStatus.orderId);

      setCurrentOrder(order);
      setOpenOrderDialog(true);
    } else {
      setOpenDialog(true);
    }
  };

  const handleReopenOrder = () => {
    if (currentOrder) {
      const tableNumber = {
        tableId: table.id,
        tableNumber: table.name,
        couvert: currentOrder.meals,
      };

      dispatch(addTable(tableNumber));

      try {
        // Then loop through currentOrder.items and add each item to cart
        currentOrder.items.forEach((item: any) => {
          // Create a clean item object with only necessary properties
          const itemToAdd = {
            id: item.id,
            names: item.names,
            price: item.price,
            quantity: item.quantity,
            category: item.category,
            sideDishIds: item.sideDishIds || [],
            selectedAside: item.selectedAside || null,
            selectedSauce: item.selectedSauce || null,
            selectedSupplement: item.selectedSupplement || null,
            selectedCooking: item.selectedCooking || null,
            cookings: item.cookings || [],
            sauces: item.sauces || [],
            sideDishes: item.sideDishes || [],
            supplements: item.supplements || [],
          };

          // Dispatch add action for each item
          dispatch(addReopened(itemToAdd));

          setOpenOrderDialog(false);
        });
      } catch (error) {
        console.error("error reopening orders:", error);
      }
    }
  };

  const handleCloseOrder = async () => {
    try {
      const db = await openDB("restaurant-db", 1);

      // Update order status to closed
      if (currentOrder) {
        currentOrder.status = "closed";
        await db.put("orders", currentOrder);
      }

      // Remove table lock
      await db.delete("tables", table.name);

      setOpenOrderDialog(false);
      // You might want to trigger a refresh of the table statuses here
      window.location.reload();
    } catch (error) {
      console.error("Error closing order:", error);
    }
  };

  return (
    <>
      <div
        className={`flex justify-between w-full ${
          lockStatus?.status === "locked" ? "bg-yellow-600" : "bg-gray-500 hover:bg-gray-600"
        } p-2 md:p-3 cursor-pointer`}
        onClick={handleTableClick}
      >
        <div className="flex m-auto flex-col justify-center h-[80px] md:h-[120px] space-y-5">
          <h3 className="font-bold text-sm md:text-xl">T-{table.name}</h3>
          {lockStatus?.status === "locked" && <span className="text-xs">🔒 {currentOrder?.waiter}</span>}
        </div>
      </div>

      <Dialog open={openDialog} setIsOpen={setOpenDialog}>
        <div className="p-4">
          <h3 className="text-xl mb-8">{text("selectDishNumber")}</h3>
          <form onSubmit={handleConfirmCouvert}>
            <input
              type="number"
              value={couvert || ""}
              onChange={(e) => setCouvert(Number(e.target.value))}
              className="border p-2 mb-4 w-full"
              placeholder={text("dishNumber")}
              required
            />
            <button
              className="w-full py-4 text-center font-bold border-2 border-neutral-900 bg-green-600"
              type="submit"
            >
              {text("confirm")}
            </button>
          </form>
        </div>
      </Dialog>

      <Dialog open={openOrderDialog} setIsOpen={setOpenOrderDialog}>
        <div className="p-4">
          <h3 className="text-xl mb-4">Table {table.name} - Current Order</h3>
          <div className="mb-4">
            <p>
              Order ID: <b>{currentOrder?.id}</b>
            </p>
            <p>
              Created: <b>{new Date(currentOrder?.createdAt).toLocaleString()}</b>
            </p>
            <p>
              Meals: <b>{currentOrder?.meals}</b>
            </p>
            <p>
              Waiter: <b>{currentOrder?.waiter}</b>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleReopenOrder}
              className="py-2 text-center font-bold border-2 border-neutral-900 bg-yellow-600"
            >
              Reopen Order
            </button>
            <button
              onClick={handleCloseOrder}
              className="py-2 text-center font-bold border-2 border-neutral-900 bg-red-600"
            >
              Close Order
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export { Table };
