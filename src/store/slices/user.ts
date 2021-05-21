import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../config";
import { User } from "../../entities/user";

// Define a type for the slice state
interface UserState {
  activeUser: User | null;
}

// Define the initial state using that type
const initialState: UserState = {
  activeUser: null,
};

export const counterSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.activeUser = action.payload;
    },
  },
});

export const userActions = {
  user: {
    ...counterSlice.actions,
  },
};

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.activeUser;

export const userReducer = {
  user: counterSlice.reducer,
};
