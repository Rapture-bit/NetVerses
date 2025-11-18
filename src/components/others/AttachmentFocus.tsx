import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";
import { Tooltip } from "antd";

interface AttachmentDetails {
  comment: string;
  src: string | undefined;
}

interface Attachment {
  id: string;
  type: string | null;
  videoType: null;
  attachmentDetails: AttachmentDetails;
}

type Props = {
  attachmentIndex: number;
  onClose: () => void;
  attachments: Attachment[];
};

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

const AttachmentFocus = ({ attachmentIndex, attachments, onClose }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [direction, setDirection] = useState<number>(0); // -1 = left, 1 = right

  useEffect(() => {
    if (attachmentIndex === -1) return;
    setCurrentIndex(attachmentIndex);
  }, [attachmentIndex]);

  const onNext = () => {
    if (currentIndex < attachments.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const onPrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentAttachment = attachments[currentIndex];

  useEffect(() => {
    if (currentAttachment) {
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsOpen(false);
      document.body.style.overflow = "auto";
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
      document.body.style.overflow = "auto";
    };
  }, [currentAttachment]);

  const closeModal = () => {
    setIsOpen(false);
    onClose && onClose();
    document.body.style.overflow = "auto";
  };

  const glideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return ReactDOM.createPortal(
    <AnimatePresence initial={false} custom={direction}>
      {isOpen && currentAttachment && (
        <motion.div
          key="image-focus"
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-[999]"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          onClick={closeModal}
        >
          <div className="flex flex-row justify-center items-center space-x-4 relative">
            {/* Previous Button */}
            {currentIndex !== 0 && (
              <Tooltip
                mouseLeaveDelay={0}
                title="Previous"
                placement="bottom"
                arrow={false}
              >
                <button
                  className="
        absolute top-1/2 -left-5 -translate-y-1/2
        p-0 bg-transparent border-none flex items-center justify-center z-20
      "
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrevious();
                  }}
                >
                  <span className="icon-[tabler--arrow-left] h-7 w-7 cursor-pointer text-white hover:scale-110 transition-transform" />
                </button>
              </Tooltip>
            )}

            {/* Attachment */}
            <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentAttachment.id}
                  custom={direction}
                  variants={glideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }} // slower glide
                >
                  {currentAttachment.type === "img" && (
                    <img
                      src={currentAttachment.attachmentDetails.src}
                      alt="Focused"
                      className="w-[90vw] max-w-[500px]
          sm:w-[70vw] sm:max-w-[600px]
          md:w-[60vw] md:max-w-[700px]
          lg:w-[50vw] lg:max-w-[800px]
          xl:w-[40vw] xl:max-w-[900px]
          max-h-[70vh] 
          object-contain"
                    />
                  )}
                  {currentAttachment.type === "vid" && (
                    <video
                      src={currentAttachment.attachmentDetails.src}
                      className="
          w-[90vw] max-w-[500px]
          sm:w-[70vw] sm:max-w-[600px]
          md:w-[60vw] md:max-w-[700px]
          lg:w-[50vw] lg:max-w-[800px]
          xl:w-[40vw] xl:max-w-[900px]
          max-h-[70vh]
          object-contain"
                      controls
                    />
                  )}
                  {currentAttachment.attachmentDetails.comment && (
                    <span className="text-white mt-2 block text-center">
                      {currentAttachment.attachmentDetails.comment}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {currentIndex !== attachments.length - 1 && (
              <Tooltip
                mouseLeaveDelay={0}
                title="Next"
                placement="bottom"
                arrow={false}
              >
                <button
                  className="
        absolute top-1/2 -right-8 -translate-y-1/2
        p-0 bg-transparent border-none flex items-center justify-center z-20
      "
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                >
                  <span className="icon-[tabler--arrow-right] h-7 w-7 cursor-pointer text-white hover:scale-110 transition-transform" />
                </button>
              </Tooltip>
            )}

            <div
              onClick={(e) => e.stopPropagation()}
              className="darkerBackgroundColor fixed top-4 right-4 w-1/4 max-w-[250px] p-2 rounded-md z-50"
            >
              <div className="flex flex-row justify-between">
                <span className="text-white font-bold">Xenon</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default AttachmentFocus;
