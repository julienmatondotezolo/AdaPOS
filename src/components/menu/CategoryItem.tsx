/* eslint-disable no-unused-vars */
import React from "react";

interface CategoryItemProps {
  categories: any;
  categoryId: string | undefined;
  onClick: (category: any) => void;
}

const CategoryItem = ({ categories, categoryId, onClick }: CategoryItemProps) => (
  <div className="absolute top-0 left-0 w-full bg-[#121212] border-b-2 border-neutral-900 overflow-y-scroll">
    <section className="flex w-fit">
      {categories.map((category: any, index: any) => (
        <button
          key={index}
          onClick={() => onClick(category)}
          className={`md:text-xl font-semibold px-8 py-2 md:py-[calc(1rem-1px)] ${category.id == categoryId && "border-green-600 border-b-4 box-content"}`}
        >
          <p className="w-max">{category.names["en"]}</p>
        </button>
      ))}
    </section>
  </div>
);

export { CategoryItem };
