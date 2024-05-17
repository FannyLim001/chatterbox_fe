// authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
	isAuthenticated: boolean;
	username: string;
}

const storedUsername = localStorage.getItem("username") || "";
const initialState: AuthState = {
	isAuthenticated: !!storedUsername,
	username: storedUsername,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login(state, action: PayloadAction<{ username: string }>) {
			state.isAuthenticated = true;
			state.username = action.payload.username;
			localStorage.setItem("username", action.payload.username); // Save username to local storage
		},
		logout(state) {
			state.isAuthenticated = false;
			state.username = "";
			localStorage.removeItem("username"); // Remove username from local storage
		},
	},
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
