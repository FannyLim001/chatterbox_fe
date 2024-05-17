// authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  username: string;
  userid: string;
}

const storedUsername = localStorage.getItem("username") || "";
const storedUserid = localStorage.getItem("userid") || "";
const initialState: AuthState = {
  isAuthenticated: !!storedUsername,
  username: storedUsername,
  userid: storedUserid,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ username: string; userid: string }>) {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      localStorage.setItem("username", action.payload.username); // Save username to local storage
      localStorage.setItem("userid", action.payload.userid);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.username = "";
      state.userid = "";
      localStorage.removeItem("username"); // Remove username from local storage
      localStorage.removeItem("userid");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
