import React from "react";
import Spreadsheet from "./features/spreadsheet/Spreadsheet";
import Cell from "./features/spreadsheet/Cell";

function App() {
  return (
    <Spreadsheet
      size={{ x: 10000, y: 10000 }}
      CellBuilder={Cell}
      minCellHeight={40}
      cellWidth={100}
    />
  );
}

export default App;
