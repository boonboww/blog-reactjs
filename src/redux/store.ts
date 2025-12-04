import { configureStore } from "@reduxjs/toolkit";
import globalLoadingReducer from "./globalLoadingSlice";

export const store = configureStore({
  reducer: {
    globalLoading: globalLoadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
