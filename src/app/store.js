import { configureStore } from "@reduxjs/toolkit";
import spreadsheetSlice from "../features/spreadsheet/spreadsheetSlice";

export default configureStore({
  reducer: {
    spreadsheet: spreadsheetSlice,
  },
});
