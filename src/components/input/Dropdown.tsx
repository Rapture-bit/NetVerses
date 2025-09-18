import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

interface DropdownProps {
  contentArray: any[];
  openSide: string;
  size: string;
  TWStyling?: string;
  primaryOption: string;
}

export default function Dropdown({
  contentArray,
  primaryOption,
  openSide,
  size,
  TWStyling,
}: DropdownProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    primaryOption,
  );
  const [showDropdownMenu, setShowMenu] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<string>(size);

  const [position, setPosition] = useState({ top: 0, left: 0 });

  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const toggleDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
      });
    }
    setShowMenu(!showDropdownMenu);
  };

  useEffect(() => {
    const handleResize = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY,
        });
      }
      setShowMenu(false);
    };

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousedown", handleClickOutside);
    return () => (
      window.removeEventListener("resize", handleResize),
      window.removeEventListener("mousedown", handleClickOutside)
    );
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`text-${textSize} space-x-1`}
      >
        <span className={`text-${textSize}`}>{selectedOption}</span>
        {openSide == "up" && <UpOutlined />}
        {openSide == "down" && <DownOutlined />}
      </button>

      <AnimatePresence>
        {showDropdownMenu && (
          <motion.div
            id="dropdown-menu"
            key="dropdown-menu"
            ref={menuRef}
            className={`fixed border-[0.1px] backgroundColor dark:border-[#313131] border-[#a8a8a8] text-sm flex justify-center items-center p-3.5 rounded-lg z-[9999]`}
            initial={{ opacity: 0, y: openSide === "up" ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              bottom: `calc(100vh - ${position.top}px + 10px)`,
              left: position.left - 26,
            }}
            exit={{ opacity: 0, y: openSide === "up" ? 10 : -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div
              className={`justify-center space-y-1 items-center flex flex-col`}
            >
              {contentArray.map((content, index) => {
                return (
                  <button key={index} className="hover:underline">
                    {content}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
