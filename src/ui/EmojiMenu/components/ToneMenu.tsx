import { motion, AnimatePresence } from "framer-motion";

import { useState, useEffect, useRef, type RefObject } from "react";

type SkinTone = "Light" | "Medium" | "Dark" | "Default";
interface ToneButtonProps {
  containerRef: RefObject<HTMLDivElement | null>;
  selectedSkintone: SkinTone;
  setSelectedTone: Function;
}

export default function ToneButton({
  containerRef,
  selectedSkintone,
  setSelectedTone,
}: ToneButtonProps) {
  const [isVisible, setVisible] = useState<boolean>(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleVisible = () => {
    setVisible(true);
  };

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!containerRef || !containerRef.current) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !containerRef.current.contains(e.target)
      ) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!buttonRef.current || !containerRef.current || !menuRef.current) return;

    const updateMenuPosition = () => {
      if (!buttonRef.current || !containerRef.current || !menuRef.current)
        return;
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = buttonRect.left - containerRect.left;
      menuRef.current.style.transform = `translate(${x}px, 40px)`;
    };

    updateMenuPosition();

    const resizeObserver = new ResizeObserver(updateMenuPosition);
    resizeObserver.observe(buttonRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isVisible]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleVisible}
        className="inline-flex outline-none border-0 focus:outline-none focus:ring-0 focus-visible:border-2 border-purple-800 focus-visible:p-1 focus-visible:rounded-sm h-9 w-9 items-center cursor-pointer justify-center rounded-md hover:bg-gray-700/50 transition-all duration-300"
      >
        <span
          className={`block
                    ${
                      selectedSkintone === "Light"
                        ? "icon-[emojione--light-skin-tone]"
                        : ""
                    }
                    ${
                      selectedSkintone === "Medium"
                        ? "icon-[emojione--medium-skin-tone]"
                        : ""
                    }
                    ${
                      selectedSkintone === "Dark"
                        ? "icon-[emojione--dark-skin-tone]"
                        : ""
                    }
                    ${
                      selectedSkintone === "Default"
                        ? "icon-[emojione--yellow-skin-tone]"
                        : ""
                    }
                    w-5 h-5`}
        ></span>
      </button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={menuRef}
            className="absolute z-50 darkerBackgroundColor p-0.5 rounded-md translate-y-15 flex flex-col space-y-1"
          >
            <button
              onClick={() => setSelectedTone("Default")}
              className="p-1.5 items-center cursor-pointer justify-center rounded-md hover:bg-gray-700/50 transition-all duration-300"
            >
              <span
                className={`block
icon-[emojione--yellow-skin-tone]
hover:scale-110 transition-all duration-300
                    w-5 h-5`}
              ></span>
            </button>

            <button
              onClick={() => setSelectedTone("Light")}
              className="p-1.5 items-center cursor-pointer justify-center rounded-md hover:bg-gray-700/50 transition-all duration-300"
            >
              <span
                className={`block
icon-[emojione--light-skin-tone] hover:scale-110 transition-all duration-300
                    w-5 h-5`}
              ></span>
            </button>

            <button
              onClick={() => setSelectedTone("Medium")}
              className="p-1.5 items-center cursor-pointer justify-center rounded-md hover:bg-gray-700/50 transition-all duration-300"
            >
              <span
                className={`block
icon-[emojione--medium-skin-tone] hover:scale-110 transition-all duration-300
                    w-5 h-5`}
              ></span>
            </button>

            <button
              onClick={() => setSelectedTone("Dark")}
              className="p-1.5 items-center cursor-pointer justify-center rounded-md hover:bg-gray-700/50 transition-all duration-300"
            >
              <span
                className={`block
icon-[emojione--dark-skin-tone] hover:scale-110 transition-all duration-300
                    w-5 h-5`}
              ></span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
