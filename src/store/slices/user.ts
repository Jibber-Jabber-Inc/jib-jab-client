import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../config";

// Define a type for the slice state
interface SessionState {
  redirectPath: string;
}

// Define the initial state using that type
const initialState: SessionState = {
  redirectPath: "",
};

export const counterSlice = createSlice({
  name: "session",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRedirectPath: (state, action: PayloadAction<string>) => {
      state.redirectPath = action.payload;
    },
  },
});

export const sessionActions = {
  session: counterSlice.actions,
};

// Other code such as selectors can use the imported `RootState` type
export const selectRedirectPath = (state: RootState) =>
  state.session.redirectPath;
export const selectSession = (state: RootState) => state.session;

export const sessionReducer = {
  session: counterSlice.reducer,
};
