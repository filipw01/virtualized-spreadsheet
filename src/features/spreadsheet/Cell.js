import React, { useRef } from "react";
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
  offsetTop,
  height,
  minHeight,
}) {
  const cell = useSelector(createCellSelector(id));
  const dispatch = useDispatch();
  const field = useRef(null);

  function resizeField(element) {
    element.style.height = "auto";
    const tempHeight = element.scrollHeight;
    if (tempHeight !== height) {
      element.style.height = `${Math.max(height, tempHeight)}px`;
      dispatch(changeRowHeight({ row, column, height: tempHeight, minHeight }));
    }
    element.style.height = `${height}px`;
  }

  function handleChange() {
    resizeField(field.current);
    dispatch(setCell({ id, content: field.current.value }));
  }

  return (
    <textarea
      ref={field}
      className={style.cell}
      style={{
        transform: `translate(${column * width}px,${offsetTop}px)`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      onChange={handleChange}
      defaultValue={cell || id}
    ></textarea>
  );
});
