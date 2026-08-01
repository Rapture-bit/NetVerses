import { Link } from "react-router-dom";
import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  forwardRef,
} from "react";
import { useTranslation } from "react-i18next";
import Tooltip from "../Tooltip";
import EmojiMenu from "../EmojiMenu/EmojiMenu";
import GIFMenu from "../GIFMenu/GIFMenu";
import TextArea from "@/ui/input/TextArea";
import SecondaryDropdown from "../input/SecondaryDropdown";

interface VerseProps {
  id?: string;
  isComment: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Verse = forwardRef<HTMLDivElement, VerseProps>((props, ref) => {
  const { id, isComment, className, style } = props;
  const { t } = useTranslation();

  const [isItalic, setIsItalic] = useState<string>("italic");
  const [avatar, setAvatar] = useState<string>("/images/avatars/default.jpg");
  const [username, setUsername] = useState<string>("Xenon");
  const [textAdded, setTextAdded] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("");

  const [isEmojiMenuOpen, setEmojiMenuOpen] = useState<boolean>(false);
  const [isGIFMenuOpen, setGIFMenuOpen] = useState<boolean>(false);

  const [isVerseDisabled, setVerseDisabled] = useState<boolean>(true);
  const [tagsDropdownMenuVisibility, setTagsDropdownMenuVisibility] =
    useState<boolean>(false);

  const [numOfCharacters, setNumOfCharacters] = useState<number>(0);
  const [maxCharactersAllowed] = useState<number>(500);
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
  const [currentCharDivWidth, setCharDivWidth] = useState<number>(0);
  const [progressBarPosition, setProgressBarPosition] = useState<number>(117.5);
  const [getStarPlus, setGetStarPlus] = useState<boolean>(false);

  const EmojiButtonRef = useRef<HTMLButtonElement | null>(null);
  const BottomMenuRef = useRef<HTMLButtonElement | null>(null);
  const TagsButtonRef = useRef<HTMLButtonElement | null>(null);
  const MediaButtonRef = useRef<HTMLButtonElement | null>(null);
  const EphemeralButtonRef = useRef<HTMLButtonElement | null>(null);
  const VisibilityButtonRef = useRef<HTMLButtonElement | null>(null);
  const StylingButtonRef = useRef<HTMLButtonElement | null>(null);

  const buttons = [
    {
      title: "Emoji",
      ref: EmojiButtonRef,
      iconClass: "icon-[mdi--emoji-outline]",
    },
    {
      title: "Add Media",
      ref: MediaButtonRef,
      iconClass: "icon-[pajamas--media]",
    },
    {
      title: "Ephemeral Post",
      ref: EphemeralButtonRef,
      iconClass: "icon-[ph--hourglass-bold]",
    },
    {
      title: "Change Visibility",
      ref: VisibilityButtonRef,
      iconClass: "icon-[material-symbols--public]",
    },
    {
      title: "Advanced Styling",
      iconClass: "icon-[fluent--options-16-regular]",
    },
  ];

  const verseInputChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.currentTarget.value.trim();
    setVerseDisabled(!(input && input.length > 0));
    setIsItalic(input ? "not-italic" : "italic");
    setNumOfCharacters(input.length);
  };

  const toggleTagsMenu = () => {
    if (TagsButtonRef.current) {
      const rect = TagsButtonRef.current.getBoundingClientRect();
      const viewportHeight =
        window.visualViewport?.height || window.innerHeight;
      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;

      setTagsMenuPos({
        left: rect.left,
        top: rect.top,
        spaceAbove,
        spaceBelow,
      });
    }
    setTagsDropdownMenuVisibility(!tagsDropdownMenuVisibility);
  };

  const toggleGIFMenu = () => {
    setGIFMenuOpen(true);
    setEmojiMenuOpen(false);
  };

  const toggleStylingMenu = () => {
    console.log("Styling menu toggled");
  };

  const updateProgressBar = () => {
    if (!BottomMenuRef.current) return;

    const bottomMenu = BottomMenuRef.current;
    const menuRect = bottomMenu.getBoundingClientRect();
    const top = menuRect.top + window.scrollY;

    setProgressBarPosition(top - 177);

    const divWidth =
      menuRect.width *
      (Math.min(Math.max(numOfCharacters, 0), maxCharactersAllowed) /
        maxCharactersAllowed);
    setCharDivWidth(divWidth);

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
      setProgressColours(
        numOfCharacters <= 0
          ? {
              bg: "bg-neutral-700",
              text: "text-neutral-700",
              shadow: "shadow-neutral-700",
            }
          : {
              bg: "bg-violet-700",
              text: "text-violet-700",
              shadow: "shadow-violet-700",
            },
      );
    }
  };

  useEffect(() => {
    updateProgressBar();
  }, [numOfCharacters]);

