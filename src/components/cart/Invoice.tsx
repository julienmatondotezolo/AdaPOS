/* eslint-disable no-unused-vars */
import { X } from "lucide-react";
import React, { FC, useEffect, useRef } from "react";

type DialogProps = {
  open: boolean;
  setIsOpen: (value: boolean) => void;
};

const Invoice: FC<DialogProps> = ({ open, setIsOpen }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    // setIsOpen(false);
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

  return (
    <div
      ref={modalRef}
      className={`${
        open ? "block" : "hidden"
      } fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 sm:w-11/12 md:w-4/12 bg-white border-2 p-6 space-y-8 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg dark:bg-slate-900 dark:bg-opacity-70 dark:shadow-slate-900 dark:border-slate-800`}
    >
      <article className="flex flex-wrap justify-between w-full">
        <p className="font-bold text-xl">Invoice</p>
        <X className="cursor-pointer" onClick={handleClose} />
      </article>
      <div className="w-full mt-4">
        <>Invoice</>
      </div>
    </div>
  );
};

export { Invoice };
