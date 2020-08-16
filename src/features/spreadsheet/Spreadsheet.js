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
  const [activeItemsCountX, setActiveItemsCountX] = useState(0);
  const [activeItemsCountY, setActiveItemsCountY] = useState(0);
  const [firstItemIndexX, setFirstItemIndexX] = useState(0);
  const [firstItemIndexY, setFirstItemIndexY] = useState(0);
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
    setActiveItemsCountX(Math.ceil(window.innerWidth / cellWidth) + 4);
    setActiveItemsCountY(Math.ceil(window.innerHeight / minCellHeight) + 4);

    function handleScroll() {
      const firstItemX = Math.max(
        Math.floor(window.pageXOffset / cellWidth) - 2,
        0
      );
      let firstItemY = 0;
      while (getRowOffset(firstItemY) < window.pageYOffset) {
        firstItemY++;
      }
      firstItemY = Math.max(firstItemY - 2, 0);
      setFirstItemIndexX(firstItemX);
      setFirstItemIndexY(firstItemY);
    }
    document.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("scroll", handleScroll, { passive: true });
    };
  }, [size, minCellHeight, cellWidth, getRowOffset, getRowHeight]);

  const renderedChildren = [];
  for (
    let row = firstItemIndexY;
    row < firstItemIndexY + activeItemsCountY;
    row++
  ) {
    for (
      let column = firstItemIndexX;
      column < firstItemIndexX + activeItemsCountX;
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
