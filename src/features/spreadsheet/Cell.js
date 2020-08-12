import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createCellSelector, setCell } from "./spreadsheetSlice";
import style from "./Cell.module.css";

function resizeField(element) {
  element.style.height = "0";
  element.style.height = element.scrollHeight + "px";
}

export default React.memo(function Item({
  id,
  indexX,
  indexY,
  width,
  minHeight,
  visibleRows,
}) {
  const cell = useSelector(createCellSelector(id));
  const dispatch = useDispatch();
  const field = useRef(null);

  useEffect(() => {
    if (cell) {
      resizeField(field.current);
    }
  }, [cell]);

  function handleChange() {
    resizeField(field.current);
    dispatch(setCell({ id, content: field.current.value }));
  }
  return (
    <textarea
      ref={field}
      className={style.cell}
      style={{
        // backgroundColor: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
        zIndex: visibleRows - (indexY % visibleRows),
        transform: `translate(${indexX * width}px, ${indexY * minHeight}px)`,
        width: `${width}px`,
        minHeight: `${minHeight}px`,
      }}
      onChange={handleChange}
      defaultValue={cell || id}
    ></textarea>
  );
});
