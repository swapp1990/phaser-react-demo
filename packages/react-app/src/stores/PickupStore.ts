import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GameState {
  coinsCollected: number;
}
const initialState: GameState = {
  coinsCollected: 0,
};

export const pickupSlice = createSlice({
  name: "pickup",
  initialState,
  reducers: {
    incrementCoinsCollected: (state, action: PayloadAction<{}>) => {
      console.log("incrementCoinsCollected");
      ++state.coinsCollected;
    },
  },
});

export const { incrementCoinsCollected } = pickupSlice.actions;

export default pickupSlice.reducer;
