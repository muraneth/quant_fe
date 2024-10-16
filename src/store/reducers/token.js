import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  tokenItem: {
    chain: "eth",
    contract_address: "0x8ed97a637a790be1feff5e888d43629dc05408f6",
    icon_url: "",
    symbol: "NPC"
    }
};

const tokenSlice = createSlice({
  name: 'token', // Give your slice a unique name
  initialState,
  reducers: {
    selectToken(state, action) {
      state.tokenItem = action.payload.tokenItem;
    }
  }
});

export default tokenSlice.reducer;

export const { selectToken } = tokenSlice.actions;
