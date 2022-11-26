import { AnyAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import AuthService from "../services/auth.service";
import { setMessage } from "./message";

const user: {
  username: string;
  id: string;
  roles?: string[];
  email: string;
} = JSON.parse(localStorage.getItem("user") || "");

export const register = createAsyncThunk<void, any>(
  "auth/register",
  async ({ username, password, email }, thunkApi) => {
    try {
      const response = await AuthService.register(username, email, password);

      thunkApi.dispatch(setMessage(response.data.message));

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error?.message || error?.toString();

      thunkApi.dispatch(setMessage(message));

      return thunkApi.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk<any, any>(
  "auth/login",
  async ({ username, password }, thunkApi) => {
    try {
      const response = await AuthService.login(username, password);

      return { user: response };
    } catch (error: any) {
      const message =
        error.response?.data?.message || error?.message || error?.toString();

      thunkApi.dispatch(setMessage(message));

      return thunkApi.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk<any, any>(
  "auth/logout",
  async (thunkApi) => {
    try {
      const response = await AuthService.logout;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error?.message || error?.toString();

      thunkApi.dispatch(setMessage(message));

      return thunkApi.rejectWithValue(message);
    }
  }
);

export const initialState = { isLoggedIn: !!user, user };

const authSlice = createSlice<any, any, any>({
  name: "auth",
  initialState,
  reducers: {
    [register.fulfilled as unknown as string]: (state: {
      isLoggedIn: boolean;
    }) => {
      state.isLoggedIn = false;
    },
    [register.rejected as unknown as string]: (state: {
      isLoggedIn: boolean;
    }) => {
      state.isLoggedIn = false;
    },
    [login.fulfilled as unknown as string]: (
      state: { isLoggedIn: boolean; user: any },
      action: { payload: { user: any } }
    ) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    [login.rejected as unknown as string]: (state: {
      isLoggedIn: boolean;
      user: null;
    }) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    [logout.fulfilled as unknown as string]: (state: {
      isLoggedIn: boolean;
      user: null;
    }) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

const { reducer } = authSlice;

export default reducer;
