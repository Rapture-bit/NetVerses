import React, { useState, useEffect } from "react";
import { Tooltip } from "antd";
import formatNumber from "@/utils/formatNumber";
import formatDate from "@/utils/formatDate";
import { useTimeAgo } from "@/components/others/TimeAgo";
import { useHumanDate } from "../others/HumanDate";
import ImageGallery from "../others/ImageGallery";
import Boost from "@/components/modal/Menu/Boost";

type InteractionCounts = {
  likes: number;
  dislikes: number;
  views: number;
  boosts: number;
  comments: number;
  [key: string]: number;
};

type Comment = {
  author: string;
  text: string;
};

type images = {
  URL: string;
  comment?: string;
};

type videos = {
  URL: string;
  comment?: string;
};

type Attachments = {
  images: images[];
  videos?: videos[];
};

type PostProps = {
  id: number;
  type?: string;
  title?: string;
  description: string;
  author: string;
  interactions: InteractionCounts;
  attachments?: Attachments;
  comments: Comment[];
  isNSFW: boolean;
  date: string;
  colorProfile?: string;
};

export default function Post({
  id,
  title = "",
  description,
  type = "default",
  colorProfile,
  attachments = {
    images: [
      {
        URL: "https://assets.netverses.com/media/avatars/type11.jpg",
        comment: "NetVerse's Default Avatar",
      },
      {
        URL: "https://assets.netverses.com/media/avatars/type11.jpg",
        comment: "NetVerse's Default Avatar",
      },
      {
        URL: "https://assets.netverses.com/media/avatars/type11.jpg",
        comment: "NetVerse's Default Avatar",
      },
      {
        URL: "https://assets.netverses.com/media/avatars/type11.jpg",
        comment: "NetVerse's Default Avatar",
      },
      {
        URL: "https://assets.netverses.com/media/avatars/type11.jpg",
        comment: "NetVerse's Default Avatar",
      },
      {
        URL: "https://assets.netverses.com/media/avatars/type11.jpg",
        comment: "NetVerse's Default Avatar",
      },
    ],
  },
  date,
  author,
  interactions,
  isNSFW,
  comments,
}: PostProps) {
  const timeAgo = useTimeAgo(date);
  const humanReadableDate = useHumanDate(date);

  const [isBoostMenuVisible, setBoostMenuVisible] = useState<boolean>(false);
  const [colorPreference, setColorPreference] = useState<string>(
    colorProfile ? colorProfile : "purple",
  );
  const [textColor, setTextColor] = useState<string>(
    `text-${colorPreference}-500`,
  );
  const [borderColor, setBorderColor] = useState<string>(
    `border-${colorPreference}-600`,
  );
  const [shadowColor, setShadowColor] = useState<string>(
    `shadow-${colorPreference}-600`,
  );

  const toggleBoost = () => {
    setBoostMenuVisible(!isBoostMenuVisible);
  };

  useEffect(() => {
    setTextColor(`text-${colorPreference}-500`);
    setBorderColor(`border-${colorPreference}-600`);
    setShadowColor(`shadow-${colorPreference}-600`);
  }, [colorPreference]);

  return (
    <div
      className={`flex flex-col space-y-5 p-4 sm:pl-5 sm:py-4 rounded-md mx-auto sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor`}
    >
      <header className="flex flex-col items-start space-y-3">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-row items-center gap-3">
            <a
              href={author}
              style={{
                display: "block",
                width: "2.4rem",
                height: "2.4rem",
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <div className="relative inline-block">
                <img
                  src="/images/avatars/default.jpg"
                  className="rounded-full w-10 h-10"
                  alt="Avatar"
                />
              </div>
            </a>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <a
                  href={author}
                  className="text-black dark:text-white hover:underline font-medium"
                >
                  {author}
                </a>
              </div>
              <Tooltip mouseLeaveDelay={0} title={humanReadableDate}>
                <span className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:underline">
                  {timeAgo}
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
        {(type === "Blog" || type === "News") && title && (
          <div>
            <h1 className="flex items-center dark:text-white text-black text-lg font-semibold jost">
              {title}
              {isNSFW && (
                <span className="ml-2 text-xs bg-red-600 text-white rounded-lg px-2 py-1">
                  NSFW
                </span>
              )}
            </h1>
          </div>
        )}
      </header>
      <main>
        <p
          className={`dark:text-white text-black transition-all duration-300 ${isNSFW ? "blur hover:blur-0" : "blur-0"}`}
        >
          {description}
        </p>
        <a
          href={`/${author}/posts/${id}`}
          className={`mt-3 ${textColor} hover:underline transition-all duration-300`}
        >
          Show more
        </a>
        <ImageGallery attachments={attachments} author={author} id={1} />
      </main>
      <footer className="flex flex-col space-y-3">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-5">
            <Tooltip
              mouseLeaveDelay={0}
              title="Like"
              placement="bottom"
              arrow={false}
            >
              <button
                aria-label="Like"
                className="flex items-center gap-2 hover:text-blue-500 transition-colors duration-300"
              >
                <span className="icon-[mdi--like-outline] w-4 h-4"></span>
                <span>{formatNumber(interactions.likes)}</span>
              </button>
            </Tooltip>

            <Tooltip
              mouseLeaveDelay={0}
              title="Dislike"
              placement="bottom"
              arrow={false}
            >
              <button
                aria-label="Dislike"
                className="flex items-center gap-2 hover:text-red-500 transition-colors duration-300"
              >
                <span className="icon-[mdi--dislike-outline] w-4 h-4"></span>
                <span>{formatNumber(interactions.dislikes)}</span>
              </button>
            </Tooltip>

            <Tooltip
              mouseLeaveDelay={0}
              title="Comment"
              placement="bottom"
              arrow={false}
            >
              <button
                aria-label="Comment"
                onClick={() =>
                  (window.location.href = `/${author}/posts/${id}`)
                }
                className="flex items-center gap-2 hover:text-cyan-500 transition-colors duration-300"
              >
                <span className="icon-[majesticons--comment-line] w-4 h-4"></span>
                <span>{formatNumber(interactions.comments)}</span>
              </button>
            </Tooltip>

            <Tooltip
              mouseLeaveDelay={0}
              onClick={toggleBoost}
              title="Boost"
              placement="bottom"
              arrow={false}
            >
              <button
                aria-label="Boost"
                className="flex items-center gap-2 hover:text-orange-500 transition-colors duration-300"
              >
                <span className="icon-[material-symbols--speed-outline] w-4 h-4"></span>
                <span>{formatNumber(interactions.boosts)}</span>
              </button>
            </Tooltip>
          </div>
          <div className="flex items-center gap-3">
            <Tooltip
              mouseLeaveDelay={0}
              title="Translate"
              placement="bottom"
              arrow={false}
            >
              <button
                aria-label="Translate"
                className="flex items-center gap-2 dark:hover:text-neutral-100 hover:text-neutral-800 transition-colors duration-300"
              >
                <span className="icon-[material-symbols--translate] w-4 h-4"></span>
              </button>
            </Tooltip>

            <Tooltip
              mouseLeaveDelay={0}
              title="More"
              placement="bottom"
              arrow={false}
            >
              <button
                aria-label="See More"
                className="flex items-center gap-2 dark:hover:text-neutral-100 hover:text-neutral-800 transition-colors duration-300"
              >
                <span className="icon-[mingcute--more-2-fill] w-4 h-4"></span>
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="space-y-3">
          {comments.length > 0 ? (
            comments.slice(0, 3).map((comment, index) => (
              <div
                key={index}
                className="flex flex-col space-y-1 border-t border-gray-200 dark:border-gray-700 pt-3"
                style={{ marginLeft: `${index * 15}px` }}
              >
                <span className="font-medium text-black dark:text-white">
                  {comment.author}
                </span>
                <div className="flex flex-row justify-between">
                  <p>{comment.text}</p>
                  <div className="flex flex-row gap-3">
                    <button
                      className="dark:text-white text-black hover:underline mt-2 self-start"
                      aria-label="Reply"
                    >
                      <span
                        className="icon-[material-symbols--reply] textColor w-4 h-4"
                        aria-hidden="true"
                      ></span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
          )}
          {comments.length > 3 && (
            <a
              href={`/${author}/posts/${id}`}
              className={`${textColor} hover:underline mt-2`}
            >
              View more comments ({comments.length - 3})
            </a>
          )}
        </div>
      </footer>
      <Boost visible={isBoostMenuVisible} setIsOpen={setBoostMenuVisible} />
    </div>
  );
}
