/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import { createOrder, fetchSupplement } from "@/_services";
import { MenuType, Note } from "@/_types";
import { addNote, addSupplement, deleteNote, remove, removeAll, removeAllSupplements } from "@/lib/features";

import { Dialog } from "../ui";
import { Invoice } from "./Invoice";

const CartItems = () => {
  const text = useTranslations("Index");
  const queryClient = useQueryClient();
  const table = useSelector((state: any) => state.table);
  const locale = useLocale();
  const dispatch = useDispatch();
  const storedNote = useSelector((state: any) => state.notes);
  const [invoiceShow, setInvoiceShow] = useState(false);
  const allCartItems = useSelector((state: any) => state.cart);
  const allSupplements = useSelector((state: any) => state.supplement);
  const [note, setNote] = useState<Note | "">(storedNote.note || "");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogMode, setDialogMode] = useState<"note" | "extra" | null>(null);
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);

  const { isLoading, data: supplements } = useQuery("supplement", fetchSupplement, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const createOrderMutation = useMutation(createOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries("order");
    },
  });

  // const total = useSelector(selectTotal);

  // const subTotal = total;
  // const tax = (5.25 / 100) * total;

  const handleRemove = (e: any, id: any) => {
    e.preventDefault();
    dispatch(remove(id));
  };

  const handleRemoveSupplement = (e: any, id: any) => {
    e.preventDefault();
    dispatch(remove(id));
  };

  const handleRemoveAll = (e: any) => {
    e.preventDefault();
    if (allCartItems.length === 0) {
      return;
    }
    dispatch(removeAll("remove"));
    dispatch(removeAllSupplements("remove"));
  };

  const showInvoice = () => {
    if (allCartItems.length === 0) {
      alert("Add items to cart.");
      return;
    }
    setInvoiceShow(true);
  };

  const handleSend = async () => {
    const modifiedItems = allCartItems.map((item: any) => {
      const { id, selectedAside, ...rest } = item;

      return { menuItemId: id, quantity: rest.quantity, sideDishIds: rest.sideDishIds ?? [] };
    });

    const supplementIds = allSupplements.map((supplement: any) => supplement.id);

    const order = {
      waiter: "FIRSTWEEK",
      table: table[0]?.tableNumber,
      note: note,
      orderMenuItems: modifiedItems,
      orderSupplements: supplementIds,
    };

    try {
      await createOrderMutation.mutate({ orderObject: order });
      dispatch(removeAll("remove"));
      dispatch(removeAllSupplements("remove"));
      dispatch(deleteNote());
    } catch (error) {
      if (error instanceof Error) {
        console.error(`An error has occurred: ${error.message}`);
      }
    }

    // console.log("allCartItems", allCartItems);
    // console.log("allCartItems", JSON.stringify(allCartItems));
  };

  const handleConfirmNote = () => {
    if (note) {
      dispatch(addNote(note));
      setOpenDialog(false);
    }
  };

  const handleConfirmSupplements = () => {
    const selectedDishData = supplements?.find((supplement: any) => selectedSupplements.includes(supplement.id));

    dispatch(addSupplement(selectedDishData));
    setOpenDialog(false);
  };

  const handleDialog = (mode: "note" | "extra") => {
    if (allCartItems.length === 0) {
      return;
    }
    setDialogMode(mode);
    setOpenDialog(true);
    if (mode === "note") {
      setNote(storedNote.note || "");
      setSelectedSupplements([]);
    } else if (mode === "extra") {
      setNote("");
      setSelectedSupplements([]);
    }
  };

  return (
    <>
      <motion.div
        transition={{ duration: 0.5 }}
        exit={{ y: "50%", opacity: 0 }}
        className={`flex flex-col ${allCartItems.length > 0 && "h-[50px] sm:h-[100px] md:h-[50vh]"} overflow-y-scroll scrollbar-hide`}
      >
        {storedNote.note && (
          <AnimatePresence>
            <motion.div
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.2 }}
              exit={{ y: "50%", opacity: 0, scale: 0.5 }}
              className="relative flex justify-between w-full pl-2 py-2 border-2 border-neutral-900 box-border"
            >
              <div className="flex items-center sm:space-x-2">
                <p className="ml-2 text-md font-bold">Notes:</p>
                <p className="font-normal text-red-500">{storedNote.note} !!!</p>
              </div>
              <div onClick={() => dispatch(deleteNote())} className="w-12 h-full bg-red-500/20 hover:bg-red-500">
                <Trash2 className="cursor-pointer h-full mx-auto" width={18} />
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        {allCartItems.length > 0 ? (
          <AnimatePresence>
            {allCartItems.map((cart: MenuType, index: number) => (
              <motion.div
                key={index}
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.2 }}
                exit={{ y: "50%", opacity: 0, scale: 0.5 }}
                className="relative flex justify-between w-full pl-2 py-2 border-2 border-neutral-900 box-border"
              >
                <div className="flex w-3/4 flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium">
                      {index + 1}. &nbsp;{cart.names[locale]} &nbsp;{" "}
                    </p>
                  </div>

                  {cart.sideDishIds && (
                    <div className="flex items-cente text-xs sm:space-x-1">
                      <p className="font-bold">{text("aside")}:</p>
                      <p className="font-normal">{cart.selectedAside}</p>
                    </div>
                  )}
                </div>
                <div className="flex w-2/4 justify-between items-end md:items-center overflow-hidden">
                  <p className="lg:inline-flex text-xs mr-4 md:text-xs lg:text-sm">
                    Qty: <strong className="ml-2">{cart.quantity}</strong>
                  </p>
                  <div onClick={(e) => handleRemove(e, cart.id)} className="w-12 h-full bg-red-500/20 hover:bg-red-500">
                    <Trash2 className="cursor-pointer h-full mx-auto" width={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center">
            <ShoppingCart className="text-neutral-600" />
            <small className=" text-neutral-600 mt-2">No items.</small>
          </div>
        )}

        {allSupplements.length > 0 && (
          <AnimatePresence>
            <p className="ml-2 mt-4 mb-2 text-md">Supplement:</p>
            {allSupplements.map((supplement: MenuType, index: number) => (
              <motion.div
                key={index}
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.2 }}
                exit={{ y: "50%", opacity: 0, scale: 0.5 }}
                className="relative flex justify-between w-full pl-2 py-2 border-2 border-neutral-900 box-border"
              >
                <div className="flex w-3/4 flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium">
                      {index + 1}. &nbsp;{supplement.names[locale]} &nbsp;{" "}
                    </p>
                  </div>
                </div>
                <div
                  onClick={(e) => handleRemoveSupplement(e, supplement.id)}
                  className="w-12 h-full bg-red-500/20 hover:bg-red-500"
                >
                  <Trash2 className="cursor-pointer h-full mx-auto" width={18} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-3 gap-0">
          <div
            onClick={() => handleDialog("note")}
            className={`text-center p-2 text-sm font-semibold cursor-pointer border-2 border-neutral-900  transition-all ease-out duration-50 ${allCartItems.length > 0 ? " bg-yellow-600" : "bg-neutral-800 cursor-not-allowed"}`}
          >
            <button>Note</button>
          </div>
          <div
            onClick={() => handleDialog("extra")}
            className={`text-center p-2 text-sm font-semibold cursor-pointer border-2 border-neutral-900  transition-all ease-out duration-50 ${allCartItems.length > 0 ? " bg-purple-600" : "bg-neutral-800 cursor-not-allowed"}`}
          >
            <button>Extra</button>
          </div>
          <div
            onClick={handleRemoveAll}
            className={`text-center p-2 text-sm font-semibold cursor-pointer border-2 border-neutral-900 ${allCartItems.length > 0 ? "bg-red-500/80 hover:bg-red-500" : "bg-neutral-800 cursor-not-allowed"} transition-all ease-out duration-50 `}
          >
            <button>Clear</button>
          </div>
        </div>
        {/* <div className="flex flex-col pl-8 pr-8 py-2 space-y-2">
          {payment && (
            <p className="text-center text-xs font-semibold text-green-500">
              Payment done. <small className="font-normal text-white"> Now you can place order.</small>{" "}
            </p>
          )}
          <div className="flex flex-row items-center justify-between text-xs font-bold text-gray-600 ">
            <p>Tax 5.25%</p>
            <p>€ {tax.toFixed(2)}</p>
          </div>
          <div className="flex flex-row items-center justify-between text-xs font-bold text-gray-600 ">
            <p>Items:</p>
            <p>{allCartItems.length}</p>
          </div>
          <div className="flex flex-row items-center justify-between text-sm font-bold ">
            <p>Total</p>
            <p>€ {subTotal.toFixed(2)}</p>
          </div>
        </div> */}
        <div className="flex w-full justify-between">
          <button
            onClick={showInvoice}
            className={`w-1/4 py-4 text-center border-2 border-neutral-900 ${allCartItems.length > 0 ? "bg-[#3441d4]" : "bg-neutral-500 cursor-not-allowed"}`}
          >
            Print
          </button>
          <button
            onClick={handleSend}
            className={`w-3/4 py-4 text-center font-bold border-2 border-neutral-900 ${allCartItems.length > 0 ? " bg-green-600" : "bg-neutral-500 cursor-not-allowed"}`}
          >
            {createOrderMutation.isLoading ? "Loading..;" : text("send")}
          </button>
        </div>
      </div>
      {invoiceShow && <Invoice open={invoiceShow} setIsOpen={setInvoiceShow} />}
      {/* Note Dialog */}
      {/* <Dialog open={openNoteDialog} setIsOpen={setOpenNoteDialog}>
        <div className="p-4">
          <h3 className="text-xl mb-8">Add a Note:</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border p-2 w-full"
            placeholder="Enter your note here..."
          />
          <button
            className="w-full py-2 mt-4 text-center font-bold border-2 border-neutral-900 bg-green-600"
            onClick={handleConfirmNote}
          >
            Save Note
          </button>
        </div>
      </Dialog> */}

      {/* Dialog */}
      <Dialog open={openDialog} setIsOpen={setOpenDialog}>
        <div>
          {dialogMode === "note" && (
            <>
              <h3>Add a Note:</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="border p-2 w-full"
                placeholder="Enter your note here..."
              />
              <button
                className="w-full py-2 mt-4 text-center font-bold border-2 border-neutral-900 bg-green-600"
                onClick={handleConfirmNote}
              >
                Save Note
              </button>
            </>
          )}
          {dialogMode === "extra" && (
            <>
              <h3>Select Supplements:</h3>
              <div className="flex flex-col">
                {supplements.map((supplement: any) => (
                  <div key={supplement.id}>
                    <input
                      type="checkbox"
                      id={supplement.id}
                      value={supplement.id}
                      className="mr-4"
                      checked={selectedSupplements.includes(supplement.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSupplements((prev) => [...prev, supplement.id]);
                        } else {
                          setSelectedSupplements((prev) => prev.filter((id) => id !== supplement.id));
                        }
                      }}
                    />
                    <label htmlFor={supplement.id}>{supplement.names[locale]}</label>
                  </div>
                ))}
              </div>
              <button
                className="w-full py-2 mt-4 text-center font-bold border-2 border-neutral-900 bg-green-600"
                onClick={handleConfirmSupplements}
              >
                Add Supplements
              </button>
            </>
          )}
        </div>
      </Dialog>
    </>
  );
};

export { CartItems };
