/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { MenuType } from "@/_types";
import { add, remove, update } from "@/lib/features";

interface MenuItemProps {
  items: any;
  selectedMenuItem: string | undefined;
  quantity: number;
  setQuantity: any;
  setMenuItemId: any;
}

const MenuItem = ({ items, selectedMenuItem, quantity, setQuantity, setMenuItemId }: MenuItemProps) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart);

  const inCreament = (data: any) => {
    const { id, names, price, category, acc } = data;
    const name = names["en"];
    const newData = { id, name, price: price * 1, category, quantity: 1 };

    const existingItem = cartItems.find((item: any) => item.id === id);

    setMenuItemId(id);

    if (acc && acc.length > 0) {
      // Replace alert with a selection mechanism
      const selectedAcc = prompt("Select an option: " + acc.join(", "));

      if (!selectedAcc || !acc.includes(selectedAcc)) {
        alert("Invalid selection");
        return;
      }

      const itemWithAside: MenuType = {
        id,
        name,
        price: price * 1,
        category,
        quantity: existingItem ? existingItem.quantity + 1 : 1,
        selectedAside: selectedAcc, // Save the selected option
      };

      dispatch(add(itemWithAside));

      return;
    }

    if (existingItem) {
      setQuantity((prevQuantity: any) => prevQuantity + 1);
      const updates = {
        name,
        price: price * 1,
        category,
        quantity: existingItem ? existingItem.quantity + 1 : 1,
      };

      // Use upsert action
      dispatch(update({ id, updates }));
    } else {
      setQuantity(1);
      dispatch(add(newData));
    }
  };

  const deCrement = (data: any) => {
    const { id } = data;

    setMenuItemId(id);
    const existingItem = cartItems.find((item: any) => item.id === id); // Check for existing item

    if (existingItem) {
      if (existingItem.quantity === 1) {
        setQuantity(0);
        dispatch(remove(id));
        return;
      }

      const newQuantity = existingItem.quantity - 1; // Use existing item's quantity
      const updates = { quantity: newQuantity };

      // Use upsert action
      dispatch(update({ id, updates }));
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="grid grid-cols-4 lg:grid-cols-5 gap-2 p-3">
      {items?.map((menu: any, index: any) => (
        <>
          <motion.div
            key={index + "cat" + menu.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`flex justify-between p-3 h-[90px] sm:h-[120px] md:h-[150px] cursor-pointer ${selectedMenuItem == menu.id && quantity > 0 ? "bg-green-600 hover:bg-green-500" : "bg-neutral-800 hover:bg-neutral-700"} transition-all ease-out duration-100`}
          >
            <div className="flex md:flex-col items-start justify-between w-full">
              <article className="text-xs sm:text-sm md:text-base w-full md:w-[50%]">
                <h3 className="font-bold">{menu.names["en"]}</h3>
                <p className="hidden md:block text-xs text-[#818497]">€ {menu.price}</p>
              </article>
            </div>
            <div className="absolute left-0 bottom-0 md:left-auto md:top-0 md:right-0 p-1 md:p-4 w-full md:w-fit md:h-full flex md:flex-col justify-between items-center">
              <Plus
                onClick={() => inCreament(menu)}
                className="bg-neutral-900 hover:bg-neutral-800 p-2 box-content"
                size={15}
              />
              {/* <p>{selectedmenuItem == menu.id ? quantity : "0"}</p> */}
              <p>{cartItems.find((item: any) => item.id === menu.id)?.quantity ?? "0"}</p>
              <Minus
                onClick={() => deCrement(menu)}
                className="bg-neutral-900 hover:bg-neutral-800 p-2 box-content"
                size={15}
              />
            </div>
          </motion.div>
        </>
      ))}
    </div>
  );
};

export { MenuItem };