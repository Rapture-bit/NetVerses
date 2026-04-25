import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { motion, AnimatePresence } from "framer-motion";

import RadioCard from "@/ui/RadioCard";
import { Tooltip } from "antd";

interface focusedComponentsProps {
  resetButton: boolean;
  searchInput: boolean;
}

// TO BE RENOVATED (Tumblr-like) //
export default function RightBar() {
  const { t } = useTranslation();
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [isAuth, setAuth] = useState<boolean>(true);
  const [rightPosition, setRightPosition] = useState("8%");

  const [showRightButton, setShowRightButton] = useState<boolean>(false);
  const [showLeftButton, setShowLeftButton] = useState<boolean>(false);

  const checkScroll = () => {
    const maxScroll =
      scrollContainer?.current?.scrollWidth -
      scrollContainer?.current?.clientWidth;
    const scrollWidth = scrollContainer?.current?.scrollLeft;
    console.log(maxScroll, scrollWidth);

    if (scrollWidth === 0) {
      setShowRightButton(true);
      setShowLeftButton(false);
    } else if (scrollWidth === maxScroll) {
      setShowLeftButton(true);
      setShowRightButton(false);
    } else if (scrollWidth < maxScroll) {
      setShowRightButton(true);
      setShowLeftButton(true);
    }
  };

  const [isInputFocused, setInputFocused] = useState<boolean>(false);
  const [focusedComponents, setFocusedComponents] =
    useState<focusedComponentsProps>({
      resetButton: false,
      searchInput: false,
    });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const scroll = (direction: "left" | "right") => {
    if (scrollContainer.current) {
      const scrollAmount = scrollContainer.current.offsetWidth / 2; // adjust scroll step
      scrollContainer.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const repeatedTimes = 10;
  useEffect(() => {
    if (!scrollContainer) return;

    let times = 0;
    const intervalID = setInterval(() => {
      if (times >= repeatedTimes) clearInterval(intervalID);
      checkScroll();
      times += 1;
    }, 0.35 * 1000);
  }, [scrollContainer]);

  useEffect(() => {
    if (!scrollContainer) return;

    const handleScroll = () => {
      let times = 0;
      const intervalID = setInterval(() => {
        if (times >= repeatedTimes) clearInterval(intervalID);
        checkScroll();
        times += 1;
      }, 0.35 * 1000);
    };

    scrollContainer.current.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      scrollContainer?.current?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    updatePosition();

    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  const clearSearch = () => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  };

  if (!isAuth) return null;

  return (
    <aside
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
    ${isInputFocused ? "border-purple-700 shadow-[0_0_10px_rgba(147,51,234,0.4)]" : "borderColor"} 
    darkerBackgroundColor
  `}
        >
          <div className="flex items-center w-full gap-2 p-0.5 text-sm text-neutral-700 dark:text-neutral-400 focus-within:text-black dark:focus-within:text-white">
            <span className="icon-[si--search-line] w-4 h-4 flex-shrink-0 transition-colors duration-300" />
            <input
              onInput={(e) => onSearchInput(e.currentTarget.value)}
              ref={searchInputRef}
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
              placeholder="Search anything..."
              className="w-full bg-transparent outline-none placeholder-neutral-500 text-black dark:text-white text-sm"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="text-neutral-500 dark:hover:text-neutral-300 hover:text-neutral-600 transition-all duration-200 hover:rotate-90"
              >
                <span className="icon-[mdi--close] w-4 h-4 translate-y-0.5"></span>
              </button>
            )}
          </div>

          {searchTerm && isInputFocused && (
            <div
              className="absolute top-full left-0 right-0 mt-3 z-50 backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
              role="region"
              aria-live="polite"
            >
              <div className="p-2">
                <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Search Results
                </div>
                <button
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 group"
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="icon-[si--search-line] w-4 h-4 text-purple-500"
                      aria-hidden="true"
                    ></span>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Search for{" "}
                      </span>
                      <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 group-hover:underline">
                        "{searchTerm}"
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-neutral-700 px-3 w-full rounded-full py-[0.03rem]"></div>

        <div className="relative flex items-center justify-start p-3 transition-all duration-300 xl:w-64 darkerBackgroundColor rounded-lg gap-3 border borderColor">
          <h2
            id="radio-section-title"
            className="font-semibold select-none text-base textColor flex items-center gap-2"
          >
            <span
              className="icon-[mdi--radio] w-5 h-5"
              aria-hidden="true"
            ></span>
            Radio Broadcasts
          </h2>
        </div>

        <div className="relative flex items-center justify-start transition-all duration-300 xl:w-64">
          <AnimatePresence>
            {showLeftButton && (
              <Tooltip
                mouseLeaveDelay={0}
                title="Previous"
                placement="bottom"
                arrow={false}
              >
                <motion.button
                  initial={{ opacity: 0, x: -20, y: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-1/2 z-10 p-2 rounded-full hover:bg-opacity-70"
                  onClick={() => scroll("left")}
                >
                  <span className="icon-[tabler--arrow-left] h-7 w-7 cursor-pointer text-white hover:scale-110 transition-transform" />
                </motion.button>
              </Tooltip>
            )}
          </AnimatePresence>

          <div
            ref={scrollContainer}
            className="flex flex-row gap-5 overflow-x-auto hide-scrollbar py-2 scroll-smooth relative"
          >
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

          {showRightButton && (
            <Tooltip
              mouseLeaveDelay={0}
              title="Next"
              placement="bottom"
              arrow={false}
            >
              <motion.button
                initial={{ opacity: 0, x: 20, y: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-1/2 z-10 p-2 rounded-full hover:bg-opacity-70"
                onClick={() => scroll("right")}
              >
                <span className="icon-[tabler--arrow-right] h-7 w-7 cursor-pointer text-white hover:scale-110 transition-transform" />
              </motion.button>
            </Tooltip>
          )}
        </div>

        <div className="relative flex items-center justify-start p-3 transition-all duration-300 xl:w-64 darkerBackgroundColor rounded-lg gap-3 border borderColor">
          <h2
            id="articles-section-title"
            className="font-semibold select-none text-base textColor flex items-center gap-2"
          >
            <span
              className="icon-[mdi--newspaper-variant-outline] w-5 h-5"
              aria-hidden="true"
            ></span>
            Local Articles
          </h2>
        </div>

        <div className="relative flex items-center justify-center p-3 transition-all duration-300 xl:w-64 darkerBackgroundColor hover:border-purple-400 rounded-lg gap-3 border borderColor group">
          <div className="flex flex-row gap-3 items-center">
            <Link
              to="/"
              onClick={() => {
                localStorage.setItem("selectedFeed", "Articles");
                window.dispatchEvent(
                  new CustomEvent("selectedFeedChange", { detail: "Articles" }),
                );
              }}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium jost flex items-center gap-2 group-hover:gap-3 transition-all duration-300"
            >
              {t("home.viewMoreArticles")}
              <span
                className="icon-[mdi--arrow-right] w-4 h-4"
                aria-hidden="true"
              ></span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
