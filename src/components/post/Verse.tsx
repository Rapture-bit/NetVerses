import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import React, { useState, useEffect, useLayoutEffect, useContext } from "react";

import useDeviceType from "@/hooks/useDeviceType";
import TextArea from "@/components/input/TextArea";

import { ThemeContext } from "@/context/ThemeContext";
import { AnimateContext } from "@/context/AnimateContext";

import { useTranslation } from "react-i18next";

interface VerseProps {
  id?: string;
  isComment: boolean;
}

const TEST_ANIM =
  "https://lottie.host/79c83346-aa45-47d0-80b9-c9f5b90b8ee6/UdXjIq2lTO.lottie";

export default function Verse({ id, isComment }: VerseProps) {
  const { t } = useTranslation();
  const { colorProperties } = useContext(ThemeContext);
  const { setAnimSrc, animSrc, loaded, setLoaded, currentRef } =
    useContext(AnimateContext);
  const { deviceType, isTouchScreen } = useDeviceType();
  const [isItalic, setIsItalic] = useState<string>("italic");
  const [avatar, setAvatar] = useState<string>("/images/avatars/default.jpg");
  const [username, setUsername] = useState<string>("Xenon");

  const [textAdded, setTextAdded] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("");

  const [isMediaMenuOpen, setMediaMenuOpen] = useState<boolean>(false);
  const [isEmojiMenuOpen, setEmojiMenuOpen] = useState<boolean>(false);

  const buttons = [
    {
      title: "Emoji",
      iconClass: "icon-[mdi--emoji-outline]",
      hover: "hover:text-yellow-500",
    },
    {
      title: "Add Media",
      iconClass: "icon-[fluent-mdl2--media-add]",
      hover: "hover:text-green-500",
    },
    {
      title: "Ephemeral Post",
      iconClass: "icon-[ph--hourglass-bold]",
      hover: "hover:text-red-500",
    },
    {
      title: "Change Visibility",
      iconClass: "icon-[material-symbols--public]",
      hover: "hover:text-blue-500",
    },
    {
      title: "Advanced",
      iconClass: "icon-[fluent--options-16-regular]",
      hover: "hover:text-orange-500",
    },
  ];

  useEffect(() => {
    if (loaded && currentRef) {
      try {
        currentRef.play();
      } catch (err) {
        console.error("[VerseButton] play() failed:", err);
      }
      setLoaded(false);
    }
  }, [currentRef, loaded, setLoaded]);

  function verseInputChanged(e) {
    var input;
    input = e.target.value.trim();

    setIsItalic(input ? "not-italic" : "italic");
  }

  useLayoutEffect(() => {
    const updateColors = () => {
      setTextColor(colorProperties.textColor);
    };

    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (deviceType === "mobile" && isTouchScreen) {
    return null;
  }

  const onVerse = () => {
    setAnimSrc(TEST_ANIM);
    currentRef?.play();
  };

  return (
    <>
      <div className="relative flex flex-col p-4 sm:pl-5 border border-neutral-700 sm:py-4 rounded-md mx-4 sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor">
        <div className="flex items-start space-x-4">
          <Link
            to={`/${username}`}
            className="flex-shrink-0 hover:opacity-85 duration-300 transition-all"
          >
            <img
              src={avatar}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full select-none"
              alt="User Avatar"
              draggable="false"
            />
          </Link>

          <div className="flex-1 mt-1.5">
            <TextArea
              minHeight={43}
              addText={textAdded}
              onChange={(e) => {
                verseInputChanged(e);
              }}
              placeholder={
                isComment ? t("input.comment") : t("input.versesInput")
              }
              className={`!bg-transparent pl-0 overflow-hidden resize-none select-none ${isItalic} border-none outline-none focus:border-none dark:text-white opacity-95 w-full text-lg placeholder:text-gray-500`}
            />
          </div>
        </div>

        <div id={id} className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {buttons.map((btn, i) => (
              <Tooltip
                key={i}
                title={btn.title}
                mouseLeaveDelay={0}
                placement="bottom"
                arrow={false}
              >
                <button
                  aria-label={btn.title}
                  className={`relative p-2 rounded-xl bg-transparent hover:bg-[var(--button-hover-bg,#f3f3f3)] dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-300 transition-all duration-300 ease-in-out transform hover:-translate-y-[1px] active:scale-95 ${btn.hover}`}
                >
                  <span
                    className={`${btn.iconClass} block w-5 h-5 sm:w-5 sm:h-5`}
                  ></span>
                </button>
              </Tooltip>
            ))}
          </div>

          <button
            aria-label="Verse"
            onClick={onVerse}
            className="relative ml-auto border border-violet-600 text-violet-500 hover:text-white rounded-xl py-2 px-6 overflow-hidden transition-all duration-300 group font-medium"
          >
            <span className="absolute inset-0 bg-violet-600 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 rounded-xl"></span>
            <span className="relative z-10">
              {isComment ? "Comment" : "Verse"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
