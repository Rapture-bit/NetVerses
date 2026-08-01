import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import AttachmentFocus from "./AttachmentFocus";
import { motion, AnimatePresence } from "framer-motion";

import ThreeDModelAttachment from "@/ui/post/3D/3DModelAttachment";
import { AttachmentProps } from "./AttachmentFocus";

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

const threeDModelTypes = ["glb", "gltf", "obj", "g3d", "fbx", "stl", "ply"];

interface focusedAttachmentDetails {
  id: string;
  index: number | null;
}

const repeatedTimes = 10;

const AttachmentsViewer = ({ attachments, colorProfile, postDetails }) => {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [focusedAttachmentDetails, setFocusedAttachmentDetails] =
    useState<focusedAttachmentDetails>({
      id: "",
      index: null,
    });
  const [attachmentsType, setAttachmentsType] = useState<AttachmentProps[]>([]);
  const [imageAttachmentTypes, setImageAttachmentTypes] = useState<Object[]>(
    [],
  );
  const [videoAttachmentTypes, setVideoAttachmentTypes] = useState<Object[]>(
    [],
  );
  const [ThreeDAttachmentTypes, setThreeDAttachmentTypes] = useState<Object[]>(
    [],
  );

  const [showRightButton, setShowRightButton] = useState<boolean>(false);
  const [showLeftButton, setShowLeftButton] = useState<boolean>(false);

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

  const checkScroll = () => {
    const maxScroll =
      scrollContainer?.current?.scrollWidth -
      scrollContainer?.current?.clientWidth;
    const scrollWidth = scrollContainer?.current?.scrollLeft;
    console.log(maxScroll, scrollWidth);

    if (scrollWidth === 0) {
      setShowRightButton(true);
      setShowLeftButton(false);
    } else if (scrollWidth === maxScroll) {
      setShowLeftButton(true);
      setShowRightButton(false);
    } else if (scrollWidth < maxScroll) {
      setShowRightButton(true);
      setShowLeftButton(true);
    }
  };

  useEffect(() => {
    if (!scrollContainer) return;

    let times = 0;
    const intervalID = setInterval(() => {
      if (times >= repeatedTimes) clearInterval(intervalID);
      checkScroll();
      times += 1;
    }, 0.35 * 1000);
  }, [scrollContainer]);

  useEffect(() => {
    if (!scrollContainer) return;

    const handleScroll = () => {
      let times = 0;
      const intervalID = setInterval(() => {
        if (times >= repeatedTimes) clearInterval(intervalID);
        checkScroll();
        times += 1;
      }, 0.35 * 1000);
    };

    scrollContainer.current.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      scrollContainer?.current?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const typesObject = [];
    const imageTypesObject = [];
    const videoTypesObject = [];
    const threeDModelTypesObject = [];

    attachments.map((element, index) => {
      let array = {
        id: element.id,
        isAI: element.isAI,
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
      let isThreeDModel;

      threeDModelTypes.some((typeElement) => {
        const isEqual = compareSrc(typeElement, element.URL);
        if (isEqual) {
          isThreeDModel = true;
          isImage = false;
          isVideo = false;
          return true;
        } else {
          isThreeDModel = false;
          return false;
        }
      });

      imageTypes.some((typeElement) => {
        const isEqual = compareSrc(typeElement, element.URL);
        if (isEqual) {
          isImage = true;
          isVideo = false;
          isThreeDModel = false;
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
          isThreeDModel = false;
          videoType = typeElement;
          return true;
        } else {
          isVideo = false;
          videoType = null;
          return false;
        }
      });

      array.type = isImage
        ? "image"
        : isVideo
          ? "video"
          : isThreeDModel
            ? "3dmodel"
            : null;
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

      if (isThreeDModel) {
        threeDModelTypesObject.push(array);
      }

      typesObject.push(array);
    });

    setAttachmentsType(typesObject);
    setVideoAttachmentTypes(videoTypesObject);
    setImageAttachmentTypes(imageTypesObject);
    setThreeDAttachmentTypes(threeDModelTypesObject);
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
        onClose={() => setFocusedAttachmentDetails({ id: null, index: null })}
        colorProfile={colorProfile}
        postDetails={postDetails}
        attachments={attachmentsType}
        attachmentIndex={focusedAttachmentDetails.index}
      />

      <div className="relative mt-3">
        <AnimatePresence>
          {showLeftButton && (
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
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-1/2 z-10 p-2 rounded-full hover:bg-opacity-70"
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
          {ThreeDAttachmentTypes.map((attachment: AttachmentProps, index) => (
            <>
              <ThreeDModelAttachment
                key={index}
                onClick={handleClick}
                attachment={attachment}
              />
            </>
          ))}
          {imageAttachmentTypes.map((attachment: AttachmentProps, index) => (
            <>
              <img
                crossOrigin="anonymous"
                key={index}
                onClick={handleClick}
                className={`${attachment.isAI ? "border-2 border-red-500" : ""} rounded-lg cursor-pointer hover:brightness-90 duration-300 transition-all w-64 h-40 object-cover flex-shrink-0`}
                id={attachment.id}
                title={attachment.attachmentDetails.comment}
                src={attachment.attachmentDetails.src}
                alt={attachment.attachmentDetails.comment}
              />
            </>
          ))}
          {videoAttachmentTypes.map((attachment: AttachmentProps, index) => (
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
          {showRightButton && (
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
                className="absolute right-0 top-1/2 z-10 p-2 rounded-full hover:bg-opacity-70"
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
