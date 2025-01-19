/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ShoppingCart, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { type MouseEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { createOrder, fetchSupplement } from "@/_services";
import { sendPdfFile } from "@/_services/ada/adaPrintService";
import { MenuType, Note, TicketTitle } from "@/_types";
import { useAppDispatch, useAppSelector, useSocket } from "@/hooks";
import {
  addNote,
  addSupplement,
  deleteNote,
  remove,
  removeAll,
  removeAllSupplements,
  resetNotes,
} from "@/lib/features";
import { generateTicket } from "@/lib/Helpers";

import { Dialog } from "../ui";
import { Invoice } from "./Invoice";
import quickNotes from "./QuickNotes.json";

const CartItems = () => {
  const text = useTranslations("Index");
  const queryClient = useQueryClient();
  const table = useAppSelector((state) => state.table);
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const storedNotes = useAppSelector((state) => state.notes.notes);
  const [note, setNote] = useState<string>("");
  // Quick notes
  const [selectedQuickNote, setSelectedQuickNote] = useState<keyof typeof quickNotes | "">("");
  const hasSelectedCategory = selectedQuickNote !== "" && (quickNotes[selectedQuickNote] as string[]);

  const [invoiceShow, setInvoiceShow] = useState(false);
  const allCartItems = useAppSelector((state) => state.cart);
  const allSupplements = useAppSelector((state) => state.supplement);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogMode, setDialogMode] = useState<"note" | "extra" | "clear" | null>(null);
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);
  const currentWaiter = useAppSelector((state) => state.currentWaiter.currentWaiter);

  const isStoredNoteSelected = (content: string, category?: string) =>
    storedNotes.find((storedNote) => storedNote.content === content && storedNote.category === category);

  const { data: supplements } = useQuery("supplement", fetchSupplement, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const EXTRA_CAT_ID = "f865cdff-2d4c-4a6a-9f07-31ccd997385e";

  const { data: categories } = useQuery("categories", {
    select: (data: any) => data.filter((data: any) => data.id === EXTRA_CAT_ID).subCategories[0],
  });

  const sendPdfFileMutation = useMutation(sendPdfFile);

  const createOrderMutation = useMutation(createOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries("order");
    },
  });

  const { socketEmit } = useSocket();
  const zenchefRestaurantId = process.env.NEXT_PUBLIC_ZENCHEF_RESTAURANT_ID;

  // const total = useSelector(selectTotal);

  // const subTotal = total;
  // const tax = (5.25 / 100) * total;

  const handleToggleQuickNote = (content: string, category?: string) => (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const selectedNote = isStoredNoteSelected(content, category);

    if (selectedNote) {
      dispatch(deleteNote(selectedNote.id));
    } else {
      dispatch(addNote({ id: `${storedNotes.length}`, content, category }));
    }
  };

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
    setDialogMode("clear");
    setOpenDialog(true);
  };

  const confirmRemoveAll = () => {
    dispatch(removeAll("remove"));
    dispatch(removeAllSupplements("remove"));
    setOpenDialog(false);
  };

  const cancelRemoveAll = () => {
    setOpenDialog(false);
  };

  const showInvoice = () => {
    if (allCartItems.length === 0) {
      alert("Add items to cart.");
      return;
    }
    setInvoiceShow(true);
  };

  const handlePrint = async () => {
    const barItems: any = {
      bar: [],
      starters: [],
    };
    const otherItems: any = {
      rest: [],
      pizza: [],
      starters: [],
    };
    const pizzeriaItems: any = {
      pizza: [],
      rest: [],
      starters: [],
    };

    const generateAndSendPdf = async (title: TicketTitle, items: any, filename: string) => {
      const notes = storedNotes.reduce((acc, note) => {
        if (
          note.category?.toUpperCase() === title ||
          note.category?.toUpperCase() === "GENERIC" ||
          note.category === undefined
        ) {
          acc.push(note.content);
        }

        return acc;
      }, [] as string[]);

      if (!currentWaiter) {
        console.error("No waiter");
        return;
      }

      const doc = await generateTicket({
        title,
        tableNumber: table[0]?.tableNumber,
        meals: table[0]?.couvert,
        waiter: currentWaiter.name,
        items,
        notes,
      });

      if (!doc) return;

      doc.save(title);

      const blob = doc.output("blob");
      const formData = new FormData();
      const fileData = {
        filename,
        blob,
      };

      formData.append("file", blob, `${filename}.pdf`);

      try {
        socketEmit("send-file", {
          roomId: zenchefRestaurantId,
          userId: currentWaiter.id,
          file: fileData,
        });
      } catch (error) {
        console.error("error emitting socket:", error);
      }
    };

    allCartItems.forEach((item: any) => {
      // BAR
      const drinksCategoryId = "c1cbea71-ece5-4d63-bb12-fe06b03d1140";
      const startersCategoryId = "f9d526cb-f64e-4c65-acdc-585a40929406";
      const digestifsCategoryId = "8b4bbd61-ef54-4c4d-abab-db789eaa0b28";
      const dessertCategoryId = "62bbd6ca-5891-4d29-bb59-d22a2f11ba00";
      const champagneEtVinsCategoryId = "0494ddb6-a92f-40ed-8f13-39d3316c8160";

      // PIZZA
      const pizzaCategoryId = "1e5b59c5-bf44-45a7-8a63-9dc1d7e5202b";
      const pizzaSubCategoryId = "e16a2016-1c00-4e90-99b9-868ffe80d4a2";

      if (item.category === drinksCategoryId) {
        barItems.bar.push(item);
      } else if (
        item.category === dessertCategoryId ||
        item.category === startersCategoryId ||
        item.category === digestifsCategoryId ||
        item.category === champagneEtVinsCategoryId ||
        item.category === startersCategoryId
      ) {
        barItems.starters.push(item);
        pizzeriaItems.starters.push(item);
        otherItems.starters.push(item);
      } else if (item.category === pizzaCategoryId || item?.category?.id === pizzaSubCategoryId) {
        pizzeriaItems.pizza.push(item);
        otherItems.pizza.push(item);
      } else if (
        item.category !== drinksCategoryId &&
        item.category !== startersCategoryId &&
        item.category !== dessertCategoryId &&
        item.category !== pizzaCategoryId
      ) {
        pizzeriaItems.rest.push(item);
        otherItems.rest.push(item);
      }
    });

    if (barItems?.starters?.length > 0 || barItems?.bar?.length > 0) {
      await generateAndSendPdf("BAR", barItems, "BAR");
      barItems.starters = [];
      barItems.bar = [];
    }

    if (pizzeriaItems?.pizza?.length > 0 || barItems?.rest?.length > 0) {
      await generateAndSendPdf("PIZZERIA", pizzeriaItems, "PIZZERIA");
      pizzeriaItems.pizza = [];
      pizzeriaItems.rest = [];
    }

    if (otherItems?.pizza?.length > 0 || otherItems?.rest?.length > 0) {
      await generateAndSendPdf("KEUKEN", otherItems, "KEUKEN");
      otherItems.pizza = [];
      otherItems.rest = [];
    }
  };

  const handleSend = async () => {
    const modifiedItems = allCartItems.map((item: any) => {
      const { id, selectedAside, ...rest } = item;

      return { menuItemId: id, quantity: rest.quantity, sideDishIds: rest.sideDishIds ?? [] };
    });

    const supplementIds = allSupplements.map((supplement: any) => supplement.id);

    if (!currentWaiter) {
      console.error("No waiter");
      return;
    }

    const order = {
      waiter: currentWaiter.name,
      table: table[0]?.tableNumber,
      note: storedNotes.map((note) => note.content),
      meals: table[0]?.couvert,
      orderMenuItems: modifiedItems,
      orderSupplements: supplementIds,
    };

    try {
      await handlePrint();
      await createOrderMutation.mutateAsync({ orderObject: order });
      dispatch(removeAll("remove"));
      dispatch(removeAllSupplements("remove"));
      dispatch(resetNotes());
    } catch (error) {
      if (error instanceof Error) {
        console.error(`An error has occurred: ${error.message}`);
      }
    }
  };

  const handleConfirmNote = () => {
    if (note) {
      dispatch(addNote({ id: `${storedNotes.length}`, content: note }));
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
      setNote("");
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
        {storedNotes && storedNotes.length > 0 && (
          <AnimatePresence>
            <p className="ml-2 text-md font-bold">Notes:</p>
            {storedNotes.map((note, index) => (
              <motion.div
                key={note.content + note.category}
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.2 }}
                exit={{ y: "50%", opacity: 0, scale: 0.5 }}
                className="relative flex justify-between w-full pl-2 py-2 border-2 border-neutral-900 box-border"
              >
                <div className="flex flex-col w-3/4">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium text-red-500">
                      {index + 1}. {note.content} !!!
                    </p>
                  </div>
                  {note.category && (
                    <div className="flex items-center text-xs sm:space-x-1">
                      <p className="font-bold">Category:</p>
                      <p className="font-normal capitalize">{note.category}</p>
                    </div>
                  )}
                </div>
                <div
                  onClick={() => dispatch(deleteNote(note.id))}
                  className="w-12 h-full bg-red-500/20 hover:bg-red-500"
                >
                  <Trash2 className="cursor-pointer h-full mx-auto" width={18} />
                </div>
              </motion.div>
            ))}
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
        <div className="grid grid-cols-2 gap-0">
          <div
            onClick={() => handleDialog("note")}
            className={`text-center p-2 text-sm font-semibold cursor-pointer border-2 border-neutral-900  transition-all ease-out duration-50 ${allCartItems.length > 0 ? " bg-yellow-600" : "bg-neutral-800 cursor-not-allowed"}`}
          >
            <button>Note</button>
          </div>
          {/* <div
            onClick={() => handleDialog("extra")}
            className={`text-center p-2 text-sm font-semibold cursor-pointer border-2 border-neutral-900  transition-all ease-out duration-50 ${allCartItems.length > 0 ? " bg-purple-600" : "bg-neutral-800 cursor-not-allowed"}`}
          >
            <button>Extra</button>
          </div> */}
          <div
            onClick={handleRemoveAll}
            className={`text-center p-2 text-sm font-semibold cursor-pointer border-2 border-neutral-900 ${allCartItems.length > 0 ? "bg-red-500/80 hover:bg-red-500" : "bg-neutral-800 cursor-not-allowed"} transition-all ease-out duration-50 `}
          >
            <button>{text("clear")}</button>
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
          {/* <button
            onClick={showInvoice}
            className={`w-1/4 py-4 text-center border-2 border-neutral-900 ${allCartItems.length > 0 ? "bg-[#3441d4]" : "bg-neutral-500 cursor-not-allowed"}`}
          >
            Print
          </button> */}
          <button
            onClick={handleSend}
            className={`w-full py-4 text-center font-bold border-2 border-neutral-900 ${allCartItems.length > 0 ? " bg-green-600" : "bg-neutral-500 cursor-not-allowed"}`}
          >
            {createOrderMutation.isLoading ? "Loading..;" : text("send")}
          </button>
        </div>
      </div>
      {/* {invoiceShow && <Invoice open={invoiceShow} setIsOpen={setInvoiceShow} />} */}
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
        <div className="space-y-4">
          {dialogMode === "clear" && (
            <div className="p-4 space-y-8">
              <article>
                <h3 className="text-lg font-semibold">{`${text("confirm")} "${text("clear")}"`}</h3>
                <p>{text("clearConfirmation")}</p>
              </article>

              <div className="flex space-x-2">
                <button
                  onClick={cancelRemoveAll}
                  className="px-4 py-2 text-sm font-medium border-2 border-neutral-900 bg-gray-500 hover:bg-gray-600"
                >
                  {text("cancel")}
                </button>
                <button
                  onClick={confirmRemoveAll}
                  className="px-4 py-2 text-sm font-medium border-2 border-neutral-900 bg-red-500 hover:bg-red-600"
                >
                  {text("clear")}
                </button>
              </div>
            </div>
          )}
          {dialogMode === "note" && (
            <>
              <div className="flex flex-col gap-4 mb-2">
                <div className="grid grid-cols-5 gap-2">
                  {Object.keys(quickNotes).map((note: any) => (
                    <button
                      className={`p-3 relative capitalize ${note === selectedQuickNote ? "bg-gray-600" : "bg-gray-500 hover:bg-gray-600"} `}
                      key={note}
                      onClick={() => setSelectedQuickNote(note)}
                    >
                      <p>{note}</p>
                      {note === selectedQuickNote && (
                        <div className="absolute top-0 right-0 p-1 bg-black opacity-40 h-full flex items-end">
                          <ChevronDown className="w-4 h-4 ml-auto" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {hasSelectedCategory &&
                    quickNotes[selectedQuickNote].map((note) => (
                      <button
                        key={note}
                        onClick={handleToggleQuickNote(note, selectedQuickNote)}
                        className={`p-3 capitalize ${isStoredNoteSelected(note, selectedQuickNote) ? "bg-green-600" : "bg-gray-500 hover:bg-gray-600"} truncate text-center`}
                      >
                        <p>{note}</p>
                      </button>
                    ))}
                </div>
              </div>
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
