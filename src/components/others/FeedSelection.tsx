import React, { useState } from "react";

export default function FeedSelection({ onChange }) {
  const [selected, setSelected] = useState(
    localStorage.getItem("selectedFeed") || "My Feed",
  );

  const handleSelectionChange = (newSelection) => {
    setSelected(newSelection);
    if (onChange) {
      onChange(newSelection);
    }
  };

  return (
    <div className="select-none flex darkerBackgroundColor w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 h-14 rounded-lg z-30">
      <button
        aria-label="MyFeed"
        className={`flex gap-2 flex-grow h-full items-center justify-center rounded-l-lg transition-colors duration-300 ${
          selected === "MyFeed"
            ? "textColor bg-gray-200 dark:bg-neutral-800 font-medium"
            : "dark:text-gray-400 hover:text-gray-600 hover:bg-gray-200 hover:dark:text-gray-300 hover:dark:bg-neutral-800"
        }`}
        onClick={() => handleSelectionChange("MyFeed")}
      >
        {selected === "MyFeed" ? (
          <span className="icon-[material-symbols--person] text-xl"></span>
        ) : (
          <span className="icon-[material-symbols--person-outline] text-xl"></span>
        )}
        <span className="text-base">My Feed</span>
      </button>
      <button
        aria-label="News"
        className={`flex gap-2 flex-grow h-full items-center justify-center rounded-r-lg transition-colors duration-300 ${
          selected === "News"
            ? "textColor bg-gray-200 dark:bg-neutral-800 font-medium"
            : "dark:text-gray-400 hover:text-gray-600 hover:bg-gray-200 hover:dark:text-gray-300 hover:dark:bg-neutral-800"
        }`}
        onClick={() => handleSelectionChange("News")}
      >
        <span className="icon-[mingcute--news-line] text-xl"></span>
        <span className="text-base">News</span>
      </button>
    </div>
  );
}
