import { HashLink } from "react-router-hash-link";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import formatNumber from "@/utils/formatNumber";
import formatDate from "@/utils/formatDate";
import { useTimeAgo } from "@/ui/others/TimeAgo";
import { useHumanDate } from "../others/HumanReadableDate";
import AttachmentsViewer from "../others/AttachmentsViewer";
import Boost from "@/ui/modal/Menu/Boost";

import RedirectMenu from "../others/RedirectMenu";
import Tooltip from "@/ui/Tooltip";

import { useTranslation } from "react-i18next";

type InteractionCounts = {
  likes: number;
  dislikes: number;
  views: number;
  boosts: number;
  comments: number;
  [key: string]: number;
};

interface Comment {
  author: string;
  text: string;
  date: string;
  interactions: {
    likes: number;
    dislikes: number;
  };
}

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
  isAI: boolean;
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
  const adStyles = {
    borderColor: "!border-yellow-500",
    bgColor: "!bg-yellow-100 dark:!bg-yellow-900/25",
    textColor: "!text-yellow-800 dark:!text-yellow-300",
  };

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
  const [bgColor, setBgColor] = useState<string>(
    bgColorMap[localColorPreference as keyof typeof bgColorMap] ??
      "bg-blue-900",
  );
  const [borderColor, setBorderColor] = useState<string>(
    `border-${localColorPreference}-600`,
  );
  const [shadowColor, setShadowColor] = useState<string>(
    `shadow-${localColorPreference}-600`,
  );

  const navigate = useNavigate();

  const toggleBoost = () => {
    setBoostMenuVisible(!isBoostMenuVisible);
  };

  useEffect(() => {
    setTextColor(`text-${localColorPreference}-500`);
    setBgColor(`bg-${localColorPreference}-900`);
    setBorderColor(`border-${localColorPreference}-600`);
    setShadowColor(`shadow-${localColorPreference}-600`);
  }, [localColorPreference]);

  const toggleClick = (action) => {
    if (action === "Boost") {
      toggleBoost();
    } else if (action === "Comment") {
      navigate(`/u/${author}/${id}`, { replace: false });

      setTimeout(() => {
        const commentElement = document.getElementById("comment");
        if (commentElement) {
          commentElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 0.5 * 1000);
    }
  };

  return (
    <div
      className={`flex border borderColor flex-col space-y-5 p-5 sm:p-6 rounded-xl mx-auto w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor transition-all duration-300 ${
        type === "Ad"
          ? `${adStyles.bgColor} border ${adStyles.borderColor}`
          : `border borderColor hover:border-purple-500! hover:shadow-lg hover:scale-[1.01] darkerBackgroundColor`
      } hover:shadow-lg hover:scale-[1.01]`}
    >
      <header className="flex flex-col space-y-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Link
              to={`/u/${author.toLowerCase()}`}
              className={`${type === "Ad" ? "w-9 h-9" : "w-12 h-12"} rounded-full overflow-hidden block border border-gray-700 hover:border-gray-500 transition-all duration-200`}
            >
              <img
                src="/images/avatars/default.jpg"
                className="w-full h-full object-cover"
                alt="Avatar"
              />
            </Link>
            <div className="flex flex-col">
              <Link
                to={`/u/${author.toLowerCase()}`}
                className="font-medium text-black dark:text-white hover:underline"
              >
                {author}
              </Link>
              {type !== "Ad" && (
                <div className="relative">
                  <Tooltip label={humanReadableDate}>
                    <span className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:underline inline-block w-fit">
                      {timeAgo}
                    </span>
                  </Tooltip>
                </div>
              )}
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
        {type === "Ad" && title && (
          <h1 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
            <a
              href="https://netverses.com/starplus"
              className="hover:underline"
            >
              {title}
            </a>
            <span className="text-xs bg-yellow-600 select-none text-white rounded-full px-2 py-1 font-semibold">
              Sponsored
            </span>
          </h1>
        )}
      </header>

      <main>
        <p
          className={`text-black dark:text-white transition-all duration-300 ${
            isNSFW ? "blur-sm hover:blur-none" : ""
          }`}
        >
          {description}
          {type === "Ad" && (
            <>
              <p className="flex items-center gap-1 mt-1 text-sm italic font-semibold text-yellow-600 select-none">
                <span className="icon-[material-symbols--ad] text-base"></span>
                Sponsored by{" "}
                <RedirectMenu url="https://netverses.com" label="NetVerses" />
              </p>

              <p className="flex items-center gap-1 mt-1 text-sm italic font-semibold text-yellow-600 select-none">
                <span className="icon-[maki--roadblock] text-base"></span>
                Want an ad-free experience? Upgrade to{" "}
                <span className="font-bold text-yellow-600 hover:text-yellow-500 transition-all duration-300 underline">
                  <RedirectMenu
                    url="https://netverses.com/starplus"
                    label="StarPlus"
                  />
                </span>{" "}
                and enjoy a cleaner, distraction-free interface.
              </p>
            </>
          )}
        </p>

        {isAIGenerated && type !== "Ad" && (
          <div className="mt-2">
            <span
              className={`inline-block text-xs select-none ${bgColor} text-white font-semibold rounded-full px-2 py-1`}
            >
              AI-generated
            </span>
            <div className={`mt-2`}>
              <Link
                to={`/u/${author.toLowerCase()}/${id}`}
                className={`inline-block ${textColor} hover:underline font-medium`}
              >
                {t("general.showmore")}
              </Link>
            </div>
          </div>
        )}

        {!isAIGenerated && (
          <Link
            to={`/u/${author.toLowerCase()}/${id}`}
            className={`mt-3 inline-block ${textColor} hover:underline font-medium`}
          >
            {t("general.showmore")}
          </Link>
        )}

        {attachments && type !== "Ad" && attachments?.length !== 0 && (
          <AttachmentsViewer
            attachments={attachments}
            colorProfile={colorProfile}
            postDetails={{
              date,
              author,
              interactions,
              description,
              isAIGenerated,
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
        <div className="flex items-center justify-between">
          {type !== "Ad" && (
            <div className="flex items-center gap-1">
              {["Like", "Dislike", "Comment", "Boost"].map((action) => {
                const icons = {
                  Like: "mdi--like-outline",
                  Dislike: "mdi--dislike-outline",
                  Comment: "majesticons--comment-line",
                  Boost: "material-symbols--speed-outline",
                };
                const counts = {
                  Like: interactions.likes,
                  Dislike: interactions.dislikes,
                  Comment: interactions.comments,
                  Boost: interactions.boosts,
                };
                const count = counts[action as keyof typeof counts];

                return (
                  <Tooltip key={action} label={action}>
                    <button
                      aria-label={action}
                      onClick={() => toggleClick(action)}
                      className="
                group/btn
                flex items-center
                gap-1.5
                px-3 py-1.5
                rounded-full
                text-sm
                text-gray-600 dark:text-gray-400
                hover:text-purple-600 dark:hover:text-purple-400
                hover:bg-purple-500/10 dark:hover:bg-purple-400/10
                active:scale-95
                transition-all duration-200
              "
                    >
                      <span
                        className={`
                icon-[${icons[action as keyof typeof icons]}]
                w-4 h-4
                transition-transform duration-200
                group-hover/btn:scale-110
              `}
                      />
                      <span className="font-medium tabular-nums">
                        {formatNumber(count)}
                      </span>
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          )}

          {type !== "Ad" && (
            <div className="flex items-center gap-1">
              <Tooltip label="Transfer Ownership">
                <button
                  aria-label="Transfer Ownership"
                  className="
            p-2
            rounded-full
            text-gray-400
            hover:text-gray-700 dark:hover:text-gray-200
            hover:bg-gray-100 dark:hover:bg-white/5
            active:scale-95
            transition-all duration-200
          "
                >
                  <span className="icon-[mingcute--transfer-line] w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          )}
        </div>

        {type !== "Ad" && (
          <div className="flex flex-col space-y-3">
            {comments.length > 0 ? (
              comments.slice(0, 3).map((comment, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start space-y-1 border-t border-gray-700 pt-3 pl-3 transition-all duration-200"
                  style={{ marginLeft: `${index * 10}px` }}
                >
                  <Link
                    to={`/${comment.author.toLowerCase()}`}
                    className="font-medium hover:underline text-black dark:text-white"
                  >
                    {comment.author}
                  </Link>
                  <div className="flex justify-between items-start w-full">
                    <p>{comment.text}</p>
                    <Tooltip label="Reply">
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
              <p className="text-gray-500 dark:text-gray-400">
                No comments yet.
              </p>
            )}
            {comments.length > 3 && (
              <HashLink
                smooth
                to={`/u/${author}/${id}#comments`}
                className={`${textColor} hover:underline mt-2 font-medium self-start`}
              >
                View more comments ({comments.length - 3})
              </HashLink>
            )}
          </div>
        )}
      </footer>

      <Boost visible={isBoostMenuVisible} setIsOpen={setBoostMenuVisible} />
    </div>
  );
}
