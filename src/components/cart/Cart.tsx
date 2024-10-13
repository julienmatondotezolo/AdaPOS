import React from "react";
import { useSelector } from "react-redux";

import { CartItems } from "./CartItems";

const Cart = () => {
  const customer = useSelector((state: any) => state.customer);

  const isTableSlected = customer.length > 0 ? true : false;

  if (!isTableSlected)
    return (
      <div className="p-8 border-2 border-neutral-900">
        <h3 className="text-xl font-semibold">Select a table</h3>
      </div>
    );

  return (
    <div className="w-full">
      <div className="flex flex-1 items-center justify-between p-4 border-2 border-neutral-900">
        <h3 className="text-xl font-semibold">{customer[0]?.tableNumber}</h3>
      </div>
      <CartItems />
    </div>
  );
};

export { Cart };
