import Image from "next/image";
import React from "react";

import { MenuType } from "@/_types/adaType";

import logo from "../../assets/images/osteria-logo-black.png";

interface InvoiceTicketProps {
  contentRef: any;
  allCartItems: any;
  date: any;
  total: any;
}

function InvoiceTicket({ contentRef, allCartItems, date, total }: InvoiceTicketProps) {
  return (
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
  );
}

export { InvoiceTicket };
