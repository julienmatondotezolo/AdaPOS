/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add(state, action) {
      state.push(action.payload);
    },

    remove(state, action) {
      return state.filter((item: { id: any }) => item.id != action.payload);
    },
    removeAll(state, action) {
      return (state = []);
    },
  },
});

export const { add, remove, removeAll } = cartSlice.actions;
export const selectTotal = (state: any) =>
  state.cart.reduce((total: any, item: { price: any }) => total + item.price, 0);
export default cartSlice.reducer;
