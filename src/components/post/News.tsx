import React, { useState, useEffect } from "react";
import { useHumanDate } from "../others/HumanDate";
import { useTimeAgo } from "@/components/others/TimeAgo";
import formatNumber from "@/utils/formatNumber";
import { Tooltip } from "antd";

type images = {
  URL: string;
  comment?: string;
};

type videos = {
  URL: string;
  comment?: string;
};

type InteractionCounts = {
  likes: number;
  dislikes: number;
  views: number;
  boosts: number;
  [key: string]: number;
};

type Attachments = {
  images: images[];
  videos?: videos[];
};

type NewsProps = {
  id: number;
  type?: string;
  title: string;
  description: string;
  channel: string;
  interactions: InteractionCounts;
  attachments?: Attachments;
  emergencySettings?: EmergencySettings;
  isNSFW: boolean;
  date: string;
  colorProfile?: string;
};

type EmergencySettings = {
  emergencyLevel: number;
  excludingMember?: string;
};

const News = ({
  channel,
  date,
  type = "default",
  description,
  title,
  id,
  emergencySettings,
}: NewsProps) => {
  const isEmergency = type === "emergency";
  const isLong = type === "long";
  const isShort = type === "short";
  const timeAgo = useTimeAgo(date);
  const humanReadableDate = useHumanDate(date);

  return (
    <>
      <div
        id={id.toString()}
        className={`flex flex-col space-y-6 p-6 sm:pl-6 sm:py-6 rounded-lg mx-auto sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 dark:bg-[#1E1E1E] border-2 border-[#999999] shadow-md dark:border-[#2C2C2C]`}
      >
        <div className="flex flex-row justify-between gap-4">
          <span className="roboto text-lg dark:text-white">{title}</span>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex flex-row gap-3 w-full">
            <p className="dark:text-white opacity-80 min-w-[300px]">
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center flex-row gap-2">
            <img
              className="rounded-full w-7 h-7"
              src="/images/avatars/default.jpg"
            />
            <a
              href={`channels/${channel}`}
              className="font-medium text-base hover:underline underline-offset-4"
            >
              {channel}
            </a>
            <Tooltip mouseLeaveDelay={0} title={humanReadableDate}>
              <span className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:underline">
                {timeAgo}
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
};

export default News;
