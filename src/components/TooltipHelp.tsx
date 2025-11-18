import React, { useState } from "react";

export default function TooltipHelp({ children, title }) {
  const [isHovered, setHoveredState] = useState<boolean>(false);

  return (
    <div className="flex flex-row items-center space-x-1 relative">
      {children}
      <button
        onMouseEnter={() => setHoveredState(true)}
        onMouseLeave={() => setHoveredState(false)}
        className="flex items-center justify-center relative"
      >
        <span className="icon-[ph--question] mb-0.5"></span>

        <div
          className={`
        absolute top-full mt-2 w-80 italic text-xs break-words
        transition-all duration-300
        px-2 py-1 rounded-md z-10 darkerBackgroundColor shadow-lg
        ${isHovered ? "opacity-100 visible" : "opacity-0 invisible"}
      `}
        >
          {title}
        </div>
      </button>
    </div>
  );
}
