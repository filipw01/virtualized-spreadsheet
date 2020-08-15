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
      if (height > minHeight) {
        if (state.rows[row].find((cell) => cell.column === column)) {
          state.rows[row] = state.rows[row].map((cell) => {
            if (cell.column === column) {
              return { column, height };
            }
            return cell;
          });
        } else {
          state.rows[row].push({ column, height });
        }
      } else {
        state.rows[row] = state.rows[row].filter(
          ({ column: stateColumn }) => stateColumn !== column
        );
        if (state.rows[row] && state.rows[row].length === 0) {
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
