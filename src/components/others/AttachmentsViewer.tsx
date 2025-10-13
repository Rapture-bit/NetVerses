import React, { useRef } from "react";
import ImageFocus from "./ImageFocus";
import { useState } from "react";

const AttachmentsViewer = ({ attachments, author, id }) => {
  const scrollContainer = useRef(null);
  const [focusedImageDetails, setFocusedImageDetails] = useState({
    comment: "",
    src: "",
  });

  const setImageToFocus = (src, comment) => {
    if (comment) {
      setFocusedImageDetails({
        src: src,
        comment: comment,
      });
    } else {
      setFocusedImageDetails({
        src: src,
        comment: null,
      });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    setImageToFocus(e.currentTarget.src, e.currentTarget.title);
  };

  return (
    <>
      <ImageFocus
        onClose={() => setFocusedImageDetails({ src: null, comment: null })}
        comment={focusedImageDetails.comment}
        onImage={focusedImageDetails.src}
      />

      <div className="relative">
        <div
          ref={scrollContainer}
          className="flex mt-3 gap-3 overflow-x-scroll scrollbar-hidden scroll-smooth"
        >
          {attachments.images.map((image, index) => (
            <img
              crossOrigin="anonymous"
              key={index}
              onClick={handleClick}
              className="rounded-lg cursor-pointer hover:brightness-90 duration-300 transition-all w-1/3 shrink-0"
              title={image.comment}
              src={image.URL}
              alt={image.comment}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default AttachmentsViewer;
