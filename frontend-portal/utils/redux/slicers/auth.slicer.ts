import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../hooks";

interface IInitialState {
    refreshToken: null | string,
    accessToken: null | string,
}

const initialState: IInitialState = {
    refreshToken: null,
    accessToken: null,
}

const authSlice = createAppSlice({
    name: "auth",
    initialState,
    reducers: (create) => ({
        login: create.reducer((state, action: PayloadAction<{refreshToken: string, accessToken: string}>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        }),
        logout: create.reducer((state) => {
            state.accessToken = null;
            state.refreshToken = null;
        }),
    }),
    selectors: {
        selectAccessToken: (state) => state.accessToken,
        selectRefreshToken: (state) => state.refreshToken,
    }
});

export const { login, logout } = authSlice.actions;
export const { selectAccessToken, selectRefreshToken } = authSlice.selectors;
export default authSlice;