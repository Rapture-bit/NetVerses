import React, { useState, useEffect } from "react";
import formatNumber from "@/utils/formatNumber";
import { getCssVariable } from "@/utils/getCssVariable";

export default function LeftBar() {
  const [isAuth, setAuth] = useState<boolean>(true); // Change with API data
  const [hideButtons, setHideButtons] = useState<boolean>(false);
  const [leftPosition, setLeftPosition] = useState<string>("8%");
  const [description, setDescription] =
    useState<string>(`Proud chairman of NetVerse™, empowering connections and shaping the
    future of digital social platforms.`);
  const [posts, setPosts] = useState<number>(300);
  const [followers, setFollowers] = useState<number>(20000);
  const [following, setFollowing] = useState<number>(3500);
  const [username, setUsername] = useState<string>("Xenon");
  const [avatar, setAvatar] = useState<string>("/images/avatars/default.jpg");
  const [selectedPage, setSelectedPage] = useState<string>("");

  const updatePosition = () => {
    const windowHeight = window.innerHeight;

    if (windowHeight < 740) {
      setLeftPosition("6%");
    } else if (windowHeight >= 700 && windowHeight < 900) {
      setLeftPosition("7%");
    } else {
      setLeftPosition("8%");
    }
  };

  useEffect(() => {
    updatePosition();

    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  useEffect(() => {
    const checkHeight = () => {
      if (window.innerHeight < 900) {
        setHideButtons(true);
      } else {
        setHideButtons(false);
      }
    };

    window.addEventListener("resize", checkHeight);
    checkHeight();

    return () => {
      window.removeEventListener("resize", checkHeight);
    };
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/") {
      setSelectedPage("Home");
    } else if (window.location.pathname === "/messages") {
      setSelectedPage("Messages");
    } else if (window.location.pathname === "/my/clubs") {
      setSelectedPage("Clubs");
    } else if (window.location.pathname === "/explore") {
      setSelectedPage("Explore");
    } else if (window.location.pathname === "/starplus") {
      setSelectedPage("StarPlus");
    } else if (window.location.pathname === "/my/vault") {
      setSelectedPage("Vault");
    } else if (window.location.pathname === "/my/family") {
      setSelectedPage("Family");
    } else {
      setSelectedPage("");
    }
  }, [window.location]);

  if (isAuth) {
    return (
      <nav
        className="fixed xl:flex hidden top-14 xl:top-20 h-[90vh] w-[16vw] min-w-[200px] max-w-[300px] p-4 roboto dark:text-white text-black flex-col items-center space-y-6 z-40 transition-all duration-200"
        style={{
          left: leftPosition,
        }}
      >
        <div className="relative">
          <div className="bg-gradient-to-b from-violet-700 to-transparent h-20 w-full absolute top-0 left-0 rounded-t-lg">
            <a
              href={`/${username}`}
              className="absolute z-10 mt-7 ml-4 w-16 h-16"
              aria-label={`Profile of ${username}`}
              style={{
                display: "block",
                width: "4.3rem",
                height: "4.3rem",
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <div
                className="w-full ml-1 h-full bg-cover rounded-full overflow-hidden"
                style={{
                  backgroundImage: `url(${avatar})`,
                  backgroundPosition: "center",
                }}
              ></div>
            </a>
          </div>

          <div className="flex flex-col space-y-6 justify-center items-center py-5 px-7 rounded-lg darkerBackgroundColor text-center pt-28">
            <div className="flex flex-row justify-center gap-8">
              <div className="flex flex-col items-center">
                <a
                  href="/my/posts"
                  className="text-lg font-bold hover:underline"
                  aria-label={`View ${formatNumber(posts)} posts`}
                >
                  {formatNumber(posts)}
                </a>
                <span className="text-xs textColor">Posts</span>{" "}
              </div>
              <div className="flex flex-col items-center">
                <a
                  href="/my/followers"
                  className="text-lg font-bold hover:underline"
                  aria-label={`View ${formatNumber(followers)} followers`}
                >
                  {formatNumber(followers)}
                </a>
                <span className="text-xs textColor">Followers</span>{" "}
              </div>
              <div className="flex flex-col items-center">
                <a
                  href="/my/following"
                  className="text-lg font-bold hover:underline"
                  aria-label={`View ${formatNumber(following)} following`}
                >
                  {formatNumber(following)}
                </a>
                <span className="text-xs textColor">Following</span>{" "}
              </div>
            </div>

            <p className="description text-sm text-left w-full whitespace-normal break-words">
              {description}
            </p>

            <div className="flex flex-row gap-6 justify-center items-center">
              <button
                aria-label="Edit Profile"
                className="rounded-md bg-purple-700 text-white hover:brightness-125 duration-200 transition-all px-2 py-1 text-sm"
              >
                Edit Profile
              </button>
              <button
                aria-label="Visit Profile"
                onClick={() => (window.location.href = "/xenon")}
                className="rounded-md bg-transparent border-violet-700 border hover:bg-purple-700 duration-200 transition-all px-2 py-1 text-sm"
              >
                Visit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 justify-center items-center">
          <div className="relative flex items-center justify-center">
            <button
              aria-label="Home"
              onClick={(e) => (window.location.href = "/")}
              className={`${selectedPage === "Home" ? "dark:brightness-125 brightness-95 font-medium" : ""} p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all xl:w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
            >
              <span
                className={`${selectedPage === "Home" ? "icon-[fluent--home-16-filled]" : "icon-[fluent--home-16-regular]"} w-6 h-6 flex items-center justify-center`}
              ></span>
              <span className="text-base xl:flex hidden">Home</span>
            </button>
          </div>
          <div className="relative flex items-center justify-center">
            <button
              aria-label="Explore"
              onClick={(e) => (window.location.href = "/explore")}
              className={`${selectedPage === "Explore" ? "dark:brightness-125 brightness-95 font-medium" : ""} p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all xl:w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
            >
              <span className="icon-[material-symbols--search] w-6 h-6 flex items-center justify-center"></span>
              <span className="text-base xl:flex hidden">Explore</span>
            </button>
          </div>

          {!hideButtons && (
            <>
              <div className="relative flex items-center justify-center">
                <button
                  aria-label="Messages"
                  onClick={(e) => (window.location.href = "/messages")}
                  className={`${selectedPage === "Messages" ? "dark:brightness-125 brightness-95 font-medium" : ""} p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
                >
                  <span
                    className={`${selectedPage === "Messages" ? "icon-[ic--baseline-email]" : "icon-[ic--outline-email]"} w-6 h-6 flex items-center justify-center`}
                  ></span>
                  <span className="text-base">Messages</span>
                </button>
              </div>

              <div className="relative flex items-center justify-center">
                <button
                  aria-label="Clubs"
                  onClick={(e) => (window.location.href = "/my/clubs")}
                  className={`${selectedPage === "Clubs" ? "dark:brightness-125 brightness-95 font-medium" : ""} p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
                >
                  <span
                    className={`${selectedPage === "Clubs" ? "icon-[mage--globe-fill]" : "icon-[hugeicons--globe-02]"} w-6 h-6 flex items-center justify-center`}
                  ></span>
                  <span className="text-base">Clubs</span>
                </button>
              </div>

              <div className="relative flex items-center justify-center">
                <button
                  aria-label="My Wallet"
                  onClick={(e) => (window.location.href = "/my/wallet")}
                  className={`${selectedPage === "Wallet" ? "dark:brightness-125 brightness-95 font-medium" : ""} p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
                >
                  <span
                    className={`${selectedPage === "Wallet" ? "icon-[si--wallet-fill]" : "icon-[si--wallet-line]"} w-6 h-6 flex items-center justify-center`}
                  ></span>
                  <span className="text-base">My Wallet</span>
                </button>
              </div>
            </>
          )}
          <div className="relative flex flex-col gap-3 items-center justify-center">
            <button
              aria-label="StarPlus"
              onClick={(e) => (window.location.href = "/starplus")}
              className={`${selectedPage === "StarPlus" ? "dark:brightness-125 brightness-95 font-medium" : ""} p-3 hover:brightness-95 dark:hover:brightness-125 duration-200 transition-all xl:w-64 darkerBackgroundColor rounded-lg flex items-center gap-3`}
            >
              <span
                className={`${selectedPage === "StarPlus" ? "icon-[material-symbols--star]" : "icon-[material-symbols--star-outline]"} w-6 h-6 flex items-center justify-center`}
              ></span>
              <span className="text-base xl:flex hidden">StarPlus</span>
            </button>
            <div className="flex flex-row gap-2 mr-auto">
              <span className="text-xs mr-auto">© 2024 NetVerse</span>
            </div>
          </div>
        </div>
      </nav>
    );
  } else {
    return null;
  }
}
