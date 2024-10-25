import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Note, NotesState } from "@/_types";

const initialState: NotesState = {
  note: null, // Initialize with no note
};

const notesSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      state.note = action.payload; // Add a new note
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      if (state.note && state.note.id === action.payload.id) {
        state.note = action.payload; // Update the note if it exists
      }
    },
    deleteNote: (state) => {
      state.note = null; // Delete the note by setting it to null
    },
  },
});

export const { addNote, updateNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;
