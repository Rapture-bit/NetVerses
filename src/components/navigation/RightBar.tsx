import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function RightBar({ articles }) {
  const { t } = useTranslation();
  const [isAuth, setAuth] = useState<boolean>(true);
  const topArticles = articles.slice(0, 3);
  const [rightPosition, setRightPosition] = useState("8%");

  const updatePosition = () => {
    const windowHeight = window.innerHeight;

    if (windowHeight < 740) {
      setRightPosition("6%");
    } else if (windowHeight >= 700 && windowHeight < 900) {
      setRightPosition("7%");
    } else {
      setRightPosition("8%");
    }
  };

  useEffect(() => {
    updatePosition();

    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  if (isAuth) {
    return (
      <nav
        className="fixed xl:flex hidden top-14 xl:top-20 h-[90vh] w-[16vw] min-w-[200px] max-w-[300px] p-4 roboto dark:text-white text-black flex-col items-center space-y-6 z-40 transition-all duration-300"
        style={{
          right: rightPosition,
        }}
      >
        <div className="flex flex-col space-y-4 justify-center items-center">
          {topArticles.map((articlesItem, index) => (
            <div
              key={index}
              className="relative flex flex-col p-5 transition-all duration-300 xl:w-64 darkerBackgroundColor rounded-lg gap-4"
            >
              <h2 className="text-xl font-bold mb-2">{articlesItem.title}</h2>
              <p className="dark:text-white text-gray-700 mb-2">
                {articlesItem.description}
              </p>
              <span className="bg-gradient-to-r select-none from-violet-300 to-violet-200 text-violet-900 py-1 px-3 rounded-full text-sm font-medium shadow-md">
                {articlesItem.category}
              </span>
            </div>
          ))}
          <div className="relative flex items-center justify-center p-3 transition-all duration-300 xl:w-64 darkerBackgroundColor rounded-lg gap-3">
            <div className="flex flex-row gap-3 items-center">
              <a
                href="/articles"
                className="text-violet-500 hover:underline font-medium jost"
              >
                {t("home.viewMoreNews")}
              </a>
            </div>
          </div>
        </div>
      </nav>
    );
  } else {
    return null;
  }
}
