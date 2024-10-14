import { configureStore } from "@reduxjs/toolkit";

import allCustomerReducer from "./features/allCustomerSlice";
import cartReducer from "./features/cartSlice";
import placedOrderSlice from "./features/placedOrderSlice";
import tableReducer from "./features/tableSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    table: tableReducer,
    ordered: placedOrderSlice,
    allcustomer: allCustomerReducer,
  },
});

export { store };
