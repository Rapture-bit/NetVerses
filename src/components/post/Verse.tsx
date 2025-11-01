import { Tooltip } from "antd";
import React, { useState, useEffect, useLayoutEffect, useContext } from "react";

import useDeviceType from "@/hooks/useDeviceType";
import TextArea from "@/components/input/TextArea";

import { ThemeContext } from "@/context/ThemeContext";
import { AnimateContext } from "@/context/AnimateContext";

import { useTranslation } from "react-i18next";

const TEST_ANIM =
  "https://lottie.host/9155cd48-8ec3-4220-ba3b-75a6f4032ec2/tqJAFT9u9U.lottie";

export default function Verse({ isComment }) {
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
      <div className="relative flex flex-col p-4 sm:pl-5 sm:py-4 rounded-md mx-4 sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor">
        <div className="flex items-start space-x-4">
          <a
            href={`/${username}`}
            className="flex-shrink-0 hover:opacity-85 duration-300 transition-all"
          >
            <img
              src={avatar}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full select-none"
              alt="User Avatar"
              draggable="false"
            />
          </a>

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

        <div className="flex items-center justify-between space-x-4">
          <div className="flex space-x-3 sm:space-x-5">
            <Tooltip
              mouseLeaveDelay={0}
              title="Emoji"
              placement="bottom"
              arrow={false}
            >
              <button
                aria-label="Add Emoji"
                className="transition-transform duration-300 ease-in-out transform hover:rotate-12 hover:text-pink-500"
              >
                <span className="icon-[mdi--emoji-outline] block w-4 h-4 lg:w-5 lg:h-5"></span>
              </button>
            </Tooltip>
            <div
              className={`absolute top-[100%] z-50 ml-10 transition-all duration-500 ease-in-out transform ${
                isMediaMenuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            ></div>

            <div
              className={`absolute top-[100%] z-50 -translate-x-10 transition-all duration-500 ease-in-out transform ${
                isEmojiMenuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            ></div>

            <Tooltip
              mouseLeaveDelay={0}
              title="Add Media"
              placement="bottom"
              arrow={false}
            >
              <button
                aria-label="Add Media"
                className="transition-transform duration-300 ease-in-out transform hover:rotate-12 hover:text-green-500"
              >
                <span className="icon-[fluent-mdl2--media-add] block w-4 h-4 lg:w-5 lg:h-5"></span>
              </button>
            </Tooltip>

            <Tooltip
              mouseLeaveDelay={0}
              title="Ephemeral Post"
              placement="bottom"
              arrow={false}
            >
              <button
                aria-label="Ephemeral Post"
                onClick={() => setEmojiMenuOpen(false)} // Change
                className="transition-transform duration-300 ease-in-out transform hover:rotate-12 hover:text-red-500"
              >
                <span className="icon-[ph--hourglass-bold] block w-4 h-4 lg:w-5 lg:h-5"></span>
              </button>
            </Tooltip>

            <Tooltip
              mouseLeaveDelay={0}
              title="Change Visibility"
              placement="bottom"
              arrow={false}
            >
              <button
                aria-label="Change Visibility"
                onClick={() => setEmojiMenuOpen(false)} // Change
                className="transition-transform duration-300 ease-in-out transform hover:rotate-12 hover:text-blue-500"
              >
                <span className="icon-[material-symbols--public] block w-4 h-4 lg:w-5 lg:h-5"></span>
              </button>
            </Tooltip>

            <Tooltip
              mouseLeaveDelay={0}
              title="Advanced"
              placement="bottom"
              arrow={false}
            >
              <button
                aria-label="Advanced"
                onClick={() => setEmojiMenuOpen(false)} // Change
                className="transition-transform duration-300 ease-in-out transform hover:rotate-12 dark:hover:text-orange-400"
              >
                <span className="icon-[fluent--options-16-regular] block w-4 h-4 lg:w-5 lg:h-5"></span>
              </button>
            </Tooltip>
          </div>

          <button
            aria-label="Verse"
            onClick={onVerse}
            className="relative ml-auto border border-violet-600 text-violet-500 hover:text-white rounded-lg py-2 px-7 overflow-hidden transition-all duration-300 group"
          >
            <span className="absolute inset-0 bg-violet-600 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            <span className="relative">Verse</span>
          </button>
        </div>
      </div>
    </>
  );
}
