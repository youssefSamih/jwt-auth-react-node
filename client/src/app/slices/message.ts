import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  message: "",
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (_, action) => {
      return {
        message: action.payload,
      };
    },
    clearMessage: () => {
      return {
        message: "",
      };
    },
  },
});

const { reducer, actions } = messageSlice;

export const { setMessage, clearMessage } = actions;

export default reducer;
