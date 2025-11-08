import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PortableChat() {
  const [rightPosition, setRightPosition] = useState("8%");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [isExpanded, setExpanded] = useState<boolean>(false);

  const updatePosition = () => {
    const windowHeight = window.innerHeight;
    if (windowHeight < 740) {
      setRightPosition("6%");
    } else if (windowHeight >= 700 && windowHeight < 900) {
      setRightPosition("7%");
    } else {
      setRightPosition("8%");
    }
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  const chatWidth = Math.min(Math.max(windowWidth * 0.157, 200), 300);

  return (
    <div className="fixed flex flex-col z-[4000] pointer-events-none min-h-screen min-w-full">
      <div
        className="fixed bottom-0 pointer-events-auto py-1.5 rounded-t-lg darkerBackgroundColor border-t border-l border-r border-purple-800"
        style={{
          right: rightPosition,
          boxShadow: "0 4px 15px rgba(128, 0, 255, 0.5)",
          width: chatWidth,
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex justify-between items-center px-3 py-2 border-b dark:border-[#383838]">
          <span className="font-medium roboto text-gray-800 dark:text-white flex items-center">
            Messages
          </span>

          <button className="p-1 rounded-full transition-colors flex items-center justify-center">
            <span className="icon-[si--expand-less-fill] w-5 h-5 block"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
