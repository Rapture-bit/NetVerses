import React, { useState, useEffect } from "react";

type Props = {
  onImage?: string;
  onClose?: () => void;
  comment?: string;
};

const ImageFocus = ({ onImage, comment, onClose }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (onImage) {
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsOpen(false);
      document.body.style.overflow = "auto";
    }

    document.addEventListener("keyup", (event) => {
      if (
        (event.key === "Escape" || event.keyCode === 27) &&
        document.activeElement === document.body
      ) {
        closeModal();
      }
    });

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [onImage]);

  const closeModal = () => {
    setIsOpen(false);
    onClose && onClose();
    document.body.style.overflow = "auto";
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="duration-300 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{comment}</span>
            <img
              className="max-w-full max-h-80 rounded-lg"
              src={onImage}
              alt="Focused"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageFocus;
