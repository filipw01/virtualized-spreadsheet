import React, { useRef, useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

function calculateId(column, row) {
  let letter = "";
  let charCode;
  do {
    charCode = row % 25;
    letter = String.fromCharCode(65 + charCode) + letter;
    row = Math.floor(row / 25);
  } while (row > 0);
  return letter + column;
}

export default function Spreadsheet({
  size,
  CellBuilder,
  minCellHeight,
  cellWidth,
}) {
  const root = useRef(null);
  const [activeColumns, setActiveColumns] = useState(0);
  const [activeRows, setActiveRows] = useState(0);
  const [firstColumn, setFirstColumn] = useState(0);
  const [firstRow, setFirstRow] = useState(0);
  const rows = useSelector((state) => state.spreadsheet.rows);

  const getRowHeight = useCallback(
    (row) => {
      if (rows[row]) {
        return Math.max(...rows[row].map((cell) => cell.height));
      }
      return minCellHeight;
    },
    [minCellHeight, rows]
  );

  const getRowOffset = useCallback(
    (rowNumber) => {
      let offset = 0;
      for (let index = 0; index < rowNumber; index++) {
        offset += getRowHeight(index);
      }
      return offset;
    },
    [getRowHeight]
  );

  useEffect(() => {
    // Calculate items in view
    root.current.style.width = `${size.x * cellWidth}px`;
    root.current.style.height = `${getRowOffset(size.y)}px`;
    setActiveColumns(Math.ceil(window.innerWidth / cellWidth) + 4);
    setActiveRows(Math.ceil(window.innerHeight / minCellHeight) + 4);

    // Change first active item
    function handleScroll() {
      const firstColumnIndex = Math.max(
        Math.floor(window.pageXOffset / cellWidth) - 2,
        0
      );
      let firstRowIndex = 0;
      while (getRowOffset(firstRowIndex) < window.pageYOffset) {
        firstRowIndex++;
      }
      firstRowIndex = Math.max(firstRowIndex - 2, 0);
      setFirstColumn(firstColumnIndex);
      setFirstRow(firstRowIndex);
    }
    document.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("scroll", handleScroll, { passive: true });
    };
  }, [size, minCellHeight, cellWidth, getRowOffset, getRowHeight]);

  const renderedChildren = [];
  for (let row = firstRow; row < firstRow + activeRows; row++) {
    for (
      let column = firstColumn;
      column < firstColumn + activeColumns;
      column++
    ) {
      const id = calculateId(column, row);
      renderedChildren.push(
        <CellBuilder
          key={id}
          id={id}
          column={column}
          row={row}
          offsetTop={getRowOffset(row)}
          height={getRowHeight(row)}
          width={cellWidth}
          minHeight={minCellHeight}
        />
      );
    }
  }
  return (
    <div ref={root} style={{ position: "relative" }}>
      {renderedChildren}
    </div>
  );
}
