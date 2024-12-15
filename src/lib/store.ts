import { configureStore } from "@reduxjs/toolkit";

import allCustomerReducer from "./features/allCustomerSlice";
import cartReducer from "./features/cartSlice";
import currentWaiterReducer from "./features/currentWaiterSlice";
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
    currentWaiter: currentWaiterReducer,
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export { store };
