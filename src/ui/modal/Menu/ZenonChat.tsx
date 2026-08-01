import React, { useState, useEffect, useContext } from "react";
import PrimaryModal from "@/ui/modal/Primary";
import { motion, AnimatePresence } from "framer-motion";
import { Button, ConfigProvider } from "antd";
import { ThemeContext } from "@/context/ThemeContext";

import Tooltip from "@/ui/Tooltip";

export default function ZenonAI({ visible, userDetails, setIsOpen }) {
  const { colorProperties } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isSelectMode, setSelectMode] = useState<boolean>(false);

  let previousSelectedElement = null;
  const toggleSelectMode = () => {
    setSelectMode((prev) => !prev);
  };

  useEffect(() => {
    if (!isSelectMode) {
      document.querySelectorAll(".outline-purple-500").forEach((el) => {
        el.className = el.className.replace(
          " outline outline-2 outline-purple-500",
          "",
        );
      });
      return;
    }

    const blockMouse = (e) => {
      if (
        e.target.closest("#toggleSelectModeButton") ||
        e.target.closest("#zenonChatInput") ||
        e.target.closest("#toggleUploadModeButton")
      )
        return;

      e.preventDefault();
      e.stopPropagation();

      if (e.type === "click") {
        if (e.target !== previousSelectedElement && previousSelectedElement) {
          previousSelectedElement.className =
            previousSelectedElement.className.replace(
              " outline outline-2 outline-purple-500",
              "",
            );
        }
        const selectedElement = e.target;
        previousSelectedElement = selectedElement;

        if (selectedElement instanceof HTMLElement) {
          if (
            !selectedElement.className.includes(
              "outline outline-2 outline-purple-500",
            )
          ) {
            selectedElement.className +=
              " outline outline-2 outline-purple-500";
          }
        }
      }
    };

    const events = [
      "click",
      "mousedown",
      "mouseup",
      "mousemove",
      "mouseenter",
      "mouseleave",
      "mouseover",
      "mouseout",
      "contextmenu",
    ];

    events.forEach((event) => {
      document.addEventListener(event, blockMouse, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, blockMouse, true);
      });
    };
  }, [isSelectMode]);

  const toggleVisible = () => {
    setIsOpen(false);
    setIsLoading(true);
  };

  const startLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (visible) {
      startLoading();
    } else {
      setIsLoading(false);
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          {...(!isLoading && {
            drag: true,
            dragMomentum: false,
            dragElastic: 0.2,
          })}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-999 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            style={{
              boxShadow: `
      0 4px 15px rgba(138, 43, 226, 0.6),
      0 0 20px rgba(138, 43, 226, 0.4)
    `,
            }}
            animate={{
              width: !isLoading ? "24rem" : "auto",
              padding: !isLoading ? "0.75rem 1rem" : "0.75rem",
            }}
            transition={{
              width: { duration: 0.6, ease: "easeOut" },
              padding: { duration: 0.3 },
            }}
            className={`pointer-events-auto nav-hover flex items-center justify-center rounded-2xl border ${
              isLoading ? "dark:border-neutral-700" : "border-purple-700"
            } darkerBackgroundColor overflow-hidden`}
          >
            {isLoading && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="icon-[eos-icons--loading] w-9 h-9 dark:text-white/85 text-black"
              ></motion.span>
            )}

            {!isLoading && (
              <motion.div className="flex flex-col space-y-3 w-full">
                <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 pb-1.5 items-center w-full">
                  <div className="flex flex-row space-x-2">
                    <Tooltip label="Settings">
                      <button
                        type="button"
                        onClick={() => console.log("Open settings")}
                        className="flex items-center justify-center p-1 text-sm border-0 rounded-sm focus:outline-none"
                        aria-label="Settings"
                      >
                        <span className="icon-[material-symbols--settings] w-5 h-5 text-base"></span>
                      </button>
                    </Tooltip>

                    <Tooltip label="History">
                      <button
                        type="button"
                        onClick={() => console.log("Open settings")}
                        className="flex items-center justify-center p-1 text-sm border-0 rounded-sm focus:outline-none"
                        aria-label="Chat History"
                      >
                        <span className="icon-[material-symbols--history] w-5 h-5 text-base"></span>
                      </button>
                    </Tooltip>
                  </div>
                  <Tooltip label="Close">
                    <button
                      type="button"
                      onClick={() => toggleVisible()}
                      className="flex items-center justify-center p-1 text-sm border-0 rounded-sm focus:outline-none"
                      aria-label="Close"
                    >
                      <span className="icon-[ic--round-close] w-5 h-5 text-base"></span>
                    </button>
                  </Tooltip>
                </div>

                <div className="flex flex-col justify-center pb-20 items-center text-center h-full w-full">
                  <span className="text-xl font-semibold mt-4">
                    Hello,{" "}
                    <span className="hover:underline">
                      {userDetails?.display_name || "LunaTech"}
                    </span>
                    !
                  </span>
                  <span className="text-sm italic select-text text-gray-500 mt-1">
                    How can I help you today?
                  </span>
                  <span className="text-sm italic select-text text-gray-500 mt-1">
                    I can explain, summarize, or send messages for you.
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2.5 justify-center">
                    {[
                      "/explain",
                      "/summarize",
                      "/rewrite",
                      "/post",
                      "/message",
                    ].map((cmd) => (
                      <span
                        key={cmd}
                        className="bg-purple-100 dark:bg-purple-700 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded text-xs font-mono"
                      >
                        {cmd}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-row space-x-3">
                  <Tooltip label="Upload">
                    <button
                      id="toggleUploadModeButton"
                      type="button"
                      onClick={() => setVisible(false)}
                      className="flex items-center justify-center p-1 text-sm border-0 rounded-sm focus:outline-none"
                      aria-label="Upload"
                    >
                      <span className="icon-[ic--round-upload] w-5 h-5 text-base"></span>
                    </button>
                  </Tooltip>

                  <Tooltip label="Select">
                    <button
                      type="button"
                      id="toggleSelectModeButton"
                      onClick={toggleSelectMode}
                      className={`flex items-center justify-center p-1 text-sm border-0 rounded-sm focus:outline-none transition-all duration-250 ${isSelectMode ? "text-purple-500" : ""}`}
                      aria-label="Select"
                    >
                      <span className="icon-[ant-design--select-outlined] w-5 h-5 text-base"></span>
                    </button>
                  </Tooltip>

                  <textarea
                    id="zenonChatInput"
                    placeholder="Service unavailable in your region"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                      }
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      requestAnimationFrame(() => {
                        if (target.value.trim() === "") {
                          target.style.height = "35px";
                          return;
                        }
                        target.style.height = "35px";
                        target.style.height = `${target.scrollHeight}px`;
                      });
                    }}
                    style={{
                      height: "35px",
                      minHeight: "35px",
                      maxHeight: "200px",
                    }}
                    className="border-b border-gray-400 resize-none flex-grow py-1 bg-transparent focus:outline-none focus:ring-0 focus:shadow-none transition-colors duration-300"
                    readOnly
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
