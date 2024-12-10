import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Note, NotesState } from "@/_types";

const initialState: NotesState = {
  notes: [], // Initialize with empty notes
};

const notesSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload); // Add a new note
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const note = state.notes.find((note) => note.id === action.payload.id);

      if (note) {
        note.content = action.payload.content; // Update the note if it exists
        note.category = action.payload.category; // Update the note if it exists
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      const noteIndex = state.notes.findIndex((note) => note.id === action.payload);

      if (noteIndex !== -1) {
        state.notes.splice(noteIndex, 1); // Delete the note if it exists
      }
    },

    resetNotes: () => initialState,
  },
});

export const { addNote, updateNote, deleteNote, resetNotes } = notesSlice.actions;
export default notesSlice.reducer;
