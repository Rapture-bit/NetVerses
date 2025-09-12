import React, { useState, useLayoutEffect } from "react";
import { Tooltip } from "antd";

type Props = {};

const Media = (props: Props) => {
  const [textColor, setTextColor] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("GIFs");

  const getCssVariable = (variable) => {
    const root = document.documentElement;
    return getComputedStyle(root).getPropertyValue(variable).trim();
  };

  useLayoutEffect(() => {
    const updateColors = () => {
      setTextColor(getCssVariable("--text-color"));
    };

    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <div
      id="mediaMenu"
      className={`flex flex-col gap-3 border border-neutral-700 rounded-lg p-3 transition-all duration-500 ease-in-out transform ${
        textColor === "#c0c0c0" ? "bg-neutral-900" : "bg-neutral-300"
      }`}
    >
      <div className="flex flex-row gap-5">
        <div className="flex flex-row gap-3">
          <button
            className={`rounded-md transition-all duration-300 py-0.5 px-4 ${
              selectedTab === "GIFs"
                ? "bg-neutral-800 text-white"
                : "bg-transparent text-gray-400"
            }`}
            onClick={() => setSelectedTab("GIFs")}
          >
            GIFs
          </button>
          <button
            className={`rounded-md transition-all duration-300 py-0.5 px-4 ${
              selectedTab === "Images"
                ? "bg-neutral-800 text-white"
                : "bg-transparent text-gray-400"
            }`}
            onClick={() => setSelectedTab("Images")}
          >
            Images
          </button>
          <button
            className={`rounded-md transition-all duration-300 py-0.5 px-4 ${
              selectedTab === "Stickers"
                ? "bg-neutral-800 text-white"
                : "bg-transparent text-gray-400"
            }`}
            onClick={() => setSelectedTab("Stickers")}
          >
            Stickers
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row gap-3">
          <div className="relative w-full">
            <input
              type="text"
              className="p-1 pl-10 rounded-md w-full bg-neutral-800 text-sm text-white focus:outline-none"
              placeholder="Search GIF"
            />
            <span className="icon-[material-symbols--search] absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Media;
