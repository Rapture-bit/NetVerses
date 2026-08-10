import { Link, useNavigate } from "react-router-dom";
import React, { useState, useLayoutEffect, useEffect } from "react";
import BadgesList from "./BadgesList";

import Tooltip from "@/ui/Tooltip";

import { useTranslation } from "react-i18next";

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
import ZodiacSign from "./ZodiacSign";
import StatsTab from "./StatsTab";
import EditProfileMenu from "../modal/Menu/EditProfileMenu";

import clsx from "clsx";
import { profileColorsMap } from "./profileColorsMap";

const ProfilePreview = ({ profileData }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [Avatar, setAvatar] = useState<string>(profileData.profile_picture); // To be updated with API
  const [Banner, setBanner] = useState<string>(profileData.banner); // To be updated with API
  const [self, setSelf] = useState<boolean>(profileData.is_self); // To be updated with API
  const [followers, setFollselfowers] = useState<number>(profileData.followers); // To be updated with API
  const [numberOfPosts, setNumberOfPosts] = useState<number>(
    profileData.number_of_posts || 0,
  );
  const [connections, setConnections] = useState<number>(
    profileData.connections,
  ); // To be updated with API
  const [following, setFollowing] = useState<number>(profileData.following); // To be updated with API
  const [Job, setJob] = useState<string>(profileData.career); // To be updated with API
  const [profileColor, setProfileColor] = useState<string>(
    profileData?.preferences.colorScheme,
  ); // To be updated with API
  const [profileColors, setProfileColors] = useState(
    profileColorsMap[profileColor] || profileColorsMap.purple,
  );
  const [isMusicHovered, setMusicHovered] = useState<boolean>(false);
  const [socialMediaConnections, setSocialMediaConnections] = useState<
    any | null
  >();
  const [badges, setBadges] = useState<any>(profileData.badges);
  useLayoutEffect(() => {
    setProfileColors(profileColorsMap[profileColor] || profileColorsMap.purple);
  }, [profileColor]);

  const [audioOn, setAudioOn] = useState<boolean>(false);

  const toggleAudio = () => {
    setAudioOn(!audioOn);
  };

  useEffect(() => {
    if (
      !profileData.socialMediaConnections ||
      (!profileData.socialMediaConnections.twitter &&
        !profileData.socialMediaConnections.instagram &&
        !profileData.socialMediaConnections.linkedin &&
        !profileData.socialMediaConnections.github)
    ) {
      return setSocialMediaConnections(null);
    }

    setSocialMediaConnections([
      {
        name: "Twitter",
        icon: Twitter,
        link: profileData.socialMediaConnections.twitter,
      },
      {
        name: "LinkedIn",
        icon: Linkedin,
        link: profileData.socialMediaConnections.linkedin,
      },
      {
        name: "GitHub",
        icon: Github,
        link: profileData.socialMediaConnections.github,
      },
      {
        name: "Instagram",
        icon: Instagram,
        link: profileData.socialMediaConnections.instagram,
      },
    ]);
  }, [profileData.socialMediaConnections]);

  return (
    <>
      <EditProfileMenu visible={false} />
      <div className="relative border-t-0 flex flex-col rounded-lg mx-4 sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor">
        <div className="relative flex flex-col rounded-lg border borderColor">
          <div className={`relative h-36 w-full rounded-t-lg`}>
            <div
              className={clsx(
                "absolute inset-0 rounded-t-lg bg-gradient-to-b to-transparent overflow-hidden",
                profileColors.bannerGradient,
              )}
            ></div>

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                backgroundSize: "10px 10px",
              }}
            ></div>

            <div className="absolute flex flex-row space-x-2 top-4 right-3 sm:top-3 sm:right-3">
              {self && (
                <div className="relative">
                  <Tooltip label="Change Color">
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-gray-800/80 backdrop-blur-lg rounded-full hover:bg-gray-800 transition-all"
                      aria-label="Change Color"
                    >
                      <span
                        className="icon-[mdi--color] w-4 h-4 text-gray-100"
                        aria-hidden="true"
                      ></span>
                    </button>
                  </Tooltip>
                </div>
              )}

              {/* Fix the Audio (Tooltip) */}
              {/* Start */}
              {/*             <Tooltip
              placement="bottom"
              mouseLeaveDelay={0}
              title={!audioOn ? "Set Music On" : "Set Music Off"}
            >
              <button
                onClick={toggleAudio}
                onMouseEnter={() => setMusicHovered(true)}
                onMouseLeave={() => setMusicHovered(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-800/80 backdrop-blur-lg rounded-full hover:bg-gray-800 transition-all"
                aria-label={audioOn ? "Mute audio" : "Unmute audio"}
              >
                {(isMusicHovered ? !audioOn : audioOn) ? (
                  <Volume2 className="w-4 h-4 text-gray-100" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-100" />
                )}
              </button>
            </Tooltip> */}
              {/* End */}
            </div>

            <Link
              to={`/u/${profileData.username.toLowerCase()}`}
              className="absolute z-10 top-20 ml-4 w-24 h-24"
              aria-label={`Profile of ${profileData.username}`}
              style={{
                display: "block",
                width: "6rem",
                height: "6rem",
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <div
                className={`w-full h-full rounded-full border sm:border-4 ${profileColors.pfp.borderColor} bg-gradient-to-br ${profileColors.pfp.fromGradient} ${profileColors.pfp.toGradient} flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-${profileColor}-500/50 hover:scale-105`}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="w-10 h-10 sm:w-14 sm:h-14"
                >
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
                        <span className="text-xl hover:underline cursor-pointer font-semibold dark:text-white transition-colors duration-300 leading-none">
                          {profileData.display_name}
                        </span>
                        <BadgesList
                          badges={badges}
                          profileColor={profileColor}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {self && (
                  <button
                    onClick={() => navigate("/my/settings")}
                    className={clsx(
                      `rounded-lg font-semibold text-white py-1.5 px-6 transition-all duration-300 hover:brightness-95`,
                      profileColors.background,
                    )}
                    aria-label="Edit"
                  >
                    {t("home.editProfile")}
                  </button>
                )}

                {!self && (
                  <Tooltip label="Follow">
                    <button
                      className={clsx(
                        `rounded-md gap-1 flex items-center bg-transparent border font-semibold dark:text-white py-2 px-3 transition-all duration-300 text-sm`,
                        profileColors.hoverBackground,
                        profileColors.borderColor,
                      )}
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
                  <Tooltip label="Message">
                    <button
                      className={clsx(
                        `rounded-md gap-1 flex items-center hover:text-white bg-transparent border font-semibold dark:text-white py-2 px-3 transition-all duration-300 text-sm`,
                        profileColors.hoverBackground,
                        profileColors.borderColor,
                      )}
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
              <div className="flex flex-col gap-1 mt-1.5">
                <div className="flex flex-col gap-1">
                  {(Job || profileData.zodiac_sign || profileData.pronouns) && (
                    <div className="flex flex-row gap-3 -mt-1 flex-wrap">
                      {Job && (
                        <div className="flex-row space-x-1 inline-flex">
                          <Tooltip label="Career">
                            <span
                              className={clsx(
                                `icon-[mingcute--suitcase-fill] w-[1.15rem] h-[1.15rem]`,
                                profileColors.textColor,
                              )}
                            ></span>
                          </Tooltip>
                          <span
                            className={clsx(
                              `font-semibold text-sm hover:underline cursor-pointer`,
                              profileColors.textColor,
                            )}
                          >
                            {Job}
                          </span>
                        </div>
                      )}

                      {profileData.zodiac_sign && (
                        <ZodiacSign sign={profileData.zodiac_sign} />
                      )}
                      {profileData.pronouns && (
                        <Pronouns
                          sex={
                            profileData.pronouns === "He/Him"
                              ? "M"
                              : profileData.pronouns === "She/Her"
                                ? "F"
                                : profileData.pronouns === "They/Them"
                                  ? "T"
                                  : ""
                          }
                          customPronouns={null}
                        />
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1 text-gray-500 text-sm">
                    <div className="flex items-center gap-4 text-sm">
                      {profileData.location && (
                        <div className="flex items-center gap-1 text-neutral-500">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{profileData.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-neutral-500">
                        <Tooltip label="Username">
                          <User className="w-4 h-4" />
                        </Tooltip>

                        <span>
                          {profileData.username.replace(
                            profileData.username.charAt(0),
                            profileData.username.charAt(0).toUpperCase(),
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-500">
                        <Tooltip label="Creation Date">
                          <Calendar className="w-3.5 h-3.5" />
                        </Tooltip>
                        <span>
                          {new Date(
                            profileData.creation_date,
                          ).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                      {profileData.birthDate && (
                        <div className="flex items-center gap-1 text-neutral-500">
                          <Cake className="w-3.5 h-3.5" />
                          <span>{profileData.birthDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="dark:text-gray-300 text-black text-sm leading-relaxed">
                    {profileData.bio}
                  </p>
                </div>
              </div>

              <StatsTab
                followers={followers}
                following={following}
                posts={numberOfPosts}
                self={self}
                connections={connections}
                username={profileData.username}
              />

              {socialMediaConnections && (
                <div className="mt-2">
                  <h2 className="text-gray-100 text-sm font-semibold mb-2">
                    Connect
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {socialMediaConnections.map((social: any) => (
                      <a
                        key={social.name}
                        href="#"
                        className={`flex items-center gap-2 p-2 border borderColor rounded-lg ${profileColors.socialMediaProperties.borderColor} ${profileColors.socialMediaProperties.hoverBackground} transition-colors duration-300 group`}
                      >
                        <social.icon
                          className={`w-4 h-4 dark:text-gray-400 text-neutral-500 ${profileColors.socialMediaProperties.groupHoverText} transition-colors duration-300`}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePreview;
