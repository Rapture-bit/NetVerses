import React, { useState } from "react";

export default function TooltipHelp({ children, title }) {
  const [isHovered, setHoveredState] = useState<boolean>(false);

  return (
    <div className="flex flex-row items-center space-x-1">
      {children}
      <button
        onMouseEnter={() => {
          setHoveredState(true);
        }}
        onMouseLeave={() => {
          setHoveredState(false);
        }}
        className="flex items-center justify-center"
      >
        <span className="icon-[ph--question] mb-0.5"></span>
      </button>
    </div>
  );
}
