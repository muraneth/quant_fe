import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  tokenItem: 'ANDY'
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
