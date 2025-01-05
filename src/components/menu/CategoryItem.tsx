/* eslint-disable no-unused-vars */
import { useLocale } from "next-intl";
import React from "react";

interface CategoryItemProps {
  categories: any;
  categoryId: string | undefined;
  onClick: (category: any) => void;
}

const CategoryItem = ({ categories, categoryId, onClick }: CategoryItemProps) => {
  const locale = useLocale();

  const NO_CAT_ID = "f07f0619-08ab-4e96-bc17-3f2cbd65989b";
  const EXTRA_CAT_ID = "f865cdff-2d4c-4a6a-9f07-31ccd997385e";

  return (
    <div className="absolute top-0 left-0 w-full dark:bg-[#121212] border-b-2 dark:border-neutral-900 overflow-y-scroll">
      <section className="flex w-fit text-neutral-500 dark:text-neutral-200">
        {categories
          .filter((category: any) => category.id !== NO_CAT_ID && category.id !== EXTRA_CAT_ID)
          .map((category: any, index: any) => (
            <button
              key={index}
              onClick={() => onClick(category)}
              className={`text-sm px-6 py-2 md:py-[calc(1rem-1px)] ${category.id == categoryId && "text-green-600 font-semibold border-green-600 border-b-4 box-content"}`}
            >
              <p className="w-max">{category.names[locale]}</p>
            </button>
          ))}
      </section>
    </div>
  );
};

export { CategoryItem };
