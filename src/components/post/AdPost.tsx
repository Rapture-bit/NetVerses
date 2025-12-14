import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Tooltip } from "antd";
import formatNumber from "@/utils/formatNumber";
import formatDate from "@/utils/formatDate";
import { useTimeAgo } from "@/components/others/TimeAgo";
import { useHumanDate } from "../others/HumanReadableDate";
import AttachmentsViewer from "../others/AttachmentsViewer";
import Boost from "@/components/modal/Menu/Boost";

import { useTranslation } from "react-i18next";

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

interface Attachments {
  id: string;
  URL: string;
  comment?: string;
}

export type PostProps = {
  id: number;
  type?: string;
  title?: string;
  description: string;
  author: string;
  interactions: InteractionCounts;
  attachments?: Attachments[];
  comments: Comment[];
  isNSFW: boolean;
  date: string;
  isAIGenerated: boolean;
  colorProfile?: string;
};

export default function Post({
  id,
  title = "",
  description,
  type = "default",
  colorProfile,
  isAIGenerated = true, // [TEST]
  attachments,
  date,
  author,
  interactions,
  isNSFW,
  comments,
}: PostProps) {
  const { t } = useTranslation();
  const timeAgo = useTimeAgo(date);
  const humanReadableDate = useHumanDate(date);

  const [localUser, setLocalUser] = useState<string>("");
  const [isBoostMenuVisible, setBoostMenuVisible] = useState<boolean>(false);
  const [localColorPreference, setLocalColorPreference] = useState<string>(
    colorProfile ? colorProfile : "purple",
  );
  const [textColor, setTextColor] = useState<string>(
    `text-${localColorPreference}-500`,
  );
  const [borderColor, setBorderColor] = useState<string>(
    `border-${localColorPreference}-600`,
  );
  const [shadowColor, setShadowColor] = useState<string>(
    `shadow-${localColorPreference}-600`,
  );

  const toggleBoost = () => {
    setBoostMenuVisible(!isBoostMenuVisible);
  };

  useEffect(() => {
    setTextColor(`text-${localColorPreference}-500`);
    setBorderColor(`border-${localColorPreference}-600`);
    setShadowColor(`shadow-${localColorPreference}-600`);
  }, [localColorPreference]);

  return (
    <div className="flex border borderColor flex-col space-y-5 p-5 sm:p-6 rounded-xl mx-auto w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
      <header className="flex flex-col space-y-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Link
              to={author}
              className="w-12 h-12 rounded-full overflow-hidden block border-2 border-gray-700 hover:border-gray-500 transition-all duration-200"
            >
              <img
                src="/images/avatars/default.jpg"
                className="w-full h-full object-cover"
                alt="Avatar"
              />
            </Link>
            <div className="flex flex-col">
              <Link
                to={author.toLowerCase()}
                className="font-medium text-black dark:text-white hover:underline"
              >
                {author}
              </Link>
              <Tooltip mouseLeaveDelay={0} title={humanReadableDate}>
                <span className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:underline">
                  {timeAgo}
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
        {(type === "Blog" || type === "Articles") && title && (
          <h1 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
            {title}
            {isNSFW && (
              <span className="text-xs bg-red-600 select-none text-white rounded-full px-2 py-1 font-semibold">
                NSFW
              </span>
            )}
          </h1>
        )}
      </header>

      <main>
        <p
          className={`text-black dark:text-white transition-all duration-300 ${
            isNSFW ? "blur-sm hover:blur-0" : ""
          }`}
        >
          {description}
        </p>

        {isAIGenerated && (
          <div className="mt-2">
            <span className="inline-block text-xs select-none bg-yellow-400 text-black font-semibold rounded-full px-2 py-1">
              AI-generated
            </span>
            <div className={`mt-2`}>
              <Link
                to={`/${author}/posts/${id}`}
                className={`inline-block ${textColor} hover:underline font-medium`}
              >
                {t("general.showmore")}
              </Link>
            </div>
          </div>
        )}

        {!isAIGenerated && (
          <Link
            to={`/${author}/posts/${id}`}
            className={`mt-3 inline-block ${textColor} hover:underline font-medium`}
          >
            {t("general.showmore")}
          </Link>
        )}

        {attachments && attachments?.length !== 0 && (
          <AttachmentsViewer
            attachments={attachments}
            postDetails={{
              date,
              author,
              interactions,
              isNSFW,
              comments,
              title,
              type,
              postId: id,
            }}
          />
        )}
      </main>

      <footer className="flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            {["Like", "Dislike", "Comment", "Boost"].map((action, i) => {
              const icons = {
                Like: "mdi--like-outline",
                Dislike: "mdi--dislike-outline",
                Comment: "majesticons--comment-line",
                Boost: "material-symbols--speed-outline",
              };
              const colors = {
                Like: "hover:text-blue-500",
                Dislike: "hover:text-red-500",
                Comment: "hover:text-cyan-500",
                Boost: "hover:text-orange-500",
              };
              const counts = {
                Like: interactions.likes,
                Dislike: interactions.dislikes,
                Comment: interactions.comments,
                Boost: interactions.boosts,
              };
              return (
                <Tooltip
                  key={i}
                  mouseLeaveDelay={0}
                  title={action}
                  placement="bottom"
                  arrow={false}
                >
                  <button
                    aria-label={action}
                    onClick={action === "Boost" ? toggleBoost : undefined}
                    className={`flex items-center gap-1.5 ${colors[action]} transition-all duration-300 px-2 py-1 rounded-md hover:bg-[#dddddd] dark:hover:bg-[#1d1d1d]`}
                  >
                    <span className={`icon-[${icons[action]}] w-4 h-4`} />
                    <span>{formatNumber(counts[action])}</span>
                  </button>
                </Tooltip>
              );
            })}
          </div>

          <div className="flex gap-3">
            {true && (
              <Tooltip
                mouseLeaveDelay={0}
                title={"Transfer Ownership"}
                placement="bottom"
                arrow={false}
              >
                <button
                  aria-label={"Transfer Ownership"}
                  className="flex items-center gap-2 dark:hover:text-neutral-100 hover:text-neutral-800 transition-all duration-300 p-1 rounded hover:bg-[#dddddd] dark:hover:bg-[#1d1d1d]"
                >
                  <span className="icon-[mingcute--transfer-line] w-4 h-4" />
                </button>
              </Tooltip>
            )}
            {["Translate", "More"].map((action, i) => {
              const icons = {
                Translate: "material-symbols--translate",
                More: "mingcute--more-2-fill",
              };
              return (
                <Tooltip
                  key={i}
                  mouseLeaveDelay={0}
                  title={action}
                  placement="bottom"
                  arrow={false}
                >
                  <button
                    aria-label={action}
                    className="flex items-center gap-2 dark:hover:text-neutral-100 hover:text-neutral-800 transition-all duration-300 p-1 rounded hover:bg-[#dddddd] dark:hover:bg-[#1d1d1d]"
                  >
                    <span className={`icon-[${icons[action]}] w-4 h-4`} />
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          {comments.length > 0 ? (
            comments.slice(0, 3).map((comment, index) => (
              <div
                key={index}
                className="flex flex-col items-start space-y-1 border-t border-gray-700 pt-3 pl-3 rounded transition-all duration-200"
                style={{ marginLeft: `${index * 10}px` }}
              >
                <Link
                  to={`/${comment.author}`}
                  className="font-medium hover:underline text-black dark:text-white"
                >
                  {comment.author}
                </Link>
                <div className="flex justify-between items-start w-full">
                  <p>{comment.text}</p>
                  <Tooltip
                    mouseLeaveDelay={0}
                    title="Reply"
                    placement="bottom"
                    arrow={false}
                  >
                    <button
                      className="dark:text-white text-black hover:underline"
                      aria-label="Reply"
                    >
                      <span
                        className="icon-[material-symbols--reply] textColor w-4 h-4"
                        aria-hidden="true"
                      ></span>
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
          )}
          {comments.length > 3 && (
            <Link
              to={`/${author}/posts/${id}`}
              className={`${textColor} hover:underline mt-2 font-medium self-start`}
            >
              View more comments ({comments.length - 3})
            </Link>
          )}
        </div>
      </footer>

      <Boost visible={isBoostMenuVisible} setIsOpen={setBoostMenuVisible} />
    </div>
  );
}
