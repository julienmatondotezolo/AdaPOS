import React from "react";
import { useDispatch } from "react-redux";

const tableData = [
  {
    id: 0,
    title: "Table 1",
    status: "Vacant",
  },
  {
    id: 1,
    title: "Table 2",
    status: "Vacant",
  },
  {
    id: 2,
    title: "Table 3",
    status: "Vacant",
  },
];

const TableBoard = ({ onClick }) => {
  const dispatch = useDispatch();

  return (
    <div>
      <p>Table board</p>
      {tableData.map((table, i) => (
        <div key={i}>{table.name}</div>
      ))}
    </div>
  );
};

export { TableBoard };
