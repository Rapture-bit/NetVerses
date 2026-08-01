import { useState, useEffect, useRef } from "react";
import ToneButton from "./components/ToneMenu";

import { AnimatePresence, motion } from "framer-motion";

import emojisList from "./data/emojisList.json";
import EmojiCategory from "./components/EmojiCategory";

interface EmojiMenuProps {
  buttonId: any;
  isVisible: any;
  setVisible: any;
}

type SkinTone = "Light" | "Medium" | "Dark" | "Default";
export default function EmojiMenu({
  buttonId,
  isVisible,
  setVisible,
}: EmojiMenuProps) {
  const [selectedTab, setSelectedTab] = useState<string>("Emojis");
  const [disableTransition, setDisableTransition] = useState(false);
  const [isRendering, setRenderingStatus] = useState<boolean>(false);

  const highlightRef = useRef<HTMLDivElement | null>(null);
  const emojiButtonRef = useRef<HTMLButtonElement | null>(null);
  const favoritesEmojiButtonRef = useRef<HTMLButtonElement | null>(null);
  const recentEmojiButtonRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const [indexedTerm, setIndexTerm] = useState<string>("");

  const [selectedTone, setSelectedTone] = useState<SkinTone>("Default");

  const [isOnFocus, setFocus] = useState<boolean>(false);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  const [label, setLabel] = useState<string>("");

  const menuRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ left: 0, top: 0 });

  const moveHighlight = () => {
    const buttonRef =
      selectedTab === "Emojis"
        ? emojiButtonRef
        : selectedTab === "Favorites"
          ? favoritesEmojiButtonRef
          : recentEmojiButtonRef;

    if (!highlightRef.current || !buttonRef.current || !containerRef.current)
      return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const x = buttonRect.left - containerRect.left;
    highlightRef.current.style.transform = `translate(${x}px, 20px)`;
    highlightRef.current.style.width = `${buttonRect.width + 5}px`;
  };

  useEffect(() => {
    moveHighlight();
  });

  useEffect(() => {
    moveHighlight();

    const onResize = () => {
      setDisableTransition(true);
      moveHighlight();
      requestAnimationFrame(() => {
        setDisableTransition(false);
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [selectedTab]);

  const updateMenuPosition = () => {
    if (!buttonId) return;

    const buttonElement = document.getElementById(buttonId);
    if (buttonElement && menuRef.current) {
      const rect = buttonElement.getBoundingClientRect();

      const left = rect.left;
      const top = rect.bottom + 10;

      menuRef.current.style.position = "fixed";
      menuRef.current.style.left = `${left}px`;
      menuRef.current.style.top = `${top}px`;
      menuRef.current.style.transform = "none";
    }
  };

  useEffect(() => {
    updateMenuPosition();
  }, [buttonId, isVisible]);

  useEffect(() => {
    const uniqueCategories = new Set<string>();

    emojisList.forEach((element) => {
      uniqueCategories.add(element.group);
    });

    setCategoriesList(Array.from(uniqueCategories));
  }, [emojisList]);

  useEffect(() => {
    if (!isVisible) {
      setIndexTerm("");
    } else {
      setRenderingStatus(true);
    }
  }, [isVisible]);

  useEffect(() => {
    const onScroll = () => {
      if (isVisible) {
        setVisible(false);
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        setVisible(false);
      }
    };

    updateMenuPosition();

    window.addEventListener("scroll", onScroll);
    window.addEventListener("keydown", handleEscapeKey);
    window.addEventListener("resize", updateMenuPosition);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [buttonId, isVisible]);

  useEffect(() => {
    if (!buttonId) return;
    updateMenuPosition();
  }, []);

  if (!isRendering) return null;
  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        animate={{ opacity: isVisible ? 1 : 0 }}
        initial={{ opacity: 0 }}
        transition={{
          duration: isVisible ? 0.2 : 0.4,
        }}
        onAnimationStart={() => {
          if (isVisible) {
            updateMenuPosition();
          }
        }}
        onAnimationComplete={() => {
          if (!isVisible) {
            setRenderingStatus(false);
          }
        }}
        className={`absolute flex flex-col p-3 rounded-md border borderColor darkerBackgroundColor shadow-lg
            w-full z-[999] sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 max-h-120 ${
              !isVisible ? "pointer-events-none select-none" : ""
            }`}
      >
        <div
          ref={containerRef}
          className="flex flex-row items-center justify-between border-b pb-2.5 borderColor relative"
        >
          <div className="flex flex-row space-x-7 text-sm">
            <button
              ref={emojiButtonRef}
              type="button"
              onClick={() => setSelectedTab("Emojis")}
              className="inter-font outline-none border-0 focus:outline-none focus:ring-0 focus-visible:border-2 border-purple-800 focus-visible:p-1 focus-visible:rounded-sm cursor-pointer flex flex-row items-center justify-center space-x-2"
            >
              <span className="icon-[iconoir--emoji] text-base"></span>
              <span className="select-none">Emojis</span>
            </button>

            <button
              ref={favoritesEmojiButtonRef}
              type="button"
              onClick={() => setSelectedTab("Favorites")}
              className="inter-font outline-none border-0 focus:outline-none focus:ring-0 focus-visible:border-2 border-purple-800 focus-visible:p-1 focus-visible:rounded-sm cursor-pointer flex flex-row items-center justify-center space-x-2"
            >
              <span className="icon-[fluent--star-28-regular] text-base"></span>
              <span className="select-none">Favorites</span>
            </button>

            <button
              ref={recentEmojiButtonRef}
              type="button"
              onClick={() => setSelectedTab("Recent")}
              className="inter-font outline-none border-0 focus:outline-none focus:ring-0 focus-visible:border-2 border-purple-800 focus-visible:p-1 focus-visible:rounded-sm cursor-pointer flex flex-row items-center justify-center space-x-2"
            >
              <span className="icon-[mdi--recent] text-base"></span>
              <span className="select-none">Recent</span>
            </button>
          </div>

          <div
            ref={highlightRef}
            className={`bg-purple-700 absolute py-[1.2px] rounded-xs transform ${
              disableTransition ? "" : "transition-transform duration-300"
            }`}
          ></div>

          <button
            type="button"
            onClick={() => setVisible(false)}
            className="cursor-pointer outline-none border-0 focus:outline-none focus:ring-0 focus-visible:border-2 border-purple-800 focus-visible:p-1 focus-visible:rounded-sm text-sm flex items-center justify-center"
            aria-label="Close"
          >
            <span className="icon-[ic--round-close] text-base"></span>
          </button>
        </div>

        <div
          ref={searchContainerRef}
          className="flex items-center space-x-2 mt-3"
        >
          <div
            className={`flex items-center border hover:border-purple-600
    ${
      isOnFocus
        ? "border-purple-700 shadow-[0_0_0_2px_rgba(147,51,234,0.35)]"
        : ""
    }
    transition-all duration-300 border-gray-600 w-full h-9 px-2 !rounded-sm`}
          >
            <span className="icon-[iconamoon--search] w-4.5 h-4.5 mr-2 block"></span>
            <input
              type="text"
              value={indexedTerm}
              onInput={(e) => setIndexTerm(e.currentTarget.value)}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              placeholder="Search..."
              className="w-full text-sm bg-transparent focus:outline-none leading-none"
            />
          </div>

          {selectedTab === "Emojis" && (
            <>
              <div className="self-stretch w-px bg-gray-500/50"></div>

              <ToneButton
                selectedSkintone={selectedTone}
                setSelectedTone={setSelectedTone}
                containerRef={searchContainerRef}
              />
            </>
          )}
        </div>

        <div className="flex flex-col mt-3 space-y-3 overflow-y-auto overflow-x-hidden">
          {selectedTab === "Emojis" &&
            categoriesList.map((element, index) => (
              <EmojiCategory
                key={index}
                categoryName={element}
                setLabel={setLabel}
                tone={selectedTone}
                searchIndex={indexedTerm}
              />
            ))}
        </div>

        <div className="flex-shrink-0 h-1/4 justify-start items-center flex">
          <span className="p-2">{label}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
