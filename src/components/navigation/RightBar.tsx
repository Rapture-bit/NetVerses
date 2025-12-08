import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import RadioCard from "@/components/RadioCard";

interface focusedComponentsProps {
  resetButton: boolean;
  searchInput: boolean;
}

// TO BE RENOVATED (Tumblr-like) //
export default function RightBar() {
  const { t } = useTranslation();
  const [isAuth, setAuth] = useState<boolean>(true);
  const [rightPosition, setRightPosition] = useState("8%");

  const [isInputFocused, setInputFocused] = useState<boolean>(false);
  const [focusedComponents, setFocusedComponents] =
    useState<focusedComponentsProps>({
      resetButton: false,
      searchInput: false,
    });

  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (focusedComponents.resetButton || focusedComponents.searchInput) {
      setInputFocused(true);
    } else {
      setInputFocused(false);
    }
  }, [focusedComponents]);

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

  const onSearchInput = (inputValue) => {
    setSearchTerm(inputValue);
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
        className="fixed xl:flex hidden top-14 xl:top-20 h-[90vh] w-[16vw] min-w-[200px] max-w-[300px] p-4 roboto dark:text-white text-black flex-col items-center space-y-6 z-10 transition-all duration-300"
        style={{
          right: rightPosition,
        }}
      >
        <div className="flex flex-col space-y-4 justify-center items-center">
          <div
            className={`
    relative flex items-center justify-center px-4 py-2 
    transition-all duration-300 
    xl:w-64 w-full 
    border rounded-lg
    ${isInputFocused ? "border-purple-700 shadow-[0_0_10px_rgba(147,51,234,0.4)]" : "border-[#3b3b3b]"} 
    darkerBackgroundColor
  `}
          >
            <div className="flex items-center w-full gap-2 text-sm text-neutral-700 dark:text-neutral-400 focus-within:text-black dark:focus-within:text-white">
              <span className="icon-[si--search-line] w-4 h-4 flex-shrink-0 transition-colors duration-300" />
              <input
                onInput={(e) => onSearchInput(e.currentTarget.value)}
                onFocus={() => {
                  setFocusedComponents((prevState) => ({
                    ...prevState,
                    searchInput: true,
                  }));
                }}
                onBlur={() => {
                  setFocusedComponents((prevState) => ({
                    ...prevState,
                    searchInput: false,
                  }));
                }}
                type="text"
                value={searchTerm}
                placeholder="Search"
                className="w-full bg-transparent outline-none placeholder-neutral-500 text-black dark:text-white text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-neutral-500 dark:hover:text-neutral-300 hover:text-neutral-600 transition-colors"
                >
                  <span className="icon-[mdi--close] w-4 h-4 translate-y-0.5"></span>
                </button>
              )}
            </div>
          </div>

          {searchTerm && isInputFocused && (
            <div className="absolute xl:w-64 z-[999] darkerBackgroundColor rounded-md py-1 border-purple-700 shadow-[0_0_10px_rgba(147,51,234,0.4)] border space-y-3">
              <div className="flex flex-col">
                <button>Searching for {searchTerm}</button>
              </div>
            </div>
          )}

          <div className="bg-neutral-700 px-3 w-full rounded-full py-[0.03rem]"></div>

          <div className="relative flex items-center justify-start p-3 transition-all duration-300 xl:w-64 darkerBackgroundColor rounded-lg gap-3 border border-neutral-700">
            <span className="font-semibold text-base textColor">
              Radio Broadcasts
            </span>
          </div>

          <div className="relative flex items-center justify-start transition-all duration-300 xl:w-64">
            <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l dark:from-[#1F1F1F] from-[#cfcfcf] to-transparent z-10"></div>

            <div className="flex flex-row gap-5 overflow-x-auto hide-scrollbar py-2 scroll-smooth relative">
              <RadioCard
                playingStatus="paused"
                radioName="Radio Name"
                id={"123456789"}
                genre="News"
              />
              <RadioCard
                playingStatus="paused"
                radioName="Radio Name"
                id={"987658321"}
                genre="Music"
              />
              <RadioCard
                radioName="Radio Name"
                playingStatus="paused"
                setPlayingStatus={() => 0}
                id={"112345778"}
                genre="Sports"
              />
              <RadioCard
                playingStatus="paused"
                radioName="Radio Name"
                id={"123556789"}
                genre="Talk"
              />
            </div>
          </div>

          <div className="relative flex items-center justify-start p-3 transition-all duration-300 xl:w-64 darkerBackgroundColor rounded-lg gap-3 border border-neutral-700">
            <span className="font-semibold text-base textColor">
              Local Articles
            </span>
          </div>

          <div className="relative flex items-center justify-center p-3 transition-all duration-300 xl:w-64 darkerBackgroundColor rounded-lg gap-3 border border-neutral-700">
            <div className="flex flex-row gap-3 items-center">
              <Link
                to="/articles"
                className="text-violet-500 hover:underline font-medium jost"
              >
                {t("home.viewMoreArticles")}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  } else {
    return null;
  }
}
