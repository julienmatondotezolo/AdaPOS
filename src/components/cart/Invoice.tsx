/* eslint-disable no-unused-vars */
import { X } from "lucide-react";
import Image from "next/image";
import { FC, useEffect, useRef } from "react";
import { useMutation } from "react-query";

import { sendPdfFile } from "@/_services/ada/adaPrintService";
import { MenuType } from "@/_types";
import { useAppSelector } from "@/hooks";
import { selectTotal } from "@/lib/features";
import { formatDate, invoiceTicket } from "@/lib/Helpers";

import logo from "../../assets/images/osteria-logo-black.png";

type DialogProps = {
  open: boolean;
  setIsOpen: (value: boolean) => void;
};

const Invoice: FC<DialogProps> = ({ open, setIsOpen }) => {
  const sendPdfFileMutation = useMutation(sendPdfFile);

  const allCartItems = useAppSelector((state) => state.cart);
  const total = useAppSelector(selectTotal);

  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<any>();

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!modalRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const date = formatDate(new Date());

  const handlePrint = async () => {
    const content = contentRef.current;

    if (content) {
      const filename = "invoice";

      const doc = await invoiceTicket({ total, allCartItems });

      doc.save();

      const blob = doc.output("blob");

      // Inside the handlePrint function:
      const formData = new FormData();

      formData.append("file", blob, "invoice.pdf");

      sendPdfFileMutation.mutate({ filename, formData });
    }

    handleClose();
  };

  return (
    <div
      ref={modalRef}
      className={`${
        open ? "block" : "hidden"
      } fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-11/12 md:w-8/12 border-2 p-6 space-y-8 shadow-lg bg-white text-black`}
    >
      <article className="flex flex-wrap justify-between w-full">
        <p className="font-bold text-xl">Invoice</p>
        <X className="cursor-pointer" onClick={handleClose} />
      </article>
      <div className="w-full mt-4 bg-neutral-300 p-4">
        <figure className="h-[50vh] overflow-y-scroll scrollbar-thin scrollbar-track-neutral-600">
          <div ref={contentRef} className="w-full bg-white p-8 space-y-6">
            {/* <div ref={contentRef} className="printable-content"> */}
            <section className="flex justify-center w-full m-auto">
              <Image src={logo} width={100} alt="Logo osteria" />
            </section>
            <section className="text-center">
              <h3 className="text-xl">l&apos;Osteria</h3>
              <h3 className="text-sm">Date: {date}</h3>
            </section>
            <section className="text-sm">
              <div className="grid grid-cols-4 gap-0 w-full text-right mb-2">
                <p className="w-[70%]">Quantity</p>
                <p>Description</p>
                <p>Price</p>
                <p>Total</p>
              </div>
              {allCartItems.map((cart: MenuType, index: number) => (
                <div key={index} className="grid grid-cols-4 gap-0 w-full text-right">
                  <p className="w-[70%]">{cart.quantity}</p>
                  <p>{cart.names["fr"]}</p>
                  <p>{cart.price}</p>
                  <p>{cart.price * cart.quantity}</p>
                </div>
              ))}
            </section>
            <section className="flex justify-between py-2 border-black border-dashed border-t border-b">
              <h3 className="text-xl">To pay:</h3>
              <h3 className="text-xl">{total} EUR</h3>
            </section>
            <section className="text-center text-xs uppercase">
              <p>Dit is geen geldig</p>
              <p>btw-kasticket</p>
            </section>
            <section className="text-center text-lg w-1/2 flex flex-col m-auto">
              <p>Dank u en tot weerziens</p>
              <p>Merci et à bientôt</p>
              <p>Grazie e a presto</p>
            </section>
          </div>
        </figure>
        <button
          onClick={handlePrint}
          className="cursor-pointer w-full mt-4 py-4 text-center text-white font-bold bg-[#3441d4]"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export { Invoice };
