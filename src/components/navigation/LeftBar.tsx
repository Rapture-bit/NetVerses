import { useLocation, Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { Tooltip } from "antd";
import formatNumber from "@/utils/formatNumber";
import { useTranslation } from "react-i18next";

interface profileColors {
  bannerGradient: string;
  background: string;
  hoverBackground: string;
  borderColor: string;
  textColor: string;
}

export default function LeftBar({ userData }) {
  const { t } = useTranslation();
  const [hideButtons, setHideButtons] = useState<boolean>(false);
  const [leftPosition, setLeftPosition] = useState<string>("8%");
  const [isLoaded, setLoaded] = useState<boolean>(false);

  const [Job, setJob] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [posts, setPosts] = useState<number>(0);
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [username, setUsername] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("/images/avatars/default.jpg");
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [profileColor, setProfileColor] = useState<string>("purple");
  const [profileColors, setProfileColors] = useState<profileColors>({
    bannerGradient: `from-${profileColor}-700`,
    background: `bg-${profileColor}-800`,
    hoverBackground: `hover:bg-${profileColor}-800`,
    borderColor: `border-${profileColor}-800`,
    textColor: `text-${profileColor}-500`,
  });

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

  const [socialLinks, setSocialLinks] = useState([
    {
      href: "/",
      icon: "prime--twitter",
      platform: "Twitter",
      user: "@xenon",
      color: "text-blue-500",
    },
    {
      href: "/",
      icon: "devicon--linkedin",
      platform: "LinkedIn",
      user: "@xenon",
      color: "text-blue-700",
    },
    {
      href: "/",
      icon: "logos--discord-icon",
      platform: "Discord",
      user: "@quantarion_1",
      color: "text-indigo-500",
    },
    {
      href: "/",
      icon: "skill-icons--instagram",
      platform: "Instagram",
      user: "@xenon_official",
      color: "text-pink-500",
    },
    {
      href: "/",
      icon: "akar-icons--globe",
      platform: "Personal Website",
      user: "netverses.com",
      color: "dark:text-white text-black",
    },
  ]);

  useEffect(() => {
    setTimeout(() => {
      if (!userData) setLoaded(false);
      else setLoaded(true);
    }, 1 * 1000);
  }, [userData]);

  useEffect(() => {
    if (!userData) return;
    setUsername(userData.profile.username);
    setAvatar(userData.profile.profile_picture);
    setJob(userData.profile.career);
    setDescription(userData.profile.bio);
    setFollowers(userData.analytics.followers);
    setFollowing(userData.analytics.following);
    setProfileColor(userData.userPreferences.profileColor);
  }, [userData]);

  useEffect(() => {
    setProfileColors({
      bannerGradient: `from-${profileColor}-700`,
      background: `bg-${profileColor}-800`,
      hoverBackground: `hover:bg-${profileColor}-800`,
      borderColor: `border-${profileColor}-800`,
      textColor: `text-${profileColor}-500`,
    });
  }, [profileColor]);

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
    else if (path === "/my/settings") setSelectedPage("Settings");
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
              to={`/${username}`}
              className="absolute z-10 mt-7 ml-4 w-16 h-16 rounded-full overflow-hidden"
              aria-label={`Profile of ${username}`}
            >
              <div
                className="w-full h-full bg-cover rounded-full"
                style={{
                  backgroundImage: `url(${avatar})`,
                  backgroundPosition: "center",
                }}
              ></div>
            </Link>
          ) : (
            <div className="absolute z-10 mt-7 ml-4 w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
          )}

          <Tooltip placement="bottom" title="Edit Profile" mouseLeaveDelay={0}>
            <button
              className="absolute top-2 right-2 z-20 transition-colors inline-flex flex-shrink-0"
              aria-label="Edit Banner"
            >
              <span className="icon-[flowbite--edit-outline] text-[#c0c0c0] hover:text-white transition-all duration-300 text-xl"></span>
            </button>
          </Tooltip>
        </div>

        <div className="flex border border-neutral-700 flex-col space-y-3 py-5 px-7 rounded-lg darkerBackgroundColor text-center pt-28">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-1">
              {isLoaded ? (
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/${username.toLowerCase()}`}
                    className="text-xl font-semibold dark:text-white transition-colors duration-300 leading-none hover:underline"
                  >
                    {username}
                  </Link>

                  <div className="flex items-center gap-1 bg-black bg-opacity-20 rounded-md px-1 py-1 h-[1.5rem]">
                    <Tooltip placement="bottom" title="Official Member">
                      <span
                        className="icon-[ic--baseline-verified] w-4 h-4 text-[#facc15] cursor-pointer flex-shrink-0"
                        aria-label="Verified"
                      ></span>
                    </Tooltip>

                    <Tooltip placement="bottom" title="Early Creator">
                      <span className="icon-[material-symbols--diamond-rounded] w-4 h-4 text-[#3b82f6] cursor-pointer flex-shrink-0"></span>
                    </Tooltip>

                    <Tooltip placement="bottom" title="Business Account">
                      <span className="icon-[material-symbols--store-outline] w-4 h-4 text-[#a855f7] cursor-pointer flex-shrink-0"></span>
                    </Tooltip>

                    <Tooltip placement="bottom" title="StarPlus Member">
                      <span className="icon-[material-symbols--star-rounded] w-4 h-4 text-[#bb4bff] cursor-pointer flex-shrink-0"></span>
                    </Tooltip>
                  </div>
                </div>
              ) : (
                <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              )}
            </div>
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
                      Entrepreneur
                    </span>
                  </div>
                </>
              ) : (
                <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              )}
            </div>
          </div>

          {isLoaded ? (
            <p className="description text-sm text-left w-full whitespace-normal break-words">
              Proud chairman of NetVerses™, empowering connections and shaping
              the future of digital social platforms.
            </p>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          )}

          {isLoaded ? (
            <div className="flex justify-start gap-4 mt-3">
              {socialLinks.map(({ href, icon, platform, user, color }) => (
                <a
                  onMouseEnter={() => {
                    toggleArrayHover(true, platform);
                  }}
                  onMouseLeave={() => {
                    toggleArrayHover(false, platform);
                  }}
                  key={platform}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <span className={`${color} icon-[${icon}] w-6 h-6`}></span>
                  <AnimatePresence>
                    {hoverArray.find((element) => element.platform === platform)
                      ?.isHover && (
                      <motion.div
                        className="absolute textColor darkerBackgroundColor border borderColor text-sm px-2 py-1 rounded-md mt-2 shadow-lg text-center pointer-events-none"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 35 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          duration: 0.3,
                        }}
                      >
                        {user}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          )}

          <div className="border-t border-neutral-300 dark:border-neutral-700 my-3"></div>

          <div className="flex flex-row justify-center gap-8">
            {[
              { value: followers, label: "Followers" },
              { value: following, label: "Following" },
              { value: posts, label: "Posts" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {isLoaded ? (
                  <>
                    <Link to="#" className="text-lg font-bold hover:underline">
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

      <div className="flex flex-col space-y-4 justify-center items-center">
        <div className="relative flex items-center justify-center">
          <button
            aria-label={t("home.leftBar.home")}
            onClick={(e) => navigate("/")}
            className={`${selectedPage === "Home" ? "dark:brightness-125 brightness-95 font-medium" : ""} border border-neutral-700 p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all xl:w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
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
            className={`${selectedPage === "Explore" ? "dark:brightness-125 brightness-95 font-medium" : ""} border border-neutral-700 p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all xl:w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
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
                className={`${selectedPage === "Messages" ? "dark:brightness-125 brightness-95 font-medium" : ""} border border-neutral-700 p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
              >
                <span
                  className={`${selectedPage === "Messages" ? "icon-[ic--baseline-email]" : "icon-[ic--outline-email]"} w-6 h-6 flex items-center justify-center`}
                ></span>
                <span className="text-base">{t("home.leftBar.messages")}</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <button
                aria-label={t("home.leftBar.clubs")}
                onClick={(e) => navigate("/my/clubs")}
                className={`${selectedPage === "Clubs" ? "dark:brightness-125 brightness-95 font-medium" : ""} border border-neutral-700 p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
              >
                <span
                  className={`${selectedPage === "Clubs" ? "icon-[mage--globe-fill]" : "icon-[hugeicons--globe-02]"} w-6 h-6 flex items-center justify-center`}
                ></span>
                <span className="text-base">{t("home.leftBar.clubs")}</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <button
                aria-label={t("home.leftBar.settings")}
                onClick={(e) => navigate("/my/settings")}
                className={`${selectedPage === "Settings" ? "dark:brightness-125 brightness-95 font-medium" : ""} border border-neutral-700 p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
              >
                <span
                  className={`${selectedPage === "Settings" ? "icon-[fluent--settings-28-filled]" : "icon-[fluent--settings-28-regular]"} w-6 h-6 flex items-center justify-center`}
                ></span>
                <span className="text-base">{t("home.leftBar.settings")}</span>
              </button>
            </div>
          </>
        )}
        <div className="flex flex-col space-y-4 w-full items-center justify-center">
          <button
            aria-label={t("home.leftBar.starplus")}
            onClick={(e) => navigate("/starplus")}
            className={`${selectedPage === "StarPlus" ? "dark:brightness-125 brightness-95 font-medium" : ""} border border-neutral-700 p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all xl:w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
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
                className={`${selectedPage === "Explore" ? "dark:brightness-125 brightness-95 font-medium" : ""} border border-neutral-700 p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all xl:w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
              >
                <span
                  className={`icon-[material-symbols--more-up] w-6 h-6 flex items-center justify-center`}
                ></span>
                <span className="text-base xl:flex hidden">More</span>
              </button>
            </div>
          )}

          <div className="flex flex-row gap-2 mr-auto">
            <span className="text-xs mr-auto">© 2025 NetVerses</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
