import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GameState {
  coinsCollected: number;
  aliensKilled: number;
}
const initialState: GameState = {
  coinsCollected: 0,
  aliensKilled: 0,
};

export const pickupSlice = createSlice({
  name: "pickup",
  initialState,
  reducers: {
    incrementCoinsCollected: (state, action: PayloadAction<{}>) => {
      ++state.coinsCollected;
    },
    incrementAliensKilled: (state, action: PayloadAction<{}>) => {
      ++state.aliensKilled;
    },
    resetState: (state, action: PayloadAction<{}>) => {
      state.aliensKilled = 0;
      state.coinsCollected = 0;
    },
  },
});

export const { incrementCoinsCollected, incrementAliensKilled, resetState } =
  pickupSlice.actions;

export default pickupSlice.reducer;
