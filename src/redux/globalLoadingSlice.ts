import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface GlobalLoadingState {
  status: boolean;
}

const initialState: GlobalLoadingState = {
  status: false,
};

const globalLoadingSlice = createSlice({
  name: "globalLoading",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.status = action.payload;
    },
  },
});

export const { setLoading } = globalLoadingSlice.actions;
export default globalLoadingSlice.reducer;
