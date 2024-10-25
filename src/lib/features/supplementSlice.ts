/* eslint-disable no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = [];

const supplementsSlice = createSlice({
  name: "supplements",
  initialState,
  reducers: {
    addSupplement: (state, action: PayloadAction<any>) => {
      state.push(action.payload); // Add a new supplement
    },
    updateSupplement: (state, action: PayloadAction<any>) => {
      const index = state.supplements.findIndex((supplement: any) => supplement.id === action.payload.id);

      if (index !== -1) {
        state.supplements[index] = action.payload; // Update the supplement if it exists
      }
    },
    deleteSupplement: (state, action: PayloadAction<string>) =>
      state.filter((item: { id: any }) => item.id != action.payload), // Delete the specific supplement string
    removeAllSupplements(state, action) {
      return (state = []);
    },
  },
});

export const { addSupplement, updateSupplement, deleteSupplement, removeAllSupplements } = supplementsSlice.actions;
export default supplementsSlice.reducer;
