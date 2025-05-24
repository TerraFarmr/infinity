import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { CanvasMode, Rectangle } from '../types/canvas.types';
import type { CanvasState, RootState } from '../types/redux.types';
import { generateId } from '../helpers';

// Initial canvas state
const initialState: CanvasState = {
  rectangles: [],
  mode: 'draw',
  scale: 1,
  position: { x: 0, y: 0 },
  selectedId: null,
  isDarkMode: false,
};

// Create the canvas slice with reducers
export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    // Rectangle operations
    addRectangle: (state, action: PayloadAction<Omit<Rectangle, 'id'>>) => {
      state.rectangles.push({ ...action.payload, id: generateId() });
    },
    updateRectangle: (state, action: PayloadAction<Partial<Rectangle> & { id: string }>) => {
      const index = state.rectangles.findIndex(rect => rect.id === action.payload.id);
      if (index !== -1) {
        state.rectangles[index] = { ...state.rectangles[index], ...action.payload };
      }
    },
    selectRectangle: (state, action: PayloadAction<string | null>) => { state.selectedId = action.payload },

    // Mode operations
    setMode: (state, action: PayloadAction<CanvasMode>) => {
      state.mode = action.payload;
      state.selectedId = null; // Deselect when changing modes
    },
    toggleMode: (state) => { state.mode = state.mode === 'view' ? 'draw' : 'view' },

    // Canvas view operations
    updateCanvas: (state, action: PayloadAction<{ scale?: number; position?: { x: number; y: number } }>) => {
      if (action.payload.scale !== undefined) state.scale = action.payload.scale;
      if (action.payload.position) state.position = action.payload.position;
    },

    toggleDarkMode: (state) => { state.isDarkMode = !state.isDarkMode },
  },
});

// Selectors for accessing state
export const selectRectangles = (state: RootState) => state.canvas.rectangles;
export const selectMode = (state: RootState) => state.canvas.mode;
export const selectScale = (state: RootState) => state.canvas.scale;
export const selectPosition = (state: RootState) => state.canvas.position;
export const selectSelectedId = (state: RootState) => state.canvas.selectedId;
export const selectCanvasState = (state: RootState) => state.canvas;
export const selectIsDarkMode = (state: RootState) => state.canvas.isDarkMode;

// Export actions
export const {
  addRectangle,
  updateRectangle,
  setMode,
  toggleMode,
  updateCanvas,
  selectRectangle,
  toggleDarkMode
} = canvasSlice.actions;

export default canvasSlice.reducer;
