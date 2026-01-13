import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useContext,
  forwardRef,
} from "react";

import EmojiMenu from "../EmojiMenu/EmojiMenu";

import useDeviceType from "@/hooks/useDeviceType";
import TextArea from "@/ui/input/TextArea";

import { ThemeContext } from "@/context/ThemeContext";
import { AnimateContext } from "@/context/AnimateContext";

import { useTranslation } from "react-i18next";

interface VerseProps {
  id?: string;
  isComment: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const TEST_ANIM =
  "https://lottie.host/79c83346-aa45-47d0-80b9-c9f5b90b8ee6/UdXjIq2lTO.lottie";

// ✅ Correct forwardRef usage
const Verse = forwardRef<HTMLDivElement, VerseProps>((props, ref) => {
  const { id, isComment, className, style } = props;
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

  const [isEmojiMenuOpen, setEmojiMenuOpen] = useState<boolean>(false);
  const [emojiMenuPos, setEmojiMenuPos] = useState({ x: 0, y: 0 });

  const EmojiButtonRef = useRef(null);

  const buttons = [
    {
      title: "Emoji",
      iconClass: "icon-[mdi--emoji-outline]",
      hover: "hover:text--500",
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

  function verseInputChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const input = e.target.value.trim();
    setIsItalic(input ? "not-italic" : "italic");
  }

  useLayoutEffect(() => {
    const updateColors = () => setTextColor(colorProperties.textColor);

    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => observer.disconnect();
  }, [colorProperties]);

  if (deviceType === "mobile" && isTouchScreen && !isComment) return null;

  const onVerse = () => {
    setAnimSrc(TEST_ANIM);
    currentRef?.play();
  };

  useEffect(() => {
    const onResize = () => {
      if (!EmojiButtonRef.current) return;

      const emojiMenuButton: HTMLDivElement = EmojiButtonRef.current;
      const parentElement = emojiMenuButton.parentElement;
      if (!parentElement) return;

      const parentElementRect = parentElement.getBoundingClientRect();
      const emojiMenuRect = emojiMenuButton.getBoundingClientRect();

      const posX = Math.abs(parentElementRect.left - emojiMenuRect.left);
      const posY = Math.abs(parentElementRect.top - emojiMenuRect.top);

      setEmojiMenuPos({ x: posX, y: posY });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleEmojiMenu = (e: any) => {
    const parentElement: HTMLDivElement = e.target.parentElement;
    const parentElementRect = parentElement.getBoundingClientRect();
    const emojiMenuRect = e.target.getBoundingClientRect();

    const posX = Math.abs(parentElementRect.left - emojiMenuRect.left);
    const posY = Math.abs(parentElementRect.top - emojiMenuRect.top);

    setEmojiMenuPos({ x: posX, y: posY });
    setEmojiMenuOpen(true);
  };

  return (
    <>
      <div
        ref={ref} // ✅ Attach the forwarded ref
        style={style}
        className={`relative flex flex-col p-4 sm:pl-5 border borderColor sm:py-4 rounded-md mx-4 sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor ${className}`}
      >
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
              onChange={verseInputChanged}
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
                  onClick={(e) => btn.title === "Emoji" && toggleEmojiMenu(e)}
                  className={`
                    group relative flex items-center justify-center
                    w-9 h-9 sm:w-10 sm:h-10
                    rounded-xl
                    bg-black/5 dark:bg-white/5
                    backdrop-blur-md
                    text-gray-600 dark:text-gray-300
                    transition-all duration-300 ease-out
                    hover:bg-black/10 dark:hover:bg-white/10
                    hover:-translate-y-0.5
                    active:translate-y-0 active:scale-95
                    focus:outline-none
                  `}
                >
                  <span
                    className={`${btn.iconClass} w-5 h-5 transition-colors duration-300 group-hover:${btn.hover.replace("hover:", "")}`}
                  />
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

      <EmojiMenu
        position={emojiMenuPos}
        isVisible={isEmojiMenuOpen}
        setVisible={setEmojiMenuOpen}
      />
    </>
  );
});

export default Verse;
