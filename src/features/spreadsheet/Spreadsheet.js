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

export default function Spreadsheet({ size, CellBuilder, height, width }) {
  const root = useRef(null);
  const [activeItemsCountX, setActiveItemsCountX] = useState(0);
  const [activeItemsCountY, setActiveItemsCountY] = useState(0);
  const [firstItemIndexX, setFirstItemIndexX] = useState(0);
  const [firstItemIndexY, setFirstItemIndexY] = useState(0);
  useEffect(() => {
    // Calculate items in view
    root.current.style.width = `${size.x * width}px`;
    root.current.style.height = `${size.y * height}px`;
    setActiveItemsCountX(Math.ceil(window.innerWidth / width) + 4);
    setActiveItemsCountY(Math.ceil(window.innerHeight / height) + 4);
    function handleScroll() {
      const firstItemX = Math.max(
        Math.floor(window.pageXOffset / width) - 2,
        0
      );
      const firstItemY = Math.max(
        Math.floor(window.pageYOffset / height) - 2,
        0
      );
      setFirstItemIndexX(firstItemX);
      setFirstItemIndexY(firstItemY);
    }
    document.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("scroll", handleScroll, { passive: true });
    };
  }, [size, height, width]);

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
          width={width}
          height={height}
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
