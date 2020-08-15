import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createCellSelector,
  setCell,
  changeRowHeight,
} from "./spreadsheetSlice";
import style from "./Cell.module.css";

export default React.memo(function Item({
  id,
  row,
  column,
  width,
  minHeight,
  visibleRows,
}) {
  const cell = useSelector(createCellSelector(id));
  const rows = useSelector((state) => state.spreadsheet.rows);
  const dispatch = useDispatch();
  const field = useRef(null);

  function resizeField(element) {
    element.style.height = "0";
    element.style.height = element.scrollHeight + "px";
    const height = element.style.height.slice(0, -2);
    dispatch(changeRowHeight({ row, column, height, minHeight }));
  }

  function handleChange() {
    resizeField(field.current);
    dispatch(setCell({ id, content: field.current.value }));
  }
  function getRowHeight(row) {
    if (rows[row]) {
      return Math.max(...rows[row].map((cell) => cell.height));
    }
    return minHeight;
  }
  function getRowOffset(rowNumber) {
    let offset = 0;
    for (let index = 0; index < rowNumber; index++) {
      offset += getRowHeight(index);
    }
    return offset;
  }

  return (
    <textarea
      ref={field}
      className={style.cell}
      style={{
        // backgroundColor: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
        zIndex: visibleRows - (row % visibleRows),
        top: `${getRowOffset(row)}px`,
        left: `${column * width}px`,
        width: `${width}px`,
        height: `${getRowHeight(row)}px`,
      }}
      onChange={handleChange}
      defaultValue={cell || id}
    ></textarea>
  );
});
