import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface DropdownProps {
  contentArray: any[];
  setOption: Function;
  sharedList?: any[];
  openSide: string;
  clearTrigger?: any;
  size: string;
  fullWidth?: boolean;
  TWStyling?: string;
  buttonStyling?: string;
  primaryOption: string;
  currentOption: string;
}

export default function Dropdown({
  contentArray,
  primaryOption,
  openSide,
  size,
  TWStyling,
  fullWidth = false,
  buttonStyling,
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

  const { t } = useTranslation();

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
      const viewportHeight = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;

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
        const viewportHeight = window.visualViewport
          ? window.visualViewport.height
          : window.innerHeight;

        const spaceAbove = rect.top;
        const spaceBelow = viewportHeight - rect.bottom;

        setPosition({
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY,
          spaceAbove,
          spaceBelow,
        });
      }
      setShowMenu(false);
    };

    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        setShowMenu(false);
      }
    };

    const handleScroll = () => {
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

    window.addEventListener("keydown", handleEscapeKey);
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => (
      window.removeEventListener("keydown", handleEscapeKey),
      window.removeEventListener("resize", handleResize),
      window.removeEventListener("mousedown", handleClickOutside),
      window.addEventListener("scroll", handleScroll)
    );
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`text-${textSize} ${fullWidth ? "w-full" : ""}`}
      >
        <div className={`flex flex-row space-x-1 ${buttonStyling}`}>
          <span className={`text-${textSize}`}>{selectedOption}</span>
          {openSide == "up" && <UpOutlined />}
          {openSide == "down" && <DownOutlined />}
        </div>
      </button>

      <AnimatePresence>
        {showDropdownMenu && (
          <motion.div
            id="dropdown-menu"
            key="dropdown-menu"
            ref={menuRef}
            className={`fixed border-[0.1px] backgroundColor dark:border-[#313131] border-[#a8a8a8] text-sm flex justify-center items-center rounded-lg z-[9999] ${TWStyling}`}
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
            }}
            exit={{ opacity: 0, y: openSide === "up" ? 10 : -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div
              className={`flex flex-col space-y-1 p-3 overflow-y-auto`}
              style={{
                maxHeight:
                  openSide === "up"
                    ? `${position.spaceAbove - 10}px`
                    : `${position.spaceBelow - 10}px`,
              }}
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
