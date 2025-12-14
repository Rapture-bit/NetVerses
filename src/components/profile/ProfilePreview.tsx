import { Link } from "react-router-dom";
import React, { useState, useLayoutEffect } from "react";
import formatNumber from "@/utils/formatNumber";

import BadgesList from "./BadgesList";

import {
  Volume2,
  VolumeX,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Award,
  Briefcase,
  MapPin,
  Calendar,
  UserPlus,
  Mail,
  Rocket,
  Target,
  Users,
  Star,
  Lightbulb,
  GraduationCap,
} from "lucide-react";

import { Tooltip } from "antd";

const ProfilePreview = ({ username }) => {
  const [actualUsername, setActualUsername] = useState<string>("Elon Musk"); // To be updated with API
  const [Avatar, setAvatar] = useState<string>("/images/avatars/default.jpg"); // To be updated with API
  const [Banner, setBanner] = useState<string>(""); // To be updated with API
  const [self, setSelf] = useState<boolean>(true); // To be updated with API
  const [Bio, setBio] = useState<string>(
    "Proud chairman of NetVerses™, empowering connections and shaping the future of digital social platforms.",
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

  const [audioOn, setAudioOn] = useState<boolean>(false);

  const toggleAudio = () => {
    setAudioOn(!audioOn);
  };

  const [badges, setBadges] = useState([
    { name: "Official Member" },
    { name: "Early Creator" },
    { name: "Star+" },
    { name: "Business Account" },
  ]);

  const [socialMedia, setSocialMedia] = useState([
    { name: "Twitter", icon: Twitter, link: "@xenon" },
    { name: "LinkedIn", icon: Linkedin, link: "/in/xenon" },
    { name: "GitHub", icon: Github, link: "github.com/xenon" },
    { name: "Instagram", icon: Instagram, link: "@xenon" },
  ]);

  return (
    <div className="relative border-t-0 flex flex-col rounded-md mx-4 sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor">
      <div className="relative flex flex-col rounded-md border borderColor">
        <div
          className={`bg-gradient-to-b ${profileColors.bannerGradient} to-transparent h-36 w-full relative top-0 left-0 rounded-t-lg`}
        >
          <div className="absolute flex flex-row space-x-2 top-4 right-3 sm:top-3 sm:right-3">
            {self && (
              <Tooltip placement="bottom" title="Edit Banner">
                <button
                  className="w-8 h-8 flex items-center justify-center bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-gray-800 transition-all"
                  aria-label="Edit Banner"
                >
                  <span
                    className="icon-[tabler--photo-edit] w-4 h-4 text-gray-100"
                    aria-hidden="true"
                  ></span>
                </button>
              </Tooltip>
            )}

            <Tooltip
              placement="bottom"
              title={!audioOn ? "Background Music On" : "Background Music Off"}
            >
              <button
                onClick={toggleAudio}
                className="w-8 h-8 flex items-center justify-center bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-gray-800 transition-all"
                aria-label={audioOn ? "Mute audio" : "Unmute audio"}
              >
                {audioOn ? (
                  <Volume2 className="w-4 h-4 text-gray-100" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-100" />
                )}
              </button>
            </Tooltip>
          </div>

          <Link
            to={`/${username}`}
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
              className={`w-full h-full rounded-full border-2 sm:border-4 border-gray-900 bg-gradient-to-br from-${profileColor}-500 to-${profileColor}-600 flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-${profileColor}-500/50 hover:scale-105`}
            >
              <svg viewBox="0 0 100 100" className="w-10 h-10 sm:w-14 sm:h-14">
                <circle cx="50" cy="35" r="15" fill="white" opacity="0.9" />
                <path
                  d="M 30 70 Q 50 55 70 70 L 70 85 Q 50 70 30 85 Z"
                  fill="white"
                  opacity="0.9"
                />
              </svg>
            </div>
          </Link>
        </div>

        <div className="p-4 sm:pl-5 sm:py-4 flex mt-5 flex-col gap-3">
          <div className="flex items-center pl-2 justify-between">
            <div className="inline-flex items-center space-x-2">
              <span className="text-xl font-semibold dark:text-white transition-colors duration-300 leading-none">
                Xenon
              </span>

              <BadgesList badges={badges} profileColor={profileColor} />
            </div>

            <div className="flex items-center gap-2">
              {self && (
                <button
                  className={`rounded-md ${profileColors.background} font-semibold text-white py-1.5 px-6 transition-all duration-300 hover:brightness-95`}
                  aria-label="Edit"
                >
                  Edit
                </button>
              )}

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
            </div>
          </div>
          <div className="pl-2 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-1">
                <div className="flex-row space-x-1 inline-flex">
                  <span
                    className={`icon-[mingcute--suitcase-fill] w-[1.15rem] h-[1.15rem] ${profileColors.textColor}`}
                  ></span>
                  <span
                    className={`font-semibold ${profileColors.textColor} text-sm hover:underline cursor-pointer`}
                  >
                    {Job}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1 text-gray-500 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>San Francisco</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>March 2023</span>
                  </div>
                </div>

                <div className="flex py-1 justify-between md:justify-start md:gap-10 text-center">
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
                      label: "Reputation",
                      count: reputation,
                      link: self ? "/my/reputation" : `/${username}/reputation`,
                    },
                  ].map(({ label, count, link }) => (
                    <div
                      key={label}
                      className="flex flex-row space-x-1 items-center"
                    >
                      <a
                        href={link}
                        className="text-base font-bold text-black dark:text-white hover:underline"
                      >
                        {formatNumber(count)}
                      </a>
                      <span className="text-base text-neutral-700 dark:text-neutral-400">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">{Bio}</p>
              </div>
            </div>

            <div className="mt-2">
              <h2 className="text-gray-100 text-sm font-semibold mb-2">
                Connect
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {socialMedia.map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className={`flex items-center gap-2 p-2 border borderColor rounded-lg hover:border-${profileColor}-500/50 hover:bg-${profileColor}-500/10 transition-colors group`}
                  >
                    <social.icon
                      className={`w-4 h-4 text-gray-400 group-hover:text-${profileColor}-400 transition-colors`}
                    />
                    <div className="min-w-0">
                      <div className="text-gray-100 text-xs">{social.name}</div>
                      <div className="text-gray-500 text-xs truncate">
                        {social.link}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
