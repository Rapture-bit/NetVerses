import React from "react";
import { Tooltip } from "antd";
import { useState, useLayoutEffect, useEffect } from "react";
import useDeviceType from "@/hooks/useDeviceType";
import TextArea from "@/components/input/TextArea";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Media from "@/components/modal/Menu/Media";
import { getCssVariable } from "@/utils/getCssVariable";

export default function Verse({ isComment }) {
  const { deviceType, isTouchScreen } = useDeviceType();
  const [isItalic, setIsItalic] = useState<string>("italic");
  const [avatar, setAvatar] = useState<string>("/images/avatars/default.jpg");
  const [username, setUsername] = useState<string>("Xenon");

  const [textAdded, setTextAdded] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("");

  const [isMediaMenuOpen, setMediaMenuOpen] = useState<boolean>(false);
  const [isEmojiMenuOpen, setEmojiMenuOpen] = useState<boolean>(false);

  document.onclick = (e: MouseEvent) => {
    const target = e.target as Element | null;

    if (isEmojiMenuOpen) {
      if (
        target &&
        target["localName"] != "em-emoji-picker" &&
        target["className"] !=
          "icon-[mdi--emoji-outline] block w-4 h-4 lg:w-5 lg:h-5" &&
        !target.closest("em-emoji-picker") &&
        !target.closest(".icon-[mdi--emoji-outline].block")
      ) {
        setEmojiMenuOpen(false);
      }
    } else if (isMediaMenuOpen) {
      if (
        target &&
        target["id"] != "mediaMenu" &&
        target["className"] !=
          "icon-[fluent-mdl2--media-add] block w-4 h-4 lg:w-5 lg:h-5" &&
        !target.closest("#mediaMenu") &&
        !target.closest(".icon-[fluent-mdl2--media-add].block")
      ) {
        setMediaMenuOpen(false);
      }
    }
  };

  function verseInputChanged(e, isEmoji) {
    var input;
    if (isEmoji) {
      const sym = e.unified.split("_");
      const codeArray = [];
      sym.forEach((element) => codeArray.push("0x" + element));
      var emoji = String.fromCodePoint(...codeArray);
      input = emoji.trim();
    } else {
      input = e.target.value.trim();
    }

    setIsItalic(input ? "not-italic" : "italic");
    if (!isEmojiMenuOpen) setEmojiMenuOpen(false);
  }

  function toggleMediaMenu() {
    setMediaMenuOpen((prev) => !prev);
    setEmojiMenuOpen(false);
  }

  function toggleEmojiMenu() {
    setEmojiMenuOpen((prev) => !prev);
    setMediaMenuOpen(false);
  }

  const addEmoji = (e) => {
    const sym = e.unified.split("_");
    const codeArray = [];
    sym.forEach((element) => codeArray.push("0x" + element));
    var emoji = String.fromCodePoint(...codeArray);
    setTextAdded(emoji);
    verseInputChanged(e, true);
    setEmojiMenuOpen(false);
  };

  useLayoutEffect(() => {
    const updateColors = () => {
      setTextColor(getCssVariable("--text-color"));
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

  useEffect(() => {
    const handleScroll = () => {
      setEmojiMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (deviceType === "mobile" && isTouchScreen) {
    return null;
  }

  return (
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
              verseInputChanged(e, false);
            }}
            placeholder={
              isComment
                ? "User's comment here..."
                : "Share your updates with the universe"
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
              onClick={() => {
                toggleEmojiMenu();
              }}
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
          >
            {isMediaMenuOpen && <Media />}
          </div>

          <div
            className={`absolute top-[100%] z-50 -translate-x-10 transition-all duration-500 ease-in-out transform ${
              isEmojiMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            {isEmojiMenuOpen && (
              <Picker
                data={data}
                emojiSize={20}
                emojiButtonSize={30}
                onEmojiSelect={addEmoji}
                maxFrequentRows={0}
                theme={textColor === "#c0c0c0" ? "dark" : "light"}
              />
            )}
          </div>

          <Tooltip
            mouseLeaveDelay={0}
            title="Add Media"
            placement="bottom"
            arrow={false}
          >
            <button
              aria-label="Add Media"
              onClick={() => toggleMediaMenu()}
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
          onClick={() => setEmojiMenuOpen(false)}
          className="relative ml-auto border border-violet-600 text-violet-500 hover:text-white rounded-lg py-2 px-7 overflow-hidden transition-all duration-300 group"
        >
          <span className="absolute inset-0 bg-violet-600 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          <span className="relative">Verse</span>
        </button>
      </div>
    </div>
  );
}
