import React from "react";

import { useAppSelector } from "@/hooks";

import { CartItems } from "./CartItems";

const Cart = () => {
  const table = useAppSelector((state) => state.table);
  const allCartItems = useAppSelector((state) => state.cart);
  const allReoponedCartItems = useAppSelector((state) => state.reopenedCart);

  const isTableSlected = table.length > 0 ? true : false;

  if (!isTableSlected)
    return (
      <div className="p-8 border-2 border-neutral-900 text-center md:text-left">
        <h3 className="text-xl font-semibold text-neutral-600">No table selected</h3>
      </div>
    );

  return (
    <div className="flex flex-col justify-between w-full h-[calc(100%-1rem)]">
      <div className="flex items-center justify-between p-2 md:p-4 border-2 border-neutral-900">
        <section>
          <h3 className="text-sm font-semibold">Table {table[0]?.tableNumber}</h3>
          <p className="text-xs">Couvert: {table[0]?.couvert}</p>
        </section>
        {allCartItems.length > 0 && (
          <article className="flex space-x-2 text-sm">
            <p>Items:</p>
            <p className="font-bold">{allCartItems.length + allReoponedCartItems.length}</p>
          </article>
        )}
      </div>
      <CartItems />
    </div>
  );
};

export { Cart };
