import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";

import { Tooltip } from "antd";

interface AttachmentDetails {
  comment: string;
  src: string | undefined;
}

interface Attachments {
  id: string;
  URL: string;
  comment?: string;
}

type InteractionCounts = {
  likes: number;
  dislikes: number;
  views: number;
  boosts: number;
  comments: number;
  [key: string]: number;
};

interface Attachment {
  id: string;
  type: string | null;
  videoType: null;
  attachmentDetails: AttachmentDetails;
}

type PostProps = {
  id: number;
  type?: string;
  title?: string;
  description: string;
  author: string;
  interactions: InteractionCounts;
  attachments?: Attachments[];
  comments: Comment[];
  isNSFW: boolean;
  date: string;
  colorProfile?: string;
};

type Props = {
  attachmentIndex: number;
  onClose: () => void;
  attachments: Attachment[];
  postDetails: PostProps;
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

const AttachmentFocus = ({
  attachmentIndex,
  attachments,
  postDetails,
  onClose,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  // postDetails (for comments, author [name, logo], interactions, and etc)

  useEffect(() => {
    if (attachmentIndex === -1) return;

    console.log(attachmentIndex);
    setCurrentIndex(attachmentIndex);
  }, [attachmentIndex]);

  const findAttachmentFromIndex = () => {
    console.log(attachments[currentIndex], attachments, currentIndex);
    console.log(attachments[currentIndex]);
    return attachments[currentIndex];
  };

  const currentAttachment = findAttachmentFromIndex();

  const onNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= attachments.length) {
      return;
    }
    setCurrentIndex(nextIndex);
  };

  const onPrevious = () => {
    const previousIndex = currentIndex - 1;
    if (previousIndex < 0) return;
    setCurrentIndex(previousIndex);
  };

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

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="image-focus"
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-[999]"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          onClick={closeModal}
        >
          <div className="flex flex-row justify-center items-center space-x-4">
            {currentIndex !== 0 && (
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
                    onPrevious();
                  }}
                >
                  <span className="icon-[tabler--arrow-left] h-7 w-7 cursor-pointer text-white hover:scale-110 transition-transform" />
                </button>
              </Tooltip>
            )}

            <div
              className="duration-300 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {currentAttachment?.type === "img" && (
                <motion.img
                  key={currentAttachment?.id}
                  className="max-w-full max-h-80 rounded-lg shadow-lg"
                  src={currentAttachment?.attachmentDetails.src}
                  alt="Focused"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              {currentAttachment?.type === "vid" && (
                <motion.video
                  key={currentAttachment?.id}
                  className="max-w-full max-h-80 rounded-lg shadow-lg"
                  src={currentAttachment?.attachmentDetails.src}
                  alt="Focused"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              {currentAttachment?.type === "model" && <span>Model</span>}
              {currentAttachment?.attachmentDetails.comment && (
                <motion.span
                  className="text-white mt-2 block text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {currentAttachment?.attachmentDetails.comment}
                </motion.span>
              )}
            </div>

            {currentIndex !== attachments.length - 1 && (
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
                    onNext();
                  }}
                >
                  <span className="icon-[tabler--arrow-right] h-7 w-7 cursor-pointer text-white hover:scale-110 transition-transform" />
                </button>
              </Tooltip>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default AttachmentFocus;
