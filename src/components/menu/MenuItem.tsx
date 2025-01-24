/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useState } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { add, remove, update } from "@/lib/features";
import { isMainCourse } from "@/lib/Utils";

import { Dialog } from "../ui";
import cookings from "./cooking.json";
import mainCourseArray from "./mainCourse.json";
import sauces from "./sauce.json";
import sideDishes from "./sidedish.json";
import supplements from "./supplement.json";

interface MenuItemProps {
  items: any;
  selectedMenuItem: string | undefined;
  quantity: number;
  setQuantity: any;
  setMenuItemId: any;
  categoryId: string | undefined;
}

const MenuItem = ({ items, selectedMenuItem, quantity, setQuantity, setMenuItemId, categoryId }: MenuItemProps) => {
  const text = useTranslations("Index");
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart);
  const [isMeat, setIsMeat] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedCooking, setSelectedCooking] = useState<string | null>(null);
  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  const [selectedSauce, setSelectedSauce] = useState<string | null>(null);
  const [selectedSupplement, setSelectedSupplement] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  const idsThatAreNotMeat = [
    "034a1c74-23a9-4e03-90c3-648037496a97",
    "f6160883-f758-40a5-b271-6c85f88abd24",
    "7fb560b7-ded5-4693-9d27-3c688d7064cc",
  ];

  const handleConfirmSelection = (e: any, data: any) => {
    e.preventDefault();
    if (!selectedDish) {
      alert(text("selectSideDish"));
      return;
    }

    if (!selectedSauce) {
      alert(text("selectSauce"));
      return;
    }

    if (!selectedSupplement) {
      alert(text("selectSupplement"));
      return;
    }

    if (!selectedCooking && isMeat) {
      alert(text("selectCooking"));
      return;
    }

    if (selectedDish) {
      const { id, names, price, cookings, sideDishes, sauces, supplements } = data;

      const selectedCookingData = cookings?.find((cooking: any) => cooking.names[locale] === selectedCooking);
      const selectedDishData = sideDishes?.find((dish: any) => dish.names[locale] === selectedDish);
      const selectedSauceData = sauces?.find((sauce: any) => sauce.names[locale] === selectedSauce);
      const selectedSupplementData = supplements?.find(
        (supplement: any) => supplement.names[locale] === selectedSupplement,
      );

      const existingItem = cartItems.find((item: any) => item.id === id);
      const itemWithAside: any = {
        id,
        names,
        price: price * 1,
        quantity: existingItem ? existingItem.quantity : 1,
        sideDishIds: selectedDishData ? [selectedDishData.id] : [],
        selectedAside: selectedDishData && selectedDishData.names[locale],
        selectedSauce: selectedSauceData && selectedSauceData.names[locale],
        selectedSupplement: selectedSupplementData && selectedSupplementData.names[locale],
        selectedCooking: selectedCookingData && selectedCookingData.names[locale],
      };

      dispatch(add(itemWithAside));
      setSelectedDish(null);
      setSelectedSauce(null);
      setSelectedSupplement(null);
      setOpenDialog(false); // Close dialog after selection
    }
  };

  const inCreament = (data: any) => {
    setIsMeat(false);
    setSelectedCooking(null);
    setSelectedDish(null);
    setSelectedSauce(null);
    setSelectedSupplement(null);

    if (!categoryId) return;

    const { id, names, price } = data;
    const newData = {
      id,
      names,
      price: price * 1,
      quantity: 1,
      category: categoryId,
      cookings,
      sauces,
      sideDishes,
      supplements,
    };

    const existingItem = cartItems.find((item: any) => item.id === id);

    setMenuItemId(id);
    setSelectedMenu(newData);

    const checkIfMainCourse = isMainCourse({
      allMainCoursesCategoryIds: mainCourseArray,
      categoryId: categoryId,
    });

    const checkIfSubMainCourse = isMainCourse({
      allMainCoursesCategoryIds: mainCourseArray,
      categoryId: id,
    });

    if (checkIfMainCourse || checkIfSubMainCourse) {
      setOpenDialog(true); // Open dialog to select side dishes

      const meatId = "c8bfce10-a693-4300-b19e-c3db39ed8f67";

      const isNotmeat = !idsThatAreNotMeat.includes(id);

      if (categoryId === meatId && isNotmeat) {
        setIsMeat(true);
      }
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
                  <Minus
                    onClick={() => deCrement(menu)}
                    className="bg-neutral-900 hover:bg-neutral-800 p-2 box-content"
                    size={15}
                  />
                  {/* <p>{selectedmenuItem == menu.id ? quantity : "0"}</p> */}
                  <p>{cartItems.find((item: any) => item.id === menu.id)?.quantity ?? "0"}</p>
                  <Plus
                    onClick={() => inCreament(menu)}
                    className="bg-neutral-900 hover:bg-neutral-800 p-2 box-content"
                    size={15}
                  />
                </div>
              </motion.div>
            </>
          ))}
      </div>
      <Dialog open={openDialog} setIsOpen={setOpenDialog}>
        <form onSubmit={(e) => handleConfirmSelection(e, selectedMenu)}>
          <div className="flex justify-between w-full mb-8">
            <div className="w-[48%] border border-gray-800 p-4">
              <h3 className="font-bold">{text("selectSideDish")}</h3>
              <section className="flex flex-wrap gap-2 p-4">
                <div
                  className={`p-3 w-48 bg-gray-500 cursor-pointer relative flex items-center
                    ${selectedDish === text("noSideDish") ? "bg-green-600" : ""}`}
                  onClick={() => setSelectedDish(text("noSideDish"))}
                >
                  <label htmlFor={text("noSideDish")}>{text("noSideDish")}</label>
                </div>
                {selectedMenu?.sideDishes.map((dish: any) => (
                  <div
                    key={dish.id}
                    className={`p-3 w-48 bg-gray-500 cursor-pointer relative flex items-center
                    ${selectedDish === dish.names[locale] ? "bg-green-600" : ""}`}
                    onClick={() => setSelectedDish(dish.names[locale])}
                  >
                    <label htmlFor={dish.names[locale]}>{dish.names[locale]}</label>
                  </div>
                ))}
              </section>
            </div>
            <div className="w-[48%] border border-gray-800 p-4">
              <h3 className="font-bold">{text("selectSauce")}</h3>
              <section className="flex flex-wrap gap-2 p-4">
                <div
                  className={`p-3 w-48 bg-gray-500 cursor-pointer relative flex items-center 
                  ${selectedSauce === text("noSauce") ? "bg-green-600" : ""}`}
                  onClick={() => setSelectedSauce(text("noSauce"))}
                >
                  <label htmlFor={text("noSauce")}>{text("noSauce")}</label>
                </div>
                {selectedMenu?.sauces.map((sauce: any) => (
                  <div
                    key={sauce.id}
                    className={`p-3 w-48 bg-gray-500 cursor-pointer relative flex items-center
                    ${selectedSauce === sauce.names[locale] ? "bg-green-600" : ""}`}
                    onClick={() => setSelectedSauce(sauce.names[locale])}
                  >
                    <label htmlFor={sauce.names[locale]}>{sauce.names[locale]}</label>
                  </div>
                ))}
              </section>
            </div>
            {isMeat && (
              <div className="w-[20%] border border-gray-800 p-4">
                <h3 className="font-bold">{text("selectCooking")}</h3>
                <section className="flex flex-wrap gap-2 p-4">
                  {selectedMenu?.cookings.map((cooking: any) => (
                    <div
                      key={cooking.id}
                      className={`p-3 w-48 bg-gray-500 cursor-pointer relative flex items-center
                    ${selectedCooking === cooking.names[locale] ? "bg-green-600" : ""}`}
                      onClick={() => setSelectedCooking(cooking.names[locale])}
                    >
                      <label htmlFor={cooking.names[locale]}>{cooking.names[locale]}</label>
                    </div>
                  ))}
                </section>
              </div>
            )}
            <div className="w-[48%] border border-gray-800 p-4">
              <h3 className="font-bold">{text("selectSupplement")}</h3>
              <section className="flex flex-wrap gap-2 p-4">
                <div
                  className={`p-3 w-48 bg-gray-500 cursor-pointer relative flex items-center 
                  ${selectedSupplement === text("noSupplement") ? "bg-green-600" : ""}`}
                  onClick={() => setSelectedSupplement(text("noSupplement"))}
                >
                  <label htmlFor={text("noSupplement")}>{text("noSupplement")}</label>
                </div>
                {selectedMenu?.supplements.map((supplement: any) => (
                  <div
                    key={supplement.id}
                    className={`p-3 w-48 bg-gray-500 cursor-pointer relative flex items-center
                    ${selectedSupplement === supplement.names[locale] ? "bg-green-600" : ""}`}
                    onClick={() => setSelectedSupplement(supplement.names[locale])}
                  >
                    <label htmlFor={supplement.names[locale]}>{supplement.names[locale]}</label>
                  </div>
                ))}
              </section>
            </div>
          </div>
          <button className="w-full py-4 text-center font-bold border-2 border-neutral-900 bg-green-600" type="submit">
            {text("confirm")}
          </button>
        </form>
      </Dialog>
    </>
  );
};

export { MenuItem };
