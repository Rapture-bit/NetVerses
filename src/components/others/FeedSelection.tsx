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
        <span className="text-base">{t("home.myFeed")}</span>
      </button>
      <button
        aria-label={t("home.articlesLabel")}
        className={`flex gap-2 flex-grow h-full items-center justify-center rounded-r-lg transition-colors duration-300 ${
          selected === "Articles"
            ? "textColor bg-gray-200 dark:bg-neutral-800 font-medium"
            : "dark:text-gray-400 hover:text-gray-600 hover:bg-gray-200 hover:dark:text-gray-300 hover:dark:bg-neutral-800"
        }`}
        onClick={() => handleSelectionChange("Articles")}
      >
        <span className="icon-[mingcute--news-line] text-xl"></span>
        <span className="text-base">{t("home.articlesLabel")}</span>
      </button>
    </div>
  );
}
