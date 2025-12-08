import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function FeedSelection({ onChange }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(
    localStorage.getItem("selectedFeed") || t("home.myFeed"),
  );

  const handleSelectionChange = (newSelection) => {
    setSelected(newSelection);
    if (onChange) {
      onChange(newSelection);
    }
  };

  return (
    <div
      id="feed-selection"
      className="relative select-none flex border border-neutral-700 darkerBackgroundColor w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 h-14 rounded-lg z-30"
    >
      <div
        className={`absolute bottom-0 h-1 bg-purple-800 rounded-full transition-all duration-300`}
        style={{
          left: selected === "MyFeed" ? "0%" : "50%",
          width: "50%",
        }}
      ></div>

      <button
        aria-label="MyFeed"
        className={`flex gap-2 flex-grow h-full items-center justify-center rounded-l-lg transition-colors duration-300 ${
          selected === "MyFeed"
            ? "textColor font-medium"
            : "dark:text-gray-400 hover:text-gray-600 hover:dark:text-gray-300"
        }`}
        onClick={() => handleSelectionChange("MyFeed")}
      >
        <span
          className={`text-xl ${selected === "MyFeed" ? "icon-[material-symbols--person]" : "icon-[material-symbols--person-outline]"}`}
        ></span>
        <span className="text-base">{t("home.myFeed")}</span>
      </button>

      <button
        aria-label={t("home.articlesLabel")}
        className={`flex gap-2 flex-grow h-full items-center justify-center rounded-r-lg transition-colors duration-300 ${
          selected === "Articles"
            ? "textColor font-medium"
            : "dark:text-gray-400 hover:text-gray-600 hover:dark:text-gray-300"
        }`}
        onClick={() => handleSelectionChange("Articles")}
      >
        <span
          className={`text-xl ${selected === "Articles" ? "icon-[ion--newspaper]" : "icon-[ion--newspaper-outline]"}`}
        ></span>
        <span className="text-base">{t("home.articlesLabel")}</span>
      </button>
    </div>
  );
}
