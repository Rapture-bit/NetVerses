import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import React from "react";
import { Tooltip } from "antd";
import { useState } from "react";
import formatNumber from "@/utils/formatNumber";
import { useTimeAgo } from "@/ui/others/TimeAgo";
import { useHumanDate } from "../others/HumanReadableDate";

import Verse from "./Verse";

type InteractionCounts = {
  likes: number;
  dislikes: number;
};

type CommentProps = {
  key: number;
  content: string;
  id: string;
  postAuthor: string;
  postId: number;
  author: string;
  interactions: InteractionCounts;
  isNSFW?: boolean;
  date: string;
  extendWidth?: boolean;
};

export default function Comment({
  id,
  author,
  postAuthor,
  postId,
  date,
  interactions,
  extendWidth = false,
  isNSFW,
  colorProfile,
  content,
}: CommentProps) {
  const timeAgo = useTimeAgo(date);
  const humanReadableDate = useHumanDate(date);
  const [authorAvatar, setAuthorAvatar] = useState<string>(
    "/images/avatars/default.jpg",
  );
  const [showReply, setShowReply] = useState<boolean>(false);
  const MotionVerse = motion((props: VerseProps) => <Verse {...props} />);

  const bgColorMap = {
    blue: "bg-blue-900",
    red: "bg-red-900",
    green: "bg-green-900",
    purple: "bg-purple-900",
    yellow: "bg-yellow-900",
    pink: "bg-pink-900",
    indigo: "bg-indigo-900",
    gray: "bg-gray-900",
  };

  const [localUser, setLocalUser] = useState<string>("");
  const [isBoostMenuVisible, setBoostMenuVisible] = useState<boolean>(false);
  const [localColorPreference, setLocalColorPreference] = useState<string>(
    colorProfile ? colorProfile : "purple",
  );
  const [textColor, setTextColor] = useState<string>(
    `text-${localColorPreference}-500`,
  );

  const onReply = () => {
    console.log("Replying...");
    setShowReply((prev) => !prev);
  };

  return (
    <>
      <div
        className={`flex border borderColor flex-col space-y-5 p-4 sm:pl-5 sm:py-4 rounded-md mx-auto sm:mx-0 ${extendWidth ? "w-full max-w-none" : "w-full sm:w-3/4 lg:w-3/4 xl:w-1/2"} darkerBackgroundColor`}
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
          <div className="mt-2">
            <div className={`mt-2`}>
              <Link
                to={`/u/${postAuthor}/${postId}/${id}`}
                className={`inline-block ${textColor} hover:underline font-medium`}
              >
                Show More
              </Link>
            </div>
          </div>
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
                  onClick={onReply}
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

      <AnimatePresence>
        {showReply && (
          <MotionVerse
            id="comment"
            isComment={true}
            className={`mt-3 flex-col ${
              extendWidth
                ? "w-full max-w-none"
                : "w-full sm:w-3/4 lg:w-3/4 xl:w-1/2"
            } darkerBackgroundColor`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
