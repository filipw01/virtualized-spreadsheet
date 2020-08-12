import React, { useRef, useEffect, useState } from "react";

function calculateId(indexX, indexY) {
  let letter = "";
  let charCode;
  do {
    charCode = indexY % 25;
    letter = String.fromCharCode(65 + charCode) + letter;
    indexY = Math.floor(indexY / 25);
  } while (indexY > 0);
  return letter + indexX;
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
  useEffect(() => {
    // Calculate items in view
    root.current.style.width = `${size.x * cellWidth}px`;
    // TODO:
    root.current.style.height = `${size.y * minCellHeight}px`;
    setActiveItemsCountX(Math.ceil(window.innerWidth / cellWidth) + 4);
    // TODO:
    setActiveItemsCountY(Math.ceil(window.innerHeight / minCellHeight) + 4);

    function handleScroll() {
      const firstItemX = Math.max(
        Math.floor(window.pageXOffset / cellWidth) - 2,
        0
      );
      // TODO:
      const firstItemY = Math.max(
        Math.floor(window.pageYOffset / minCellHeight) - 2,
        0
      );
      setFirstItemIndexX(firstItemX);
      setFirstItemIndexY(firstItemY);
    }
    document.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("scroll", handleScroll, { passive: true });
    };
  }, [size, minCellHeight, cellWidth]);

  const renderedChildren = [];
  for (
    let indexY = firstItemIndexY;
    indexY < firstItemIndexY + activeItemsCountY;
    indexY++
  ) {
    for (
      let indexX = firstItemIndexX;
      indexX < firstItemIndexX + activeItemsCountX;
      indexX++
    ) {
      const id = calculateId(indexX, indexY);
      renderedChildren.push(
        <CellBuilder
          key={id}
          id={id}
          indexX={indexX}
          indexY={indexY}
          width={cellWidth}
          minHeight={minCellHeight}
          visibleRows={activeItemsCountY}
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
