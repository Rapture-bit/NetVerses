import { Link } from "react-router-dom";
import React, { useState, useLayoutEffect } from "react";
import BadgesList from "./BadgesList";

import {
  Volume2,
  VolumeX,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  MapPin,
  Calendar,
  User,
  Cake,
  IdCard,
  UserPen,
} from "lucide-react";

import Pronouns from "./Pronouns";
import StatsTab from "./StatsTab";

import { Tooltip } from "antd";

const ProfilePreview = ({ username }) => {
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
  const [profileColor, setProfileColor] = useState<string>("purple"); // To be updated with API
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
    <div className="relative border-t-0 flex flex-col rounded-lg mx-4 sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor">
      <div className="relative flex flex-col rounded-lg border borderColor">
        <div className={`relative h-36 w-full rounded-t-lg`}>
          {/* Banner gradient */}
          <div
            className={`absolute inset-0 rounded-t-lg bg-gradient-to-b ${profileColors.bannerGradient} to-transparent overflow-hidden`}
          ></div>

          {/* Dots overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)`,
              backgroundSize: "10px 10px",
            }}
          ></div>

          {/* Buttons and profile picture */}
          <div className="absolute flex flex-row space-x-2 top-4 right-3 sm:top-3 sm:right-3">
            {self && (
              <Tooltip
                placement="bottom"
                mouseLeaveDelay={0}
                title="Edit Banner"
              >
                <button
                  className="w-8 h-8 flex items-center justify-center bg-gray-800/80 backdrop-blur-lg rounded-full hover:bg-gray-800 transition-all"
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
              mouseLeaveDelay={0}
              title={!audioOn ? "Background Music On" : "Background Music Off"}
            >
              <button
                onClick={toggleAudio}
                className="w-8 h-8 flex items-center justify-center bg-gray-800/80 backdrop-blur-lg rounded-full hover:bg-gray-800 transition-all"
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
            className="absolute z-50 top-20 ml-4 w-24 h-24"
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
              className={`w-full h-full rounded-full border sm:border-4 border-${profileColor}-900 bg-gradient-to-br from-${profileColor}-500 to-${profileColor}-600 flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-${profileColor}-500/50 hover:scale-105`}
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

        <div className="p-4 sm:pl-5 sm:py-4 flex mt-4 flex-col gap-1">
          <div className="flex items-center pl-2 justify-between">
            <div className="inline-flex items-center space-x-2">
              <div className="flex flex-col space-y-0.5">
                <div className="space-x-2 items-center inline-flex">
                  <div className="flex flex-col space-y-1">
                    <div className="space-x-2 items-center inline-flex">
                      <span className="text-xl font-semibold dark:text-white transition-colors duration-300 leading-none">
                        Xenon
                      </span>
                      <BadgesList badges={badges} profileColor={profileColor} />
                    </div>
                  </div>
                </div>
              </div>
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
          <div className="pl-2 flex flex-col gap-1">
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-1">
                <div className="flex flex-row space-x-2 -mt-1">
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

                  <Pronouns sex={"M"} />
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1 text-gray-500 text-sm">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-neutral-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>San Francisco</span>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>March 2023</span>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-500">
                      <IdCard className="w-3.5 h-3.5" />
                      <span>1234567890</span>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-500">
                      <Cake className="w-3.5 h-3.5" />
                      <span>12/12/2008</span>
                    </div>
                  </div>
                </div>

                <p className="dark:text-gray-300 text-black text-sm leading-relaxed">
                  {Bio}
                </p>
              </div>
            </div>

            <StatsTab
              followers={followers}
              following={following}
              self={self}
              reputation={reputation}
              username={username}
            />

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
                      className={`w-4 h-4 dark:text-gray-400 text-neutral-500 group-hover:text-${profileColor}-400 transition-colors`}
                    />
                    <div className="min-w-0">
                      <div className="dark:text-gray-100 text-black text-xs">
                        {social.name}
                      </div>
                      <div className="dark:text-gray-500 text-neutral-800 text-xs truncate">
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
