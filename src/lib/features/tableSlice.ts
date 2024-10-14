/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

import { TableType } from "@/_types";

const initialState: TableType[] = [];

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    addTable(state, action) {
      state.push(action.payload);
    },

    removeTable(state, action) {
      return (state = []);
    },
  },
});

export const { addTable, removeTable } = tableSlice.actions;
export default tableSlice.reducer;
