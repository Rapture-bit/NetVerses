import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Tooltip from "@/ui/Tooltip";
import SecondaryDropdown from "@/ui/input/SecondaryDropdown";
import TextArea from "@/ui/input/TextArea";

export default function VerseMenu({
  userDetails,
  visible,
  setIsOpen,
  ...props
}: any) {
  const { t } = useTranslation();

  const [isEmojiOpen, setEmojiOpen] = useState<boolean>(false);
  const [GIFOpen, setGIFOpen] = useState<boolean>(false);
  const [EphemeralOpen, setEphemeralOpen] = useState<boolean>(false);
  const [VisibilityOpen, setVisibilityOpen] = useState<boolean>(false);
  const [StylingOpen, setStylingOpen] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<string>("italic");
  const [isVerseDisabled, setVerseDisabled] = useState<boolean>(true);
  const [tagsDropdownMenuVisibility, setTagsDropdownMenuVisibility] =
    useState<boolean>(false);
  const [textAdded, setTextAdded] = useState<string>("");
  const [numOfCharacters, setNumOfCharacters] = useState<number>(0);
  const [maxCharactersAllowed, setMaxCharactersAllowed] = useState<number>(500);
  const [progressColours, setProgressColours] = useState({
    text: "text-neutral-600",
    bg: "bg-neutral-600",
    shadow: "shadow-neutral-600",
  });
  const [tagsMenuPos, setTagsMenuPos] = useState({
    top: 0,
    left: 0,
    spaceAbove: window.innerHeight,
    spaceBelow: window.innerHeight,
  });
  const [getStarPlus, setGetStarPlus] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("Xenon");
  const [avatar, setAvatar] = useState<string>("/images/avatars/default.jpg");

  const EmojiButtonRef = useRef(null);
  const BottomMenuRef = useRef(null);
  const TagsButtonRef = useRef(null);

  const buttons = [
    {
      title: "Emoji",
      iconClass: "icon-[mdi--emoji-outline]",
    },
    {
      title: "Add Media",
      iconClass: "icon-[pajamas--media]",
    },
    {
      title: "Ephemeral Post",
      iconClass: "icon-[ph--hourglass-bold]",
    },
    {
      title: "Change Visibility",
      iconClass: "icon-[material-symbols--public]",
    },
    {
      title: "Advanced Styling",
      iconClass: "icon-[fluent--options-16-regular]",
    },
  ];

  const toggleTagsMenu = () => {
    if (TagsButtonRef.current) {
      const rect = TagsButtonRef.current.getBoundingClientRect();
      const viewportHeight =
        window.visualViewport?.height || window.innerHeight;
      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;

      setTagsMenuPos({
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        spaceAbove,
        spaceBelow,
      });
    }
    setTagsDropdownMenuVisibility(!tagsDropdownMenuVisibility);
  };

  const toggleEmojiMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEmojiOpen(!isEmojiOpen);
  };

  const toggleGIFMenu = () => setGIFOpen(!GIFOpen);
  const toggleStylingMenu = () => setStylingOpen(!StylingOpen);
  const toggleEphemeralMenu = () => setEphemeralOpen(!EphemeralOpen);
  const toggleVisibilityMenu = () => setVisibilityOpen(!VisibilityOpen);

  function verseInputChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const input = e.currentTarget.value.trim();
    if (input && input.length > 0) {
      setVerseDisabled(false);
    } else {
      setVerseDisabled(true);
    }
    setIsItalic(input ? "not-italic" : "italic");
    setNumOfCharacters(input.length);
  }

  useEffect(() => {
    if (!BottomMenuRef.current) return;

    const bottomMenu = BottomMenuRef.current;
    const menuRect = bottomMenu.getBoundingClientRect();
    const top = menuRect.top + window.scrollY;

    if (numOfCharacters > maxCharactersAllowed) {
      setVerseDisabled(true);
      setGetStarPlus(true);
      setProgressColours({
        bg: "bg-red-700",
        text: "text-red-700",
        shadow: "shadow-red-700",
      });
    } else {
      setGetStarPlus(false);
      if (numOfCharacters <= 0) {
        setProgressColours({
          bg: "bg-neutral-700",
          text: "text-neutral-700",
          shadow: "shadow-neutral-700",
        });
      } else {
        setProgressColours({
          bg: "bg-violet-700",
          text: "text-violet-700",
          shadow: "shadow-violet-700",
        });
      }
    }
  }, [numOfCharacters]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="pointer-events-auto w-full max-w-2xl"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <Link
                    to={`/${username}`}
                    className="flex-shrink-0 hover:opacity-80 transition-opacity duration-200"
                  >
                    <img
                      src={avatar}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-violet-500 transition-all duration-200"
                      alt="User Avatar"
                      draggable="false"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <TextArea
                      minHeight={43}
                      maxHeight={200}
                      addText={textAdded}
                      onChange={verseInputChanged}
                      placeholder={
                        t("input.versesInput") || "What's on your mind?"
                      }
                      className={`
                        w-full
                        bg-transparent
                        pl-0
                        border-none
                        outline-none
                        focus:ring-0
                        text-base sm:text-lg
                        text-gray-900 dark:text-white
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        resize-none
                        ${isItalic}
                        leading-relaxed
                      `}
                    />

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          ref={TagsButtonRef}
                          onClick={toggleTagsMenu}
                          className="
                            group
                            flex items-center
                            gap-1.5
                            px-3 py-1.5
                            rounded-full
                            text-xs font-medium
                            text-gray-600 dark:text-gray-400
                            hover:text-violet-600 dark:hover:text-violet-400
                            hover:bg-violet-50 dark:hover:bg-violet-500/10
                            transition-all duration-200
                            border border-gray-200 dark:border-gray-700
                            hover:border-violet-300 dark:hover:border-violet-500
                          "
                        >
                          <span className="icon-[ic--round-add] w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                          <span>Add hashtags</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <span
                          className={`${progressColours.text} text-xs font-medium`}
                        >
                          {numOfCharacters}/{maxCharactersAllowed}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-1">
                    {buttons.map((btn, i) => (
                      <Tooltip key={i} label={btn.title}>
                        <button
                          aria-label={btn.title}
                          onClick={() => {
                            if (btn.title === "Emoji") toggleEmojiMenu;
                            else if (btn.title === "Add Media") toggleGIFMenu;
                            else if (btn.title === "Ephemeral Post")
                              toggleEphemeralMenu;
                            else if (btn.title === "Change Visibility")
                              toggleVisibilityMenu;
                            else if (btn.title === "Advanced Styling")
                              toggleStylingMenu;
                          }}
                          className="
                            group
                            relative
                            p-2
                            rounded-full
                            text-gray-500 dark:text-gray-400
                            hover:text-violet-600 dark:hover:text-violet-400
                            hover:bg-violet-50 dark:hover:bg-violet-500/10
                            transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-violet-500/20
                          "
                        >
                          <span className={`${btn.iconClass} w-5 h-5`} />
                        </button>
                      </Tooltip>
                    ))}
                  </div>

                  <button
                    disabled={isVerseDisabled}
                    onClick={() => console.log("Verse Posted")}
                    className="
                      flex items-center gap-2
                      px-5 py-2.5
                      rounded-full
                      text-sm font-semibold
                      bg-gradient-to-r from-violet-600 to-purple-600
                      text-white
                      shadow-lg shadow-violet-500/30
                      hover:shadow-violet-500/50
                      hover:scale-105
                      active:scale-95
                      transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                      focus:outline-none focus:ring-2 focus:ring-violet-500/30
                    "
                  >
                    <span className="icon-[ic--round-send] w-4 h-4" />
                    Verse
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
