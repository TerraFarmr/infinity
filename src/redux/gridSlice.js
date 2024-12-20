import { createSlice } from '@reduxjs/toolkit';

export const gridSlice = createSlice({
  name: 'grid',
  initialState: {  
    grid: [[]]
   },
  reducers: {
    togglePause: state => {
      state.paused = !state.paused;
    }
  },
});

export const { togglePause } = gridSlice.actions;
export default gridSlice.reducer;