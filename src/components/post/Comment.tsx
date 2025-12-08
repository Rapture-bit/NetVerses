import { Link } from "react-router-dom";
import React from "react";
import { Tooltip } from "antd";
import { useState } from "react";
import formatNumber from "@/utils/formatNumber";
import { useTimeAgo } from "@/components/others/TimeAgo";
import { useHumanDate } from "../others/HumanReadableDate";

type InteractionCounts = {
  likes: number;
  dislikes: number;
};

type CommentProps = {
  key: number;
  content: string;
  author: string;
  interactions: InteractionCounts;
  isNSFW?: boolean;
  date: string;
  extendWidth?: boolean;
};

export default function Comment({
  author,
  date,
  interactions,
  extendWidth = false,
  isNSFW,
  content,
}: CommentProps) {
  const timeAgo = useTimeAgo(date);
  const humanReadableDate = useHumanDate(date);
  const [authorAvatar, setAuthorAvatar] = useState<string>(
    "/images/avatars/default.jpg",
  );

  return (
    <div
      className={`flex border border-neutral-700 flex-col space-y-5 p-4 sm:pl-5 sm:py-4 rounded-md mx-auto sm:mx-0 ${extendWidth ? "w-full max-w-none" : "w-full sm:w-3/4 lg:w-3/4 xl:w-1/2"} darkerBackgroundColor`}
    >
      <header className="flex flex-col items-start space-y-3">
        <div className="flex flex-row items-center gap-3">
          <div className="relative inline-block">
            <img
              src="/images/avatars/default.jpg"
              className="rounded-full w-10 h-10"
              alt="Avatar"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <Link
                to={`/${author}`}
                className="text-black hover:underline dark:text-white font-medium"
              >
                {author}
              </Link>
            </div>
            <Tooltip mouseLeaveDelay={0} title={humanReadableDate}>
              <span className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:underline">
                {timeAgo}
              </span>
            </Tooltip>
          </div>
        </div>
        <div>
          <h1 className="flex items-center dark:text-white text-black text-lg font-semibold jost">
            {isNSFW && (
              <span className="ml-2 text-xs bg-red-600 text-white rounded-lg px-2 py-1">
                NSFW
              </span>
            )}
          </h1>
        </div>
      </header>
      <main>
        <p
          className={`dark:text-white text-black transition-all duration-300 ${isNSFW ? "blur hover:blur-0" : "blur-0"}`}
        >
          {content}
        </p>
      </main>
      <footer className="flex flex-col space-y-3">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-5">
            <Tooltip
              mouseLeaveDelay={0}
              title="Like"
              placement="bottom"
              arrow={false}
            >
              <button
                aria-label="Like"
                className="flex items-center gap-2 textColor hover:text-blue-500 transition-colors duration-300"
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
                className="flex items-center gap-2 textColor hover:text-red-500 transition-colors duration-300"
              >
                <span className="icon-[mdi--dislike-outline] w-4 h-4"></span>
                <span>{formatNumber(interactions.dislikes)}</span>
              </button>
            </Tooltip>

            <Tooltip
              mouseLeaveDelay={0}
              title="Reply"
              placement="bottom"
              arrow={false}
            >
              <button
                aria-label="Reply"
                className="flex items-center gap-2 textColor transition-colors duration-300 hover:underline"
              >
                <span
                  className="icon-[material-symbols--reply] w-4 h-4"
                  aria-hidden="true"
                ></span>
                <span>Reply</span>
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
                aria-label="Check More"
                className="flex items-center gap-2 dark:hover:text-neutral-100 hover:text-neutral-800 transition-colors duration-300"
              >
                <span className="icon-[mingcute--more-2-fill] w-4 h-4"></span>
              </button>
            </Tooltip>
          </div>
        </div>
      </footer>
    </div>
  );
}
