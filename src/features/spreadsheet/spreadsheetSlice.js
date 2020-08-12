import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "spreadsheet",
  initialState: {
    cells: {},
  },
  reducers: {
    setCell: (state, action) => {
      state.cells[action.payload.id] = action.payload.content;
    },
  },
});

export const { setCell } = counterSlice.actions;

export const createCellSelector = (cellId) => (state) => {
  return state.spreadsheet.cells[cellId];
};

export default counterSlice.reducer;
