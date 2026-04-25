import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useHumanDate } from "../others/HumanReadableDate";
import { useTimeAgo } from "@/ui/others/TimeAgo";
import formatNumber from "@/utils/formatNumber";
import { Tooltip } from "antd";

import TooltipHelp from "@/ui/TooltipHelp";

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

interface SignedParty {
  affiliation_name: string;
  affiliation_link: string;
  signed_date: string;
}

export type ArticlesProps = {
  id: number;
  type?: string;
  factChecked?: boolean;
  title: string;
  description: string;
  channel: string;
  signedParties: SignedParty[];
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

const Articles = ({
  channel,
  date,
  type = "default",
  description,
  title,
  signedParties,
  id,
  factChecked,
  colorProfile,
  emergencySettings,
}: ArticlesProps) => {
  const timeAgo = useTimeAgo(date);
  const humanReadableDate = useHumanDate(date);

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
  const [affiliationLogo, setAffiliationLogo] = useState<string>("");

  useEffect(() => {
    setTextColor(`text-${localColorPreference}-500`);
    setBorderColor(`border-${localColorPreference}-600`);
    setShadowColor(`shadow-${localColorPreference}-600`);
  }, [localColorPreference]);

  return (
    <>
      <div
        id={id.toString()}
        className={`flex flex-col space-y-6 p-6 sm:pl-6 sm:py-6 rounded-lg mx-auto sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor borderColor border shadow-md`}
      >
        <div className="flex flex-row justify-between gap-4">
          <div className="flex flex-row items-center gap-2">
            <span className="roboto text-lg dark:text-white hover:underline">
              {title}
            </span>
            {factChecked && (
              <Tooltip
                placement="bottom"
                mouseLeaveDelay={0}
                title="Fact Checked"
              >
                <span className="icon-[ic--baseline-verified] w-[1em] h-[1em] !text-violet-600 brightness-125 textColor cursor-pointer inline-block -mx-0.5 mb-0.5"></span>
              </Tooltip>
            )}
          </div>

          <div className="flex flex-row items-center gap-2">
            <Tooltip placement="bottom" title="More" mouseLeaveDelay={0}>
              <button
                aria-label="Check More"
                className="flex items-center gap-2 hover:text-violet-500 transition-colors duration-300"
              >
                <span className="icon-[mingcute--more-2-fill] w-4 h-4"></span>
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <p className="dark:text-white dark:!opacity-80 text-black opacity-100 mb-2">
            {description}
          </p>

          <span className="inline">
            <Link
              to={`/channels/${channel}/${id.toString()}`}
              className={`${textColor} hover:underline font-medium`}
            >
              Read more
            </Link>
          </span>
        </div>

        <div className="flex flex-col space-y-4">
          {signedParties && signedParties.length > 0 && (
            <div className="flex flex-col space-y-3 font-medium text-sm">
              <TooltipHelp title="Parties who signed this article">
                <span className="textColor select-none uppercase tracking-wide text-xs">
                  Signed By
                </span>
              </TooltipHelp>
              <div className="flex flex-row gap-3 text-sm font-medium">
                {signedParties
                  .slice(0, 3)
                  .map(
                    (
                      {
                        affiliation_name,
                        verified,
                        signed_date,
                        affiliation_link,
                      },
                      index,
                    ) => (
                      <div
                        key={index}
                        className="flex dark:bg-[#151b2d] backgroundColor transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:bg-opacity-90 rounded-lg px-3 py-3 items-center space-x-2"
                      >
                        <Link to={affiliation_link}>
                          <img
                            src="/images/avatars/default.jpg"
                            className="rounded-full w-10 h-10 select-none"
                            alt={`${affiliation_name} Avatar`}
                          />
                        </Link>
                        <div className="flex flex-col">
                          <div className="inline-flex items-center space-x-1.5">
                            <Link
                              to={affiliation_link}
                              className="font-semibold hover:underline underline-offset-4 transition-colors duration-200"
                            >
                              {affiliation_name}
                            </Link>
                          </div>
                          {signed_date && (
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <span>
                                On{" "}
                                <span className="hover:underline text-violet-500 cursor-pointer">
                                  {signed_date}
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                  )}

                {signedParties.length > 3 && (
                  <div className="flex items-center justify-center">
                    <button className="dark:bg-[#181e32] backgroundColor p-2 w-10 h-10 rounded-full text-white font-semibold transition-all duration-200">
                      +{signedParties.length - 3}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div id="questionnaire" className="flex flex-col gap-2 mt-4">
            <TooltipHelp title="Inquiries are used to learn more about users and to provide personalized recommendations, while avoiding the collection of personal data">
              <span className="textColor select-none font-medium uppercase tracking-wide text-xs">
                Inquiries
              </span>
            </TooltipHelp>
            <div className="flex flex-row"></div>
            <div className="flex flex-wrap gap-3">
              {[
                "Was this article useful?",
                "Did you like this article?",
                "Do you think this article is misleading?",
                "Does this content match your interests?",
              ].map((question, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="text-purple-600 text-sm font-medium hover:underline transition-colors duration-200"
                >
                  {question}
                </a>
              ))}
            </div>
          </div>

          <hr className="border-t dark:border-[#333333]" />

          <div className="flex items-center justify-between flex-row">
            <div className="flex flex-row items-center gap-2">
              <Link to={`channels/${channel}`}>
                <img
                  className="rounded-full w-7 h-7 select-none"
                  src="/images/avatars/default.jpg"
                  alt={`${channel} Avatar`}
                />
              </Link>
              <Link
                to={`channels/${channel}`}
                className="font-medium text-base hover:underline underline-offset-4 transition-colors duration-200"
              >
                {channel}
              </Link>
              <Tooltip mouseLeaveDelay={0} title={humanReadableDate}>
                <span className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:underline">
                  {timeAgo}
                </span>
              </Tooltip>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Tooltip placement="bottom" mouseLeaveDelay={0} title="Copy Link">
                <button className="hover:text-violet-500 transition-colors duration-300">
                  <span className="icon-[lets-icons--copy] w-5 h-5"></span>
                </button>
              </Tooltip>

              <Tooltip placement="bottom" mouseLeaveDelay={0} title="Bookmark">
                <button className="hover:text-violet-500 transition-colors duration-300">
                  <span className="icon-[material-symbols--bookmark-outline-rounded] w-5 h-5"></span>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Articles;
