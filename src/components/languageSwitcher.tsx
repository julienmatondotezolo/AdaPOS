/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// eslint-disable-next-line jsx-a11y/click-events-have-key-events
// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions

import { useLocale } from "next-intl";
import React from "react";

import { usePathname, useRouter } from "@/navigation";

function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const menuStyle = `flex text-xs py-2 px-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 dark:text-white cursor-pointer group rounded-xl`;

  const changeLanguage = (language: any) => {
    router.push(pathname, { locale: language });
  };

  return (
    <div className="flex flex-row w-full">
      <figure
        className={`${menuStyle} ${locale == "en" ? "dark:bg-neutral-800" : ""}`}
        onClick={() => changeLanguage("en")}
      >
        <p className={`group-hover:underline ${locale == "en" ? "font-bold" : "font-light"}`}>ENG</p>
      </figure>
      <figure
        className={`${menuStyle} ${locale == "fr" ? "dark:bg-neutral-800" : ""}`}
        onClick={() => changeLanguage("fr")}
      >
        <p className={`group-hover:underline ${locale == "fr" ? "font-bold" : "font-light"}`}>FR</p>
      </figure>
      <figure
        className={`${menuStyle} ${locale == "nl" ? "dark:bg-neutral-800" : ""}`}
        onClick={() => changeLanguage("nl")}
      >
        <p className={`group-hover:underline ${locale == "nl" ? "font-bold" : "font-light"}`}>NL</p>
      </figure>
      <figure
        className={`${menuStyle} ${locale == "it" ? "dark:bg-neutral-800" : ""}`}
        onClick={() => changeLanguage("it")}
      >
        <p className={`group-hover:underline ${locale == "it" ? "font-bold" : "font-light"}`}>IT</p>
      </figure>
    </div>
  );
}

export { LanguageSwitcher };
