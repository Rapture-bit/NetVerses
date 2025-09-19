import React, { useState } from "react";
import formatNumber from "@/utils/formatNumber";

import { Tooltip } from "antd";

const ProfilePreview = ({ username }) => {
  const [actualUsername, setActualUsername] = useState<string>("Elon Musk"); // To be updated with API
  const [Avatar, setAvatar] = useState<string>("/images/avatars/default.jpg"); // To be updated with API
  const [Banner, setBanner] = useState<string>(""); // To be updated with API
  const [self, setSelf] = useState<boolean>(true); // To be updated with API
  const [Bio, setBio] = useState<string>(
    "Proud chairman of NetVerse™, empowering connections and shaping the future of digital social platforms.",
  ); // To be updated with API
  const [followers, setFollowers] = useState<number>(20000); // To be updated with API
  const [reputation, setReputation] = useState<number>(100); // To be updated with API
  const [following, setFollowing] = useState<number>(3500); // To be updated with API
  const [Job, setJob] = useState<string>("Entrepreneur"); // To be updated with API
  const [achievements, setAchievements] = useState<number>(10); // To be updated with API
  const [profileColor, setProfileColor] = useState<string>("blue"); // To be updated with API
  const [profileColors, setProfileColors] = useState<Object>({
    bannerGradient: `from-${profileColor}-700`,
    background: `bg-${profileColor}-800`,
    hoverBackground: `hover:bg-${profileColor}-800`,
    borderColor: `border-${profileColor}-800`,
    textColor: `text-${profileColor}-500`,
  });

  return (
    <div className="relative flex flex-col p-4 sm:pl-5 sm:py-4 rounded-md mx-4 sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor">
      <div className="relative flex flex-col rounded-md">
        <div
          className={`bg-gradient-to-b ${profileColors.bannerGradient} to-transparent h-36 w-full relative top-0 left-0 rounded-t-lg`}
        >
          <a
            href={`/${username}`}
            className="absolute z-10 mt-20 ml-4 w-24 h-24"
            aria-label={`Profile of ${username}`}
            style={{
              display: "block",
              width: "6rem",
              height: "6rem",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <div
              className="w-full h-full bg-cover rounded-full"
              style={{
                backgroundImage: `url(${Avatar})`,
                backgroundPosition: "center",
              }}
            ></div>
          </a>

          {self && (
            <button
              className="absolute bottom-0 right-0 mb-2 mr-2 h-8 w-8 rounded-full p-0 flex items-center justify-center hover:brightness-125 transition-all duration-300 backgroundColor textColor z-20"
              aria-label="Edit profile picture"
            >
              <span
                className="icon-[tabler--photo-edit] w-4 h-4"
                aria-hidden="true"
              ></span>
            </button>
          )}
        </div>
        <div className="flex flex-row">
          <div className="flex flex-row ml-auto gap-3">
            {self && (
              <button
                className={`rounded-md ${profileColors.background} font-semibold dark:text-white py-1.5 px-6 transition-all duration-300 hover:brightness-95`}
                aria-label="Edit"
              >
                Edit
              </button>
            )}
            <div className="flex gap-2">
              {!self && (
                <Tooltip placement="bottom" title="Follow">
                  <button
                    className={`rounded-md gap-1 flex items-center bg-transparent border ${profileColors.borderColor} ${profileColors.hoverBackground} font-semibold dark:text-white py-1 px-3 transition-all duration-300 text-sm`}
                    aria-label="Follow"
                  >
                    <span
                      className="icon-[mingcute--user-follow-line] text-white w-4 h-4"
                      aria-hidden="true"
                    ></span>
                    <span className="sr-only">Follow</span>
                  </button>
                </Tooltip>
              )}

              {!self && (
                <Tooltip placement="bottom" title="Message">
                  <button
                    className={`rounded-md gap-1 flex items-center hover:text-white bg-transparent border ${profileColors.borderColor} ${profileColors.hoverBackground} font-semibold dark:text-white py-1 px-3 transition-all duration-300 text-sm`}
                    aria-label="Message"
                  >
                    <span
                      className="icon-[ic--outline-email] w-4 h-4"
                      aria-hidden="true"
                    ></span>
                    <span className="sr-only">Message</span>
                  </button>
                </Tooltip>
              )}

              <Tooltip placement="bottom" title="More">
                <button
                  className={`rounded-md gap-1 flex items-center bg-transparent hover:text-white border ${profileColors.borderColor} ${profileColors.hoverBackground} hover:brightness-90 font-semibold dark:text-white py-1 px-2 transition-all duration-300 text-sm`}
                  aria-label="More options"
                >
                  <span
                    className="icon-[ant-design--more-outlined] w-5 h-5"
                    aria-hidden="true"
                  ></span>
                  <span className="sr-only">More options</span>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="mt-3 pl-2 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-1">
              <span className="text-xl font-semibold dark:text-white transition-colors duration-300 leading-none">
                {username}
              </span>
              <Tooltip placement="bottom" title="Official Profile">
                <span
                  className={`icon-[material-symbols--verified-outline-rounded] ${profileColors.textColor} w-4 h-4 mt-1`}
                  aria-label="Verified"
                ></span>
              </Tooltip>
            </div>
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-1">
                <span
                  className={`font-semibold ${profileColors.textColor} text-sm hover:underline cursor-pointer`}
                >
                  {Job}
                </span>
              </div>
              <p className="w-4/5 dark:text-white">{Bio}</p>
            </div>
          </div>
          <div className="flex flex-row gap-5">
            {[
              {
                label: "Followers",
                count: followers,
                link: self ? "/my/followers" : `/${username}/followers`,
              },
              {
                label: "Following",
                count: following,
                link: self ? "/my/following" : `/${username}/following`,
              },
              {
                label: "Achievements",
                count: achievements,
                link: self ? "/my/achievements" : `/${username}/achievements`,
              },
              {
                label: "Reputation",
                count: reputation,
                link: self ? "/my/reputation" : `/${username}/reputation`,
              },
            ].map(({ label, count, link }) => (
              <div key={label} className="flex flex-col items-center">
                <a
                  href={link}
                  className="text-base font-bold hover:underline"
                  aria-label={`View ${formatNumber(count)} ${label}`}
                >
                  {formatNumber(count)}
                </a>
                <span className="text-sm text-neutral-700 dark:text-neutral-400">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
