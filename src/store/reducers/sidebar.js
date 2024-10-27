// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  openItem: ['ANDY'],
  drawerOpen: false
};

// ==============================|| SLICE - MENU ||============================== //

const sidebar = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },
    openDrawer(state, action) {
      state.drawerOpen = action.payload.drawerOpen;
    }
  }
});

export default sidebar.reducer;

export const { activeItem, openDrawer } = sidebar.actions;
