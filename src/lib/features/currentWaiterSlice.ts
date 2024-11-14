import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Waiter {
  id: string;
  name: string;
}

interface CurrentWaiterState {
  currentWaiter: Waiter | null; // State can be a Waiter object or null
}

const initialState: CurrentWaiterState = {
  currentWaiter: null, // Initial state is null
};

const currentWaiterSlice = createSlice({
  name: "currentWaiter",
  initialState,
  reducers: {
    setCurrentWaiter(state, action: PayloadAction<Waiter>) {
      state.currentWaiter = action.payload; // Set the current waiter
    },
    clearCurrentWaiter(state) {
      state.currentWaiter = null; // Clear the current waiter
    },
  },
});

// Export actions and reducer
export const { setCurrentWaiter, clearCurrentWaiter } = currentWaiterSlice.actions;
export default currentWaiterSlice.reducer;
