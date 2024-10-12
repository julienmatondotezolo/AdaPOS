import { ChevronRight } from "lucide-react";
import React from "react";

function BreadCrumbNavigation() {
  const breadCrumbStyle = "text-sm py-1 px-2 bg-gray-800 hover:bg-slate-700 rounded-xl cursor-pointer";

  return (
    <div className="w-full px-4 py-8 flex items-center">
      <p className={breadCrumbStyle}>Tables</p>
      <p>{<ChevronRight className="mx-2" size={15} />}</p>
      <p className={breadCrumbStyle}>Table 1</p>
      <p>{<ChevronRight className="mx-2" size={15} />}</p>
      <p className={breadCrumbStyle}>Menu</p>
    </div>
  );
}

export { BreadCrumbNavigation };
