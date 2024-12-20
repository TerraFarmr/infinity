
import { createSlice } from '@reduxjs/toolkit';

export const gamePropSlice = createSlice({
  name: 'gameProps',
  initialState: {  
    population: 25,
    cellResolution: 10,
    generationsPerSecond: 15,
    dark: true,
    paused: true
   },
  reducers: {
    togglePause: state => {
      state.paused = !state.paused;
    },
    updateProp: (state, action) => {
      state[action.payload.prop] = action.payload.value;
    }
  },
});

export const { togglePause, updateProp } = gamePropSlice.actions;
export default gamePropSlice.reducer;