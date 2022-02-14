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
  },
});

export const { incrementCoinsCollected, incrementAliensKilled } =
  pickupSlice.actions;

export default pickupSlice.reducer;
