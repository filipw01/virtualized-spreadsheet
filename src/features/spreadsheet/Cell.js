import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { createCellSelector, setCell } from "./spreadsheetSlice";
import style from "./Cell.module.css";

function resizeField(target) {
  target.style.height = target.scrollHeight + "px";
}

export default React.memo(function Item({ id, indexX, indexY, width, height }) {
  const cell = useSelector(createCellSelector(id));
  const dispatch = useDispatch();

  function handleChange(e) {
    resizeField(e.target);
    dispatch(setCell({ id, content: e.target.value }));
  }
  return (
    <textarea
      className={style.cell}
      style={{
        // backgroundColor: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
        transform: `translate(${indexX * width}px, ${indexY * height}px)`,
        width: `${width}px`,
        minHeight: `${height}px`,
      }}
      onChange={handleChange}
      defaultValue={cell || id}
    ></textarea>
  );
});
