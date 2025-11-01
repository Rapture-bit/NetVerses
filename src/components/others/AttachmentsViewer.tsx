import React, { useRef, useEffect, useState } from "react";
import AttachmentFocus from "./AttachmentFocus";

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
  });
  const [attachmentsType, setAttachmentsType] = useState<Object[]>([]);
  const [imageAttachmentTypes, setImageAttachmentTypes] = useState<Object[]>(
    [],
  );
  const [videoAttachmentTypes, setVideoAttachmentTypes] = useState<Object[]>(
    [],
  );

  const findAttachmentFromId = (id) => {
    const foundElement = attachmentsType.find((element) => {
      element.id === id;
    });

    return foundElement;
  };

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

  const setAttachmentToFocus = (id: string | null) => {
    setFocusedAttachmentDetails({
      id,
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAttachmentToFocus(e.currentTarget.id);
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
        attachmentId={focusedAttachmentDetails.id}
      />

      <div className="relative mt-3">
        <Tooltip
          mouseLeaveDelay={0}
          title="Previous"
          placement="bottom"
          arrow={false}
        >
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full hover:bg-opacity-70"
            onClick={() => scroll("left")}
          >
            <span className="icon-[tabler--arrow-left] h-7 w-7 cursor-pointer text-white hover:scale-110 transition-transform" />
          </button>
        </Tooltip>

        <div
          ref={scrollContainer}
          className="flex gap-3 overflow-x-scroll scrollbar-hidden scroll-smooth"
        >
          {imageAttachmentTypes.map((attachment, index) => (
            <img
              crossOrigin="anonymous"
              key={index}
              onClick={handleClick}
              className="rounded-lg cursor-pointer hover:brightness-90 duration-300 transition-all w-1/3 shrink-0"
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
              className="rounded-lg cursor-pointer hover:brightness-90 duration-300 transition-all w-1/3 shrink-0"
              id={attachment.id}
              title={attachment.attachmentDetails.comment}
              width="320"
              height="240"
              controls
            >
              <source
                src={attachment.attachmentDetails.src}
                type={attachment.videoType}
              />
            </video>
          ))}
        </div>

        <Tooltip
          mouseLeaveDelay={0}
          title="Next"
          placement="bottom"
          arrow={false}
        >
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full hover:bg-opacity-70"
            onClick={() => scroll("right")}
          >
            <span className="icon-[tabler--arrow-right] h-7 w-7 cursor-pointer text-white hover:scale-110 transition-transform" />
          </button>
        </Tooltip>
      </div>
    </>
  );
};

export default AttachmentsViewer;
