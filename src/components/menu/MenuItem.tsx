/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { add, remove, update } from "@/lib/features";

import { Dialog } from "../ui";

interface MenuItemProps {
  items: any;
  selectedMenuItem: string | undefined;
  quantity: number;
  setQuantity: any;
  setMenuItemId: any;
}

const MenuItem = ({ items, selectedMenuItem, quantity, setQuantity, setMenuItemId }: MenuItemProps) => {
  const text = useTranslations("Index");
  const locale = useLocale();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  const handleConfirmSelection = (data: any) => {
    if (selectedDish) {
      const { id, names, price, sideDishes } = data;

      const selectedDishData = sideDishes?.find((dish: any) => dish.names[locale] === selectedDish);
      const existingItem = cartItems.find((item: any) => item.id === id);
      const itemWithAside: any = {
        id,
        names,
        price: price * 1,
        quantity: existingItem ? existingItem.quantity : 1,
        sideDishIds: selectedDishData ? [selectedDishData.id] : [],
        selectedAside: selectedDishData && selectedDishData.names[locale],
      };

      dispatch(add(itemWithAside));
      setOpenDialog(false); // Close dialog after selection
    }
  };

  const inCreament = (data: any) => {
    const { id, names, price, sideDishes, category } = data;
    const newData = { id, names, price: price * 1, quantity: 1, category };

    const existingItem = cartItems.find((item: any) => item.id === id);

    setMenuItemId(id);
    setSelectedMenu(data);

    if (sideDishes && sideDishes.length > 0) {
      setOpenDialog(true); // Open dialog to select side dishes
      return;
    }

    if (existingItem) {
      setQuantity((prevQuantity: any) => prevQuantity + 1);
      const updates = {
        names,
        price: price * 1,
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

  if (!items) return <div className="m-auto p-8 text-xl text-center w-full">Menu is loading...</div>;

  return (
    <>
      <div className="grid grid-cols-4 lg:grid-cols-6 gap-2 p-3">
        {items
          ?.sort((a: any, b: any) => a.order - b.order)
          .map((menu: any) => (
            <>
              <motion.div
                key={menu.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`relative flex justify-between p-3 h-[80px] md:h-[120px] cursor-pointer ${selectedMenuItem == menu.id && quantity > 0 ? "bg-green-600 hover:bg-green-500" : "bg-neutral-800 hover:bg-neutral-700"} transition-all ease-out duration-100`}
              >
                <div className="flex md:flex-col items-start justify-between w-full">
                  <article className="text-sm w-full break-words">
                    <h3 className="font-bold">{menu.names[locale]}</h3>
                    {/* <p className="hidden md:block text-xs text-[#818497]">€ {menu.price}</p> */}
                  </article>
                </div>
                <div className="flex absolute left-0 bottom-0 p-1 w-full justify-between items-center">
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
      <Dialog open={openDialog} setIsOpen={setOpenDialog}>
        <div>
          <h3>{text("selectSideDish")}</h3>
          <section className="p-4">
            <div>
              <input
                type="radio"
                id="sideDish"
                name={text("noSideDish")}
                value={text("noSideDish")}
                className="mr-4"
                checked={selectedDish === text("noSideDish")}
                onChange={(e) => setSelectedDish(e.target.value)}
              />
              <label htmlFor={text("noSideDish")}>{text("noSideDish")}</label>
            </div>
            {selectedMenu?.sideDishes.map((dish: any) => (
              <div key={dish.id}>
                <input
                  key={dish.id}
                  type="radio"
                  id={dish.id}
                  name={dish.names[locale]}
                  value={dish.names[locale]}
                  className="mr-4"
                  checked={selectedDish === dish.names[locale]}
                  onChange={(e) => setSelectedDish(e.target.value)}
                />
                <label htmlFor={dish.names[locale]}>{dish.names[locale]}</label>
              </div>
            ))}
          </section>
          <button
            className="w-3/4 py-4 text-center font-bold border-2 border-neutral-900 bg-green-600"
            onClick={() => handleConfirmSelection(selectedMenu)}
          >
            {text("confirm")}
          </button>
        </div>
      </Dialog>
    </>
  );
};

export { MenuItem };
