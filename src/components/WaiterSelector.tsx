import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { Waiter } from "@/_types";
import waitersData from "@/assets/users/data.json";
import { useAppDispatch } from "@/hooks";
import { setCurrentWaiter } from "@/lib/features";

const WaiterSelector: React.FC = () => {
  const text = useTranslations("Index");
  const dispatch = useAppDispatch();
  const waiters: Waiter[] = waitersData;

  const [selectedWaiter, setSelectedWaiter] = useState<Waiter>();
  const [, setSelectedWaiterPin] = useState<string | null>(null);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWaiterId = e.target.value;
    const selectedWaiter = waiters.find((w) => w.id === selectedWaiterId);

    if (selectedWaiter) {
      setSelectedWaiterPin("");
      setSelectedWaiter(selectedWaiter);
    }
  };

  const handlePinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredPin = e.target.value;

    setSelectedWaiterPin(enteredPin);

    if (selectedWaiter && enteredPin.length === 4) {
      if (enteredPin === selectedWaiter.password) {
        setShowConfirmButton(true);
      } else {
        setShowConfirmButton(false);
      }
    }
  };

  const handleConfirm = (e: any) => {
    e.preventDefault();
    if (selectedWaiter) dispatch(setCurrentWaiter(selectedWaiter));
  };

  return (
    <form onSubmit={handleConfirm} className="flex flex-col space-y-4 text-3xl w-[90%] m-auto">
      <select className="w-full p-4 border" onChange={handleSelectChange}>
        <option value="">{text("selectWaiter")}</option>
        {waiters.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>
      {selectedWaiter && (
        <>
          <input className="w-full p-4 border" type="password" placeholder="Enter PIN" onChange={handlePinInput} />
          <button
            className={`w-full p-4 ${showConfirmButton ? "bg-blue-500" : "bg-gray-600"} text-white`}
            disabled={!showConfirmButton}
            type="submit"
          >
            {text("confirm")}
          </button>
        </>
      )}
    </form>
  );
};

export { WaiterSelector };
