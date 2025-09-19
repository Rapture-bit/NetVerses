import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

interface DropdownProps {
  contentArray: any[];
  setOption: Function;
  sharedList?: any[];
  openSide: string;
  clearTrigger?: any;
  size: string;
  TWStyling?: string;
  primaryOption: string;
  currentOption: string;
}

export default function Dropdown({
  contentArray,
  primaryOption,
  openSide,
  size,
  TWStyling,
  clearTrigger,
  currentOption,
  setOption,
}: DropdownProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    primaryOption,
  );
  const [showDropdownMenu, setShowMenu] = useState<boolean>(false);
  const [textSize, _] = useState<string>(size);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    spaceAbove: window.innerHeight,
    spaceBelow: window.innerHeight,
  });

  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const selectOption = (content) => {
    setSelectedOption(content);
    setOption(content);
  };

  useEffect(() => {
    if (clearTrigger !== undefined) {
      setSelectedOption(primaryOption);
    }
  }, [clearTrigger]);

  useEffect(() => {
    let foundOption = false;
    contentArray.forEach((content, index) => {
      if (content === currentOption) {
        foundOption = true;
      }
    });
    if (!foundOption) {
      setSelectedOption(primaryOption);
    }
  }, [currentOption]);

  const toggleDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;

      setPosition({
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        spaceAbove,
        spaceBelow,
      });
    }
    setShowMenu(!showDropdownMenu);
  };

  useEffect(() => {
    const handleResize = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();

        const spaceAbove = rect.top;
        const spaceBelow = window.innerHeight - rect.bottom;

        setPosition({
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY,
          spaceAbove,
          spaceBelow,
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
            className={`fixed overflow-y-auto border-[0.1px] backgroundColor dark:border-[#313131] border-[#a8a8a8] text-sm flex justify-center items-center p-3.5 rounded-lg z-[9999]`}
            initial={{ opacity: 0, y: openSide === "up" ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              bottom:
                openSide === "up"
                  ? `calc(100vh - ${position.top}px + 10px)`
                  : undefined,
              top:
                openSide === "down"
                  ? `calc(${position.top}px + 25px)`
                  : undefined,
              left: position.left - 38,
              maxHeight:
                openSide === "up"
                  ? `${position.spaceAbove - 10}px`
                  : `${position.spaceBelow - 10}px`,
            }}
            exit={{ opacity: 0, y: openSide === "up" ? 10 : -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div
              className={`justify-center space-y-1.5 items-center flex flex-col`}
            >
              {contentArray.map((content, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-row items-center w-full"
                  >
                    <span className="flex justify-center items-center w-5 mr-2">
                      {content === selectedOption && (
                        <span className="icon-[gridicons--checkmark]"></span>
                      )}
                    </span>
                    <button
                      key={index}
                      onClick={() => {
                        selectOption(content);
                      }}
                      className={`hover:underline ${content == selectedOption ? "font-medium" : "font-normal"}`}
                    >
                      {content}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
