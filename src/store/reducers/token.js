import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
   tokenItem: 'NPC',
};

const newSlice = createSlice({
  name: 'token', // Give your slice a unique name
  initialState,
  reducers: {
   
    selectToken(state, action) {
      state.tokenItem = action.payload.tokenItem;
    }
  }
});

export default newSlice.reducer;

export const { selectToken } = newSlice.actions;