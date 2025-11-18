import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ArticleItem {
  title: string;
  description: string;
  category: string;
}

interface focusedComponentsProps {
  resetButton: boolean;
  searchInput: boolean;
}

export default function RightBar() {
  const { t } = useTranslation();
  const [isAuth, setAuth] = useState<boolean>(true);
  const [allArticles, setAllArticles] = useState<object[]>([
    {
      title: "Breaking News 1",
      description: "This is the description for breaking news 1.",
      category: "Business",
    },
    {
      title: "Breaking News 2",
      description: "This is the description for breaking news 2.",
      category: "Technology",
    },
    {
      title: "Breaking News 3",
      description: "This is the description for breaking news 3.",
      category: "Health",
    },
  ]);
  const [topArticles, setTopArticles] = useState<Object[]>([]);
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

  useEffect(() => {
    setTopArticles(allArticles.slice(0, 3));
  }, [allArticles]);

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
                placeholder="Search..."
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
            <div className="absolute z-[999] darkerBackgroundColor rounded-md p-3 border-neutral-700 border flex flex-col space-y-3">
              <button></button>
            </div>
          )}

          <div className="bg-neutral-700 px-3 w-full rounded-full py-[0.03rem]"></div>

          {topArticles.map((articleItem: ArticleItem, index) => (
            <div
              key={index}
              className="relative flex flex-col p-5 transition-all duration-300 xl:w-64 darkerBackgroundColor rounded-lg gap-4 border border-neutral-700"
            >
              <h2 className="text-xl font-bold mb-2">{articleItem.title}</h2>
              <p className="dark:text-white text-gray-700 mb-2">
                {articleItem.description}
              </p>
              <span className="bg-gradient-to-r select-none from-violet-300 to-violet-200 text-violet-900 py-1 px-3 rounded-full text-sm font-medium shadow-md">
                {articleItem.category}
              </span>
            </div>
          ))}
          <div className="relative flex items-center justify-center p-3 transition-all duration-300 xl:w-64 darkerBackgroundColor rounded-lg gap-3 border border-neutral-700">
            <div className="flex flex-row gap-3 items-center">
              <Link
                to="/articles"
                className="text-violet-500 hover:underline font-medium jost"
              >
                {t("home.viewMoreNews")}
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
