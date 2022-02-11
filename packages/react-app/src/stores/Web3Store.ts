import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Web3State {
  contracts;
}
const initialState: Web3State = {
  contracts: null,
};

export const web3Slice = createSlice({
  name: "web3",
  initialState,
  reducers: {
    setContracts: (state, action) => {
      state.contracts = action.payload;
    },
  },
});

export const { setContracts } = web3Slice.actions;

export default web3Slice.reducer;
