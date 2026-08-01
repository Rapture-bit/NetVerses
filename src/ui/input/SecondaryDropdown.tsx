import { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function SecondaryDropdown({
  children,
  showDropdownMenu,
  setShowMenu,
  buttonRef,
  openSide,
  position,
  setPosition,
  TWStyling,
}: any) {
  const menuRef = useRef(null);
  const subMenuRef = useRef(null);

  useEffect(() => {
    const changePosition = () => {
      if (!menuRef.current || !subMenuRef.current) return;
      if (openSide === "up") {
        menuRef.current.style.setProperty("bottom", position.top);
        subMenuRef.current.style.setProperty(
          "maxHeight",
          `${position.spaceAbove - 10}px`,
        );
      } else if (openSide === "down") {
        menuRef.current.style.setProperty("top", position.top);
        subMenuRef.current.style.setProperty(
          "maxHeight",
          `${position.spaceBelow - 10}px`,
        );
      }

      menuRef.current.style.setProperty("left", position.left - 38);
    };

    changePosition();
  }, [position]);

  useEffect(() => {
    const handleResize = () => {
      if (buttonRef.current && menuRef.current && subMenuRef.current) {
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

        if (openSide === "up") {
          menuRef.current.style.setProperty("bottom", position.top);
          subMenuRef.current.style.setProperty(
            "maxHeight",
            `${position.spaceAbove - 10}px`,
          );
        } else if (openSide === "down") {
          menuRef.current.style.setProperty("top", position.top);
          subMenuRef.current.style.setProperty(
            "maxHeight",
            `${position.spaceBelow - 10}px`,
          );
        }

        menuRef.current.style.setProperty("left", position.left - 38);
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
      <AnimatePresence>
        {showDropdownMenu && (
          <motion.div
            id="dropdown-menu"
            key="dropdown-menu"
            ref={menuRef}
            className={`absolute ${openSide === "up" ? "translate-y-10" : "translate-y-2"} border-[0.1px] backgroundColor dark:border-[#313131] border-[#a8a8a8] text-sm flex justify-center items-center rounded-lg z-[9999] ${TWStyling}`}
            initial={{ opacity: 0, y: openSide === "up" ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: openSide === "up" ? 10 : -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div
              ref={subMenuRef}
              className={`flex flex-col space-y-1 p-3 overflow-y-auto`}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