  useEffect(() => {
    const onResize = () => {
      updateProgressBar();
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useLayoutEffect(() => {
    const updateColors = () => {
      // Implement color update logic
    };
    updateColors();
  }, []);

  const toggleEmojiMenu = () => {
    setEmojiMenuOpen(!isEmojiMenuOpen);
  };

  return (
    <>
      <div
        ref={ref}
        style={style}
        className={`relative flex flex-col p-4 sm:pl-5 border borderColor sm:py-4 rounded-md mx-4 sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor ${className}`}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <Link
            to={`/${username}`}
            className="flex-shrink-0 hover:opacity-80 transition-opacity duration-200"
          >
            <img
              src={avatar}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full select-none ring-2 ring-white/10 hover:ring-violet-500/30 transition-all duration-200"
              alt="User Avatar"
              draggable="false"
            />
          </Link>

          <div className="flex-1 mt-2 min-w-0">
            <TextArea
              maxHeight={500}
              minHeight={43}
              addText={textAdded}
              onChange={verseInputChanged}
              placeholder={
                isComment ? t("input.comment") : t("input.versesInput")
              }
              className={`
                !bg-transparent 
                pl-0 
                overflow-hidden 
                resize-none 
                select-none 
                ${isItalic}
                border-none 
                outline-none 
                focus:border-none 
                dark:text-white/95 
                text-gray-800 dark:text-gray-100
                w-full 
                text-base sm:text-lg 
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                leading-relaxed
              `}
            />

            <div className="flex items-center justify-between mt-3 overflow-x-auto scrollbar-hide">
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
                  className={`${progressColours.text} select-none text-xs font-medium`}
                >
                  {numOfCharacters}/{maxCharactersAllowed}
                </span>
              </div>
            </div>

            <SecondaryDropdown
              showDropdownMenu={tagsDropdownMenuVisibility}
              setShowMenu={setTagsDropdownMenuVisibility}
              buttonRef={TagsButtonRef}
              openSide="down"
              position={tagsMenuPos}
              setPosition={setTagsMenuPos}
              TWStyling="darkerBackgroundColor borderColor"
            >
              <div className="flex flex-col w-full min-w-[300px] p-0.5 shadow-lg">
                <div className="flex items-center justify-between mb-2 pb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Hashtags
                  </span>
                  <Tooltip label="Close">
                    <span
                      onClick={() => setTagsDropdownMenuVisibility(false)}
                      className="
                        icon-[ic--round-close] 
                        w-4 h-4 
                        cursor-pointer 
                        text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                        hover:rotate-90 
                        transition-all duration-200
                      "
                    />
                  </Tooltip>
                </div>
                <div className="flex flex-col gap-1"></div>
              </div>
            </SecondaryDropdown>
          </div>
        </div>

        <div
          ref={BottomMenuRef}
          id={id}
          className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10"
        >
          {getStarPlus && (
            <div
              className="absolute right-4"
              style={{ top: progressBarPosition - 25.5 }}
            >
              <span
                className={`${progressColours.text} font-bold cursor-pointer select-none hover:underline text-xs`}
              >
                Learn more
              </span>
            </div>
          )}
          <div
            style={{
              top: progressBarPosition,
              width: currentCharDivWidth + "px",
            }}
            className={`absolute ${progressColours.bg} py-0.5 shadow-md transition-colors duration-120 ${progressColours.shadow}`}
          />
          <div className="flex items-center gap-1 sm:gap-1.5">
            {buttons.map((btn, i) => (
              <Tooltip key={i} label={btn.title}>
                <button
                  id={btn.title}
                  aria-label={btn.title}
                  onClick={(e) => {
                    if (btn.title === "Emoji") toggleEmojiMenu();
                    else if (btn.title === "Add Media") toggleGIFMenu();
                    else if (btn.title === "Advanced Styling")
                      toggleStylingMenu();
                    else if (btn.title === "Trending Tags") toggleTagsMenu();
                  }}
                  className="
                    group relative flex items-center justify-center
                    w-9 h-9 sm:w-10 sm:h-10
                    rounded-full
                    bg-white/5 dark:bg-white/5
                    backdrop-blur-sm
                    text-gray-400 dark:text-gray-400
                    transition-all duration-200 ease-out
                    hover:bg-violet-500/10 dark:hover:bg-violet-400/10
                    hover:text-violet-500 dark:hover:text-violet-400
                    hover:scale-110
                    active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-violet-500/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <span
                    className={`${btn.iconClass} w-5 h-5 transition-colors duration-200`}
                  />
                  {btn.active && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
                  )}
                </button>
              </Tooltip>
            ))}
          </div>

          <button
            disabled={isVerseDisabled}
            aria-label="Verse"
            onClick={() => console.log("Verse Posted")}
            className="
              relative
              px-5 py-2
              rounded-full
              text-sm font-semibold
              bg-gradient-to-r from-violet-600 to-purple-600
              text-white
              shadow-lg shadow-violet-500/25
              hover:shadow-violet-500/40
              hover:scale-105
              active:scale-95
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-violet-500/30
              disabled:opacity-50 disabled:cursor-not-allowed
              overflow-hidden
              group
            "
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="relative z-10 flex items-center gap-2">
              {isComment ? (
                <>
                  <span className="icon-[ic--round-chat-bubble-outline] w-4 h-4" />
                  Comment
                </>
              ) : (
                <>
                  <span className="icon-[ic--round-send] w-4 h-4" />
                  Verse
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      <GIFMenu openMenu={isGIFMenuOpen} />
      <EmojiMenu
        buttonId={"Emoji"}
        isVisible={isEmojiMenuOpen}
        setVisible={setEmojiMenuOpen}
      />
    </>
  );
});

export default Verse;
