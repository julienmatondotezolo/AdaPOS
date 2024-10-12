import { createSlice } from "@reduxjs/toolkit";

const initialState: any = [];

const placedOrderSlice = createSlice({
  name: "placedItem",
  initialState,
  reducers: {
    addOrder(state: any[], action: { payload: any }) {
      state.push(action.payload);
    },

    removeOrder(state, action) {
      return state.filter((item: any) => item.id != action.payload);
    },
  },
});

export const { addOrder, removeOrder } = placedOrderSlice.actions;
// export const selectTotal = (state) => state.cart.reduce((total , item) => total + item.price , 0);
export default placedOrderSlice.reducer;
