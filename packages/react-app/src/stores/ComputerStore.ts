import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ComputerState {
  computerDialogOpen: boolean;
}
const initialState: ComputerState = {
  computerDialogOpen: false,
};

export const computerSlice = createSlice({
  name: "computer",
  initialState,
  reducers: {
    openComputerDialog: (state, action: PayloadAction<{}>) => {
      state.computerDialogOpen = true;
    },
    closeComputerDialog: (state, action: PayloadAction<{}>) => {
      state.computerDialogOpen = false;
    },
  },
});

export const { openComputerDialog, closeComputerDialog } =
  computerSlice.actions;

export default computerSlice.reducer;
