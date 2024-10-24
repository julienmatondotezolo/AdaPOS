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
    update(state, action) {
      const index = state.findIndex((item: { id: any }) => item.id === action.payload.id);

      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload.updates };
      } else {
        state.push(action.payload);
      }
    },
    remove(state, action) {
      return state.filter((item: { id: any }) => item.id != action.payload);
    },
    removeAll(state, action) {
      return (state = []);
    },
  },
});

export const { add, update, remove, removeAll } = cartSlice.actions;
export const selectTotal = (state: any) =>
  state.cart.reduce((total: any, item: any) => total + item.price * item.quantity, 0);
export default cartSlice.reducer;
