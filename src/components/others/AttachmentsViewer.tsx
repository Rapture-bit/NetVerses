import React, { useRef, useEffect, useState } from "react";
import AttachmentFocus from "./AttachmentFocus";
import { motion, AnimatePresence } from "framer-motion";

import { Tooltip } from "antd";

const imageTypes = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "bmp",
  "tiff",
  "webp",
  "svg",
  "heic",
  "ico",
];

const videoTypes = [
  "mp4",
  "mov",
  "avi",
  "mkv",
  "flv",
  "wmv",
  "webm",
  "m4v",
  "mpeg",
  "3gp",
];

const AttachmentsViewer = ({ attachments, author, id }) => {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [focusedAttachmentDetails, setFocusedAttachmentDetails] = useState<
    Array<{}>
  >({
    id: "",
    index: null,
  });
  const [attachmentsType, setAttachmentsType] = useState<Object[]>([]);
  const [imageAttachmentTypes, setImageAttachmentTypes] = useState<Object[]>(
    [],
  );
  const [videoAttachmentTypes, setVideoAttachmentTypes] = useState<Object[]>(
    [],
  );

  const [currentScrollWidth, setScrollWidth] = useState<number>(0);
  const [maxScrollWidth, setMaxScrollWidth] = useState<number>(1000);

  const compareSrc = (element, srcUrl): boolean => {
    let elementLength: number = element.length;
    let currentIndex: number = 1;

    let valid: boolean = true;

    while (currentIndex !== elementLength + 1 && valid) {
      if (
        element[elementLength - currentIndex] ===
        srcUrl[srcUrl.length - currentIndex]
      ) {
        valid = true;
      } else {
        valid = false;
      }
      currentIndex += 1;
    }

    return valid;
  };

  useEffect(() => {
    if (!scrollContainer) return;

    const handleScroll = () => {
      setMaxScrollWidth(
        scrollContainer?.current?.scrollWidth -
          scrollContainer?.current.clientWidth,
      );
      setScrollWidth(scrollContainer?.current?.scrollLeft);
    };

    scrollContainer.current.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer?.current?.removeEventListener("scroll", handleScroll);
    };
  }, [currentScrollWidth]);

  useEffect(() => {
    const typesObject = [];
    const imageTypesObject = [];
    const videoTypesObject = [];

    attachments.map((element, index) => {
      let array = {
        id: element.id,
        type: null,
        videoType: null,
        attachmentDetails: {
          comment: element.comment,
          src: element.URL,
        },
      };

      let isImage;
      let isVideo;
      let videoType;

      imageTypes.some((typeElement) => {
        const isEqual = compareSrc(typeElement, element.URL);
        if (isEqual) {
          isImage = true;
          isVideo = false;
          return true;
        } else {
          isImage = false;
          return false;
        }
      });

      videoTypes.some((typeElement) => {
        const isEqual = compareSrc(typeElement, element.URL);
        console.log(isEqual);
        if (isEqual) {
          isImage = false;
          isVideo = true;
          videoType = typeElement;
          return true;
        } else {
          isVideo = false;
          videoType = null;
          return false;
        }
      });

      array.type = isImage ? "img" : "vid";
      if (isVideo) {
        array.videoType = videoType;
      } else {
        array.videoType = null;
      }

      if (isImage) {
        imageTypesObject.push(array);
      }

      if (isVideo) {
        videoTypesObject.push(array);
      }

      typesObject.push(array);
    });

    setAttachmentsType(typesObject);
    setVideoAttachmentTypes(videoTypesObject);
    setImageAttachmentTypes(imageTypesObject);
  }, [attachments]);

  const findIndexFromAttachmentId = (attachmentId: string) => {
    if (!attachmentId) return;

    const attachmentIndex = attachments.findIndex((element) => {
      if (element.id === attachmentId) {
        return true;
      } else {
        return false;
      }
    });

    if (attachmentIndex !== -1) {
      console.log(attachmentIndex);
      return attachmentIndex;
    } else {
      return null;
    }
  };

  const setAttachmentToFocus = (id: string, index: number | null) => {
    setFocusedAttachmentDetails({
      id,
      index,
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAttachmentToFocus(
      e.currentTarget.id,
      findIndexFromAttachmentId(e.currentTarget.id),
    );
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainer.current) {
      const scrollAmount = scrollContainer.current.offsetWidth / 2; // adjust scroll step
      scrollContainer.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <AttachmentFocus
        onClose={() => setFocusedAttachmentDetails({ id: null })}
        attachments={attachmentsType}
        attachmentIndex={focusedAttachmentDetails.index}
      />

      <div className="relative mt-3">
        <AnimatePresence>
          {currentScrollWidth > 0 && (
            <Tooltip
              mouseLeaveDelay={0}
              title="Previous"
              placement="bottom"
              arrow={false}
            >
              <motion.button
                initial={{ opacity: 0, x: -20, y: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full hover:bg-opacity-70"
                onClick={() => scroll("left")}
              >
                <span className="icon-[tabler--arrow-left] h-7 w-7 cursor-pointer text-white hover:scale-110 transition-transform" />
              </motion.button>
            </Tooltip>
          )}
        </AnimatePresence>

        <div
          ref={scrollContainer}
          className="flex items-center gap-3 overflow-x-scroll scrollbar-hidden scroll-smooth py-2"
        >
          {imageAttachmentTypes.map((attachment, index) => (
            <img
              crossOrigin="anonymous"
              key={index}
              onClick={handleClick}
              className="rounded-lg cursor-pointer hover:brightness-90 duration-300 transition-all w-64 h-40 object-cover flex-shrink-0"
              id={attachment.id}
              title={attachment.attachmentDetails.comment}
              src={attachment.attachmentDetails.src}
              alt={attachment.attachmentDetails.comment}
            />
          ))}
          {videoAttachmentTypes.map((attachment, index) => (
            <video
              crossOrigin="anonymous"
              onClick={handleClick}
              key={index}
              className="rounded-lg cursor-pointer hover:brightness-90 duration-300 transition-all w-64 h-40 object-cover flex-shrink-0"
              id={attachment.id}
              title={attachment.attachmentDetails.comment}
              controls
            >
              <source
                src={attachment.attachmentDetails.src}
                type={`video/${attachment.videoType}`}
              />
            </video>
          ))}
        </div>

        <AnimatePresence>
          {currentScrollWidth < maxScrollWidth && (
            <Tooltip
              mouseLeaveDelay={0}
              title="Next"
              placement="bottom"
              arrow={false}
            >
              <motion.button
                initial={{ opacity: 0, x: 20, y: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full hover:bg-opacity-70"
                onClick={() => scroll("right")}
              >
                <span className="icon-[tabler--arrow-right] h-7 w-7 cursor-pointer text-white hover:scale-110 transition-transform" />
              </motion.button>
            </Tooltip>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AttachmentsViewer;
