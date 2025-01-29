/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = [];

const reopenedCartSlice = createSlice({
  name: "reopenedCart",
  initialState,
  reducers: {
    addReopened(state, action) {
      state.push(action.payload);
    },
    updateReopened(state, action) {
      const index = state.findIndex((item: { id: any }) => item.id === action.payload.id);

      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload.updates };
      } else {
        state.push(action.payload);
      }
    },
    removeReopened(state, action) {
      return state.filter((item: { id: any }) => item.id != action.payload);
    },
    removeAllReopened(state, action) {
      return (state = []);
    },
  },
});

export const { addReopened, updateReopened, removeReopened, removeAllReopened } = reopenedCartSlice.actions;
export const selectTotalReopened = (state: any) =>
  state.cart.reduce((total: any, item: any) => total + item.price * item.quantity, 0);
export default reopenedCartSlice.reducer;
