import React, { useState, useEffect } from "react";
import { Tooltip } from "antd";
import formatNumber from "@/utils/formatNumber";
import formatDate from "@/utils/formatDate";
import { useTimeAgo } from "@/components/Others/TimeAgo";
import { useHumanDate } from "../Others/HumanDate";
import Verse from "./Verse";
import Comment from "./Comment";
import type { MenuProps } from "antd/es/menu";
import { Dropdown, Space, ConfigProvider } from "antd";
import DownOutlined from "@ant-design/icons";

import { getCssVariable } from "@/utils/getCssVariable";

type InteractionCounts = {
  likes: number;
  dislikes: number;
  views: number;
  boosts: number;
  comments: number;
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

interface PostProps {
  id: number;
  title: string;
  date: string;
  description: string;
  author: string;
  interactions: {
    likes: number;
    dislikes: number;
    views: number;
    boosts: number;
    comments: number;
  };
  isNSFW: boolean;
  comments: Comment[];
}

export default function FocusedPost({
  id,
  title,
  description,
  date,
  author,
  interactions,
  isNSFW,
  comments,
}: PostProps) {
  const timeAgo = useTimeAgo(date);
  const humanReadableDate = useHumanDate(date);
  const [selectedFilter, setSelectedFilter] = useState<string>("Popular");
  const [filteredComments, setFilteredComments] = useState<object[]>(comments);

  const items: MenuProps["items"] = [
    {
      label: (
        <button
          aria-label="Filter by Recent"
          onClick={() => setSelectedFilter("Recent")}
        >
          Recent
        </button>
      ),
      key: "0",
    },
    {
      label: (
        <button
          aria-label="Filter by Popular"
          onClick={() => setSelectedFilter("Popular")}
        >
          Popular
        </button>
      ),
      key: "1",
    },
  ];

  function toggleBack() {
    if (window.history.length > 1) {
      const previousUrl = document.referrer;
      if (previousUrl.startsWith(window.location.origin)) {
        window.history.back();
      } else {
        window.location.href = "/";
      }
    } else {
      window.location.href = "/";
    }
  }

  useEffect(() => {
    const filterComments = () => {
      if (selectedFilter === "Popular") {
        const filtered = comments
          .filter(
            (comment: any) =>
              comment.interactions.likes > 20 &&
              comment.interactions.dislikes < 5,
          )
          .sort(
            (a: any, b: any) => b.interactions.likes - a.interactions.likes,
          );

        setFilteredComments(filtered);
      } else if (selectedFilter === "Recent") {
        setFilteredComments(
          [...comments].sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        );
      }
    };

    filterComments();
  }, [selectedFilter, comments]);

  return (
    <>
      <div className="flex flex-row justify-between gap-5 p-4 sm:pl-5 sm:py-4 rounded-md mx-auto sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor">
        <Tooltip mouseLeaveDelay={0} title={"Back"} placement={"bottom"}>
          <button aria-label="Go Back" onClick={toggleBack} className="w-5 h-5">
            <span className="icon-[eva--arrow-back-outline] w-5 h-5"></span>
          </button>
        </Tooltip>
        <Tooltip mouseLeaveDelay={0} title={"Summarize"} placement={"bottom"}>
          <button aria-label="Summarize" className="w-5 h-5">
            <span className="icon-[ooui--text-summary-ltr] w-5 h-5"></span>
          </button>
        </Tooltip>
      </div>
      <div className="h-4"></div>
      <div className="flex flex-col space-y-5 p-4 sm:pl-5 sm:py-4 rounded-md mx-auto sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor">
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
                <span className="text-black dark:text-white font-medium">
                  {author}
                </span>
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
              {title}
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
            {description}
          </p>
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
                  className="flex items-center gap-2 hover:text-purple-500 transition-colors duration-300"
                >
                  <span className="icon-[majesticons--comment-line] w-4 h-4"></span>
                  <span>{formatNumber(interactions.comments)}</span>
                </button>
              </Tooltip>

              <Tooltip
                mouseLeaveDelay={0}
                title="Boost"
                placement="bottom"
                arrow={false}
              >
                <button
                  aria-label="Boost"
                  className="flex items-center gap-2 hover:text-pink-500 transition-colors duration-300"
                >
                  <span className="icon-[material-symbols--speed-outline] w-4 h-4"></span>
                  <span>{formatNumber(interactions.boosts)}</span>
                </button>
              </Tooltip>

              <Tooltip
                mouseLeaveDelay={0}
                title="Views"
                placement="bottom"
                arrow={false}
              >
                <button
                  aria-label={`${formatNumber(interactions.views)} Views`}
                  className="flex items-center gap-2 hover:text-teal-500 transition-colors duration-300"
                >
                  <span className="icon-[hugeicons--view] w-4 h-4"></span>
                  <span>{formatNumber(interactions.views)}</span>
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
                <button className="flex items-center gap-2 dark:hover:text-neutral-100 hover:text-neutral-800 transition-colors duration-300">
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
      <div className="h-4"></div>
      <Verse isComment={true} />
      <div className="h-2"></div>
      <div className="inline-flex items-center justify-between w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 py-2 text-sm font-medium">
        <hr className="flex-1 border-t borderColor mx-2" />
        <div className="gap-2 flex flex-row">
          <span className="text-sm dark:text-neutral-400">Sort by:</span>
          <div className="flex flex-row gap-2">
            <ConfigProvider
              theme={{
                token: {
                  colorBgBase: getCssVariable("--darker-background-color"),
                  colorText: getCssVariable("--text-color"),
                },
              }}
            >
              <Dropdown
                menu={{ items }}
                className="text-sm font-bold"
                trigger={["click"]}
                placement="bottom"
              >
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <Space>
                    {selectedFilter}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </ConfigProvider>
          </div>
        </div>
      </div>
      <div className="h-2"></div>
      {filteredComments.map((comment, index) => (
        <>
          <Comment
            key={index}
            interactions={{
              likes: comment.interactions.likes,
              dislikes: comment.interactions.dislikes,
            }}
            date={comment.date}
            author={comment.author}
            content={comment.text}
          />
          <div className="h-4"></div>
        </>
      ))}
    </>
  );
}
