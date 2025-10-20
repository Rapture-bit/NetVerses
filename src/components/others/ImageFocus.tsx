import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Tooltip } from "antd";

type Props = {
  onImage?: string;
  onClose?: () => void;
  comment?: string;
};

const ImageFocus = ({ onImage, comment, onClose }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  useEffect(() => {
    if (onImage) {
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsOpen(false);
      document.body.style.overflow = "auto";
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        closeModal();
      }
    };

    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
      document.body.style.overflow = "auto";
    };
  }, [onImage]);

  const closeModal = () => {
    setIsOpen(false);
    onClose && onClose();
    document.body.style.overflow = "auto";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="image-focus"
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          onClick={closeModal}
        >
          <div className="flex flex-row justify-center items-center space-x-4">
            <Tooltip
              mouseLeaveDelay={0}
              title="Previous"
              placement="bottom"
              arrow={false}
            >
              <button
                className="p-0 bg-transparent border-none flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Left arrow clicked");
                }}
              >
                <span className="icon-[tabler--arrow-left] h-7 w-7 cursor-pointer text-white hover:scale-110 transition-transform" />
              </button>
            </Tooltip>

            <div
              className="duration-300 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={onImage}
                className="max-w-full max-h-80 rounded-lg shadow-lg"
                src={onImage}
                alt="Focused"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              />
              {comment && (
                <motion.span
                  className="text-white mt-2 block text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {comment}
                </motion.span>
              )}
            </div>

            <Tooltip
              mouseLeaveDelay={0}
              title="Next"
              placement="bottom"
              arrow={false}
            >
              <button
                className="p-0 bg-transparent border-none flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Right arrow clicked");
                }}
              >
                <span className="icon-[tabler--arrow-right] h-7 w-7 cursor-pointer text-white hover:scale-110 transition-transform" />
              </button>
            </Tooltip>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageFocus;
