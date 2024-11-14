/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { TableType } from "@/_types/adaType";
import { addTable } from "@/lib/features";

import { Dialog } from "../ui"; // Import Dialog component

const Table = ({ table }: { table: TableType }) => {
  const text = useTranslations("Index");
  const dispatch = useDispatch();
  const [couvert, setCouvert] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false); // State to control dialog visibility

  const handleConfirmCouvert = (e: any) => {
    e.preventDefault();

    if (couvert !== null) {
      const tableNumber = {
        tableId: table.id,
        tableNumber: table.name,
        couvert: couvert,
      };

      dispatch(addTable(tableNumber));
      setOpenDialog(false); // Close dialog after confirming
    }
  };

  const allEvents = () => {
    if (couvert !== null) {
      handleConfirmCouvert; // Call confirm function if couvert is already set
    } else {
      setOpenDialog(true); // Open dialog to select couvert
    }
  };

  return (
    <>
      <div
        className={`flex justify-between w-full bg-gray-500 hover:bg-gray-600 p-2 md:p-3 cursor-pointer`}
        onClick={() => allEvents()}
      >
        <div className="flex m-auto flex-col justify-center h-[80px] md:h-[120px] space-y-5">
          <h3 className="font-bold text-sm md:text-xl">T-{table.name}</h3>
        </div>
      </div>

      <Dialog open={openDialog} setIsOpen={setOpenDialog}>
        <div className="p-4">
          <h3 className="text-xl mb-8">Veuillez saisir le nombre de couverts :</h3>
          <form onSubmit={handleConfirmCouvert}>
            <input
              type="number"
              value={couvert || ""}
              onChange={(e) => setCouvert(Number(e.target.value))}
              className="border p-2 mb-4 w-full"
              placeholder="Number of couvert"
              required
            />
            <button
              className="w-full py-4 text-center font-bold border-2 border-neutral-900 bg-green-600"
              type="submit"
            >
              Confirm
            </button>
          </form>
        </div>
      </Dialog>
    </>
  );
};

export { Table };
