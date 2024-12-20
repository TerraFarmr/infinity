// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import gamePropReducer from "./gamePropSlice";

export default configureStore({
  reducer: {
    gameProps: gamePropReducer,
  },
});