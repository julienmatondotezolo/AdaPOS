import { configureStore } from "@reduxjs/toolkit";

import allCustomerReducer from "./features/allCustomerSlice";
import cartReducer from "./features/cartSlice";
import notesReducer from "./features/noteSlice";
import placedOrderSlice from "./features/placedOrderSlice";
import supplementSlice from "./features/supplementSlice";
import tableReducer from "./features/tableSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    table: tableReducer,
    ordered: placedOrderSlice,
    allcustomer: allCustomerReducer,
    notes: notesReducer,
    supplement: supplementSlice,
  },
});

export { store };
