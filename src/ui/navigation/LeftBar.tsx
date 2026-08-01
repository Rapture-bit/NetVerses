import { useLocation, Link } from "react-router-dom";

import { useState, useLayoutEffect, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Tooltip from "@/ui/Tooltip";
import formatNumber from "@/utils/formatNumber";
import { useTranslation } from "react-i18next";

import { UserContext } from "@/context/UserContext";

interface profileColors {
  bannerGradient: string;
  background: string;
  hoverBackground: string;
  borderColor: string;
  textColor: string;
}

interface dataProps {
  username: string | undefined | null;
  profile_picture: string | undefined | null;
  career: string | undefined | null;
  bio: string | undefined | null;
  followers: number | undefined | null;
  following: number | undefined | null;
  color: string | undefined | null;
  badges: any;
}

const capitalizeFirstAlphabetic = (str?: string): string | null => {
  if (!str) return null;
  if (str === "sms") {
    return "SMS";
  }

  const chars = str.split("");

  for (let i = 0; i < chars.length; i++) {
    if (/[a-zA-Z]/.test(chars[i])) {
      chars[i] = chars[i].toUpperCase();
      break;
    }
  }

  return chars.join("");
};

export default function LeftBar() {
  const { t } = useTranslation();
  const { userData } = useContext(UserContext)!;

  const [hideButtons, setHideButtons] = useState<boolean>(false);
  const [leftPosition, setLeftPosition] = useState<string>("8%");
  const [isLoaded, setLoaded] = useState<boolean>(false);

  const [postsNumber, setPostsNumber] = useState<number>(0);
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [profileColors, setProfileColors] = useState<profileColors>({
    bannerGradient: `from-${userData?.color}-700`,
    background: `bg-${userData?.color}-800`,
    hoverBackground: `hover:bg-${userData?.color}-800`,
    borderColor: `border-${userData?.color}-800`,
    textColor: `text-${userData?.color}-500`,
  });
  const [followersLabel, setFollowersLabel] = useState<string>(
    t("general.followers"),
  );
  const [followingLabel, setFollowingLabel] = useState<string>(
    t("general.following"),
  );
  const [postsLabel, setPostsLabel] = useState<string>(t("general.posts"));

  const navigate = useNavigate();
  const location = useLocation();

  const [hoverArray, setHoverArray] = useState([
    {
      platform: "Twitter",
      isHover: false,
    },
    {
      platform: "Instagram",
      isHover: false,
    },
    {
      platform: "LinkedIn",
      isHover: false,
    },
    {
      platform: "Discord",
      isHover: false,
    },
    {
      platform: "Personal Website",
      isHover: false,
    },
  ]);

  useEffect(() => {
    setTimeout(() => {
      if (!userData) setLoaded(false);
      else setLoaded(true);
    }, 1 * 1000);
  }, [userData]);

  useEffect(() => {
    setProfileColors({
      bannerGradient: `from-${userData?.color}-700`,
      background: `bg-${userData?.color}-800`,
      hoverBackground: `hover:bg-${userData?.color}-800`,
      borderColor: `border-${userData?.color}-800`,
      textColor: `text-${userData?.color}-500`,
    });
  }, [userData?.color]);

  const updatePosition = () => {
    const windowHeight = window.innerHeight;
    if (windowHeight < 740) setLeftPosition("6%");
    else if (windowHeight >= 700 && windowHeight < 900) setLeftPosition("7%");
    else setLeftPosition("8%");
  };

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  useEffect(() => {
    const checkHeight = () => setHideButtons(window.innerHeight < 900);
    window.addEventListener("resize", checkHeight);
    checkHeight();
    return () => window.removeEventListener("resize", checkHeight);
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setSelectedPage("Home");
    else if (path === "/my/messages") setSelectedPage("Messages");
    else if (path === "/my/clubs") setSelectedPage("Clubs");
    else if (path === "/my/channels") setSelectedPage("Channels");
    else if (path === "/explore") setSelectedPage("Explore");
    else if (path === "/starplus") setSelectedPage("StarPlus");
    else setSelectedPage("");
  }, [location]);

  const toggleArrayHover = (mouseIn: boolean, platform: string) => {
    const array = hoverArray.find((element) => element.platform === platform);
    if (!array) return;

    let newArray = hoverArray.filter((item) => item.platform !== platform);
    array.isHover = mouseIn;

    newArray.push(array);
    if (!newArray) return;

    console.log(array, newArray);

    setHoverArray(newArray);
  };

  return (
    <>
      <nav
        className="fixed xl:flex hidden top-14 xl:top-20 h-[90vh] w-[16vw] min-w-[200px] max-w-[300px] p-4 roboto dark:text-white text-black flex-col items-center space-y-6 z-10 transition-all duration-200"
        style={{ left: leftPosition }}
      >
        <div className="relative">
          <div
            className={`bg-gradient-to-b ${profileColors.bannerGradient} to-transparent h-20 w-full absolute top-0 left-0 rounded-t-lg`}
          >
            {isLoaded ? (
              <Link
                to={`/u/${userData?.username.toLowerCase()}`}
                className="absolute z-10 top-7 left-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden cursor-pointer"
                aria-label={`Profile of ${userData?.username}`}
              >
                <div
                  className={`w-full h-full rounded-full border sm:border-2 border-${userData?.color}-900 bg-gradient-to-br from-${userData?.color}-500 to-${userData?.color}-600 flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-${userData?.color}-500/50 hover:scale-105`}
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
            ) : (
              <div className="absolute z-10 mt-7 ml-4 w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
            )}

            <div className="absolute top-2 right-2 z-20 flex flex-row space-x-1">
              <div className="relative">
                <Tooltip label="Share">
                  <button
                    onClick={(e) => navigate("/my/settings")}
                    className="transition-colors inline-flex flex-shrink-0"
                    aria-label="Share Profile"
                  >
                    <span className="icon-[humbleicons--share] text-[#e2e2e2] hover:text-white transition-all duration-300 text-lg"></span>
                  </button>
                </Tooltip>
              </div>

              <div className="relative">
                <Tooltip label="Settings">
                  <button
                    onClick={(e) => navigate("/my/settings")}
                    className="transition-colors inline-flex flex-shrink-0"
                    aria-label="Settings"
                  >
                    <span className="icon-[material-symbols--settings-outline] text-[#e2e2e2] hover:text-white transition-all duration-300 text-lg"></span>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="flex border borderColor flex-col space-y-3 py-5 px-7 rounded-lg darkerBackgroundColor pt-28">
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-col">
                {isLoaded ? (
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/u/${userData?.username?.toLowerCase()}`}
                      className="group inline-flex items-center gap-2"
                    >
                      <span className="text-xl font-semibold text-gray-900 dark:text-white leading-none transition-all duration-300 group-hover:text-purple-500">
                        {userData?.display_name ||
                          capitalizeFirstAlphabetic(userData?.username) ||
                          "User"}
                      </span>

                      {/* <Sparkles className="w-4 h-4 text-purple-500" /> */}
                    </Link>
                  </div>
                ) : (
                  <div className="h-5 w-28 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
                )}

                {isLoaded ? (
                  <span className="w-fit text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide hover:text-purple-400 transition-colors duration-120 cursor-pointer">
                    @{userData?.username}
                  </span>
                ) : (
                  <div className="mt-1 h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
                )}
              </div>
              {userData?.career && (
                <div className="flex flex-col gap-1">
                  {isLoaded ? (
                    <>
                      <div className="flex-row space-x-1 inline-flex">
                        <span
                          className={`icon-[mingcute--suitcase-fill] w-[1.15rem] h-[1.15rem] ${profileColors.textColor}`}
                        ></span>
                        <span
                          className={`font-medium ${profileColors.textColor} text-sm hover:underline cursor-pointer`}
                        >
                          {userData?.career}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  )}
                </div>
              )}
            </div>

            {isLoaded ? (
              <p className="dark:text-gray-300 text-black text-sm leading-relaxed text-left m-0 p-0">
                {userData?.bio}
              </p>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            )}

            <div className="border-t borderColor my-3"></div>

            <div className="flex flex-row justify-center gap-8">
              {[
                { value: userData?.followers, label: followersLabel },
                { value: userData?.following, label: followingLabel },
                { value: postsNumber, label: postsLabel },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  {isLoaded ? (
                    <>
                      <Link
                        to="#"
                        className="text-lg font-bold hover:underline"
                      >
                        {formatNumber(item.value)}
                      </Link>
                      <span className="text-xs textColor">{item.label}</span>
                    </>
                  ) : (
                    <>
                      <div className="h-5 w-10 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-3 w-10 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2 justify-center items-center">
          <div className="relative flex items-center justify-center">
            <button
              aria-label={t("home.leftBar.home")}
              onClick={(e) => navigate("/")}
              className={`${selectedPage === "Home" ? "dark:brightness-125 brightness-95 font-medium" : ""} border borderColor p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all xl:w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
            >
              <span
                className={`${selectedPage === "Home" ? "icon-[fluent--home-16-filled]" : "icon-[fluent--home-16-regular]"} w-6 h-6 flex items-center justify-center`}
              ></span>
              <span className="text-base xl:flex hidden">
                {t("home.leftBar.home")}
              </span>
            </button>
          </div>
          <div className="relative flex items-center justify-center">
            <button
              aria-label={t("home.leftBar.explore")}
              onClick={(e) => navigate("/explore")}
              className={`${selectedPage === "Explore" ? "dark:brightness-125 brightness-95 font-medium" : ""} border borderColor p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all xl:w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
            >
              <span
                className={`${selectedPage === "Explore" ? "icon-[mingcute--search-fill]" : "icon-[mingcute--search-line]"} w-6 h-6 flex items-center justify-center`}
              ></span>
              <span className="text-base xl:flex hidden">
                {t("home.leftBar.explore")}
              </span>
            </button>
          </div>

          {!hideButtons && (
            <>
              <div className="relative flex items-center justify-center">
                <button
                  aria-label={t("home.leftBar.messages")}
                  onClick={(e) => navigate("/my/messages")}
                  className={`${selectedPage === "Messages" ? "dark:brightness-125 brightness-95 font-medium" : ""} border borderColor p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
                >
                  <span
                    className={`${selectedPage === "Messages" ? "icon-[ic--baseline-email]" : "icon-[ic--outline-email]"} w-6 h-6 flex items-center justify-center`}
                  ></span>
                  <span className="text-base">
                    {t("home.leftBar.messages")}
                  </span>
                </button>
              </div>

              <div className="relative flex items-center justify-center">
                <button
                  aria-label={t("home.leftBar.clubs")}
                  onClick={(e) => navigate("/my/clubs")}
                  className={`${selectedPage === "Clubs" ? "dark:brightness-125 brightness-95 font-medium" : ""} border borderColor p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
                >
                  <span
                    className={`${selectedPage === "Clubs" ? "icon-[mage--globe-fill]" : "icon-[hugeicons--globe-02]"} w-6 h-6 flex items-center justify-center`}
                  ></span>
                  <span className="text-base">{t("home.leftBar.clubs")}</span>
                </button>
              </div>

              <div className="relative flex items-center justify-center">
                <a
                  href="/my/channels"
                  aria-label={t("home.leftBar.channels")}
                  className={`${selectedPage === "Channels" ? "dark:brightness-125 brightness-95 font-medium" : ""} border borderColor p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
                >
                  <span
                    className={`${selectedPage === "Channels" ? "icon-[streamline-ultimate--megaphone-bold]" : "icon-[streamline-ultimate--megaphone]"} w-6 h-6 flex items-center justify-center`}
                  ></span>
                  <span className="text-base">
                    {t("home.leftBar.channels")}
                  </span>
                </a>
              </div>
            </>
          )}
          <div className="flex flex-col space-y-4 w-full items-center justify-center">
            <button
              aria-label={t("home.leftBar.starplus")}
              onClick={(e) => navigate("/starplus")}
              className={`${selectedPage === "StarPlus" ? "dark:brightness-125 brightness-95 font-medium" : ""} border borderColor p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all xl:w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
            >
              <span
                className={`${selectedPage === "StarPlus" ? "icon-[material-symbols--star]" : "icon-[material-symbols--star-outline]"} w-6 h-6 flex items-center justify-center`}
              ></span>
              <span className="text-base xl:flex hidden">
                {t("home.leftBar.starplus")}
              </span>
            </button>

            {hideButtons && (
              <div className="relative flex items-center justify-center">
                <button
                  aria-label={"More"}
                  onClick={(e) => navigate("/explore")}
                  className={`${selectedPage === "Explore" ? "dark:brightness-125 brightness-95 font-medium" : ""} border borderColor p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all xl:w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
                >
                  <span
                    className={`icon-[material-symbols--more-up] w-6 h-6 flex items-center justify-center`}
                  ></span>
                  <span className="text-base xl:flex hidden">More</span>
                </button>
              </div>
            )}

            <div className="flex flex-row gap-2 mr-auto">
              <span className="text-xs mr-auto">© 2026 NetVerses</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
