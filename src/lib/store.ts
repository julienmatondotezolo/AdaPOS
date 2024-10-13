import { configureStore } from "@reduxjs/toolkit";

import allCustomerReducer from "./features/allCustomerSlice";
import cartReducer from "./features/cartSlice";
import customerReducer from "./features/customerSlice";
import placedOrderSlice from "./features/placedOrderSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    customer: customerReducer,
    ordered: placedOrderSlice,
    allcustomer: allCustomerReducer,
  },
});

export { store };
