import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Web3State {
  connected;
  contracts;
  transactor;
  address;
}
const initialState: Web3State = {
  connected: false,
  contracts: null,
  transactor: null,
  address: null
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
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setTransactor: (state, action) => {
      state.transactor = action.payload;
    },
  },
});

export const { setContracts, setTransactor, setConnected, setAddress } = web3Slice.actions;

export default web3Slice.reducer;
