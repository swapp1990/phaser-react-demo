import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Web3State {
  connected;
  contracts;
  transactor;
}
const initialState: Web3State = {
  connected: false,
  contracts: null,
  transactor: null,
};

export const web3Slice = createSlice({
  name: "web3",
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setContracts: (state, action) => {
      state.contracts = action.payload;
    },
    setTransactor: (state, action) => {
      state.transactor = action.payload;
    },
  },
});

export const { setContracts, setTransactor, setConnected } = web3Slice.actions;

export default web3Slice.reducer;
