// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  openItem: ['avgCost'],
  defaultId: 'avgCost',
  openComponent: 'buttons',
  drawerOpen: false,
  componentDrawerOpen: true
};

// ==============================|| SLICE - MENU ||============================== //

const chartmenu = createSlice({
  name: 'chartmenu',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },

    activeComponent(state, action) {
      state.openComponent = action.payload.openComponent;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload.drawerOpen;
    },

    openComponentDrawer(state, action) {
      state.componentDrawerOpen = action.payload.componentDrawerOpen;
    }
  }
});

export default chartmenu.reducer;

export const { activeItem, activeComponent, openDrawer, openComponentDrawer } = chartmenu.actions;
