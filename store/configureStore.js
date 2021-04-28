import { createWrapper } from "next-redux-wrapper";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import todoSlice from "./reducers/todo";

const makeStore = (context) =>
  configureStore({
    reducer: {
      [todoSlice.name]: todoSlice.reducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: getDefaultMiddleware(),
  });

export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV !== "production",
});
