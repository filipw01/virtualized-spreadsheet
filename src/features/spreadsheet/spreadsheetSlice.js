import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "spreadsheet",
  initialState: {
    cells: {},
    rows: {},
  },
  reducers: {
    setCell: (state, action) => {
      state.cells[action.payload.id] = action.payload.content;
    },
    changeRowHeight: (state, action) => {
      const { row, column, height, minHeight } = action.payload;
      if (state.rows[row] === undefined) {
        state.rows[row] = [];
      }
      const index = state.rows[row].findIndex((cell) => cell.column === column);
      if (height > minHeight) {
        // Height exceeds minimum
        const newHeight = { column, height };
        // Replace if exists else add as new
        if (index !== -1) {
          state.rows[row].splice(index, 1, newHeight);
        } else {
          state.rows[row].push(newHeight);
        }
      } else {
        // Height below minimum
        // Delete if exists
        if (index !== -1) {
          state.rows[row].splice(index, 1);
        }
        // Delete row if empty
        if (state.rows[row].length === 0) {
          delete state.rows[row];
        }
      }
    },
  },
});

export const { setCell, changeRowHeight } = counterSlice.actions;

export const createCellSelector = (cellId) => (state) => {
  return state.spreadsheet.cells[cellId];
};

export default counterSlice.reducer;
