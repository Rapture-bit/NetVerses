import { Link } from "react-router-dom";
import React, { useState, useContext } from "react";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";

import ZenonAI from "@/ui/modal/Menu/ZenonChat";

import { UserContext } from "@/context/UserContext";

import SignUpModal from "@/ui/modal/SignUp";
import SignInModal from "@/ui/modal/SignIn";

export default function TopBar() {
  const { t } = useTranslation();
  const { userData } = useContext(UserContext)!;
  const [isSignInVisible, setSignInVisible] = useState<boolean>(false);
  const [isSignUpVisible, setSignUpVisible] = useState<boolean>(false);

  const [showZenonMenu, setShowZenonMenu] = useState<boolean>(false);
  const [showVerseMenu, setShowVerseMenu] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const triggerMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const toggleSignUpVisibility = () => {
    setSignUpVisible((prevVisible) => !prevVisible);
  };

  const toggleSignInVisibility = () => {
    setSignInVisible((prevVisible) => !prevVisible);
  };

  const triggerZenon = () => {
    setShowZenonMenu((prev) => !prev);
  };

  const triggerVerse = () => {
    setShowVerseMenu((prev) => !prev);
  };

  return (
    <>
      <ZenonAI
        userDetails={userData}
        visible={showZenonMenu}
        setIsOpen={setShowZenonMenu}
      />
      <nav
        className="fixed top-0 left-0 right-0 w-full darkerBackgroundColor border-b-2 border-purple-800 text-white px-4 md:px-10 py-3 z-50 nav-hover"
        style={{
          boxShadow: `
      0 4px 15px rgba(138, 43, 226, 0.6),
      0 0 20px rgba(138, 43, 226, 0.4)
    `,
        }}
      >
        <div className="flex flex-row justify-between items-center space-x-3 font-semibold">
          <Link
            to="https://netverses.com/"
            className="flex items-center text-xl md:text-2xl select-none"
          >
            <span className="dark:text-gray-200 text-black">Net</span>
            <span className="text-purple-600">Verses</span>
          </Link>

          {userData !== null && (
            <div className="flex flex-row gap-5 justify-center items-center">
              <Tooltip placement="bottom" mouseLeaveDelay={0} title="Profile">
                <button
                  aria-label="Profile"
                  className="flex items-center gap-3 h-full"
                >
                  <img
                    src="/images/avatars/default.jpg"
                    className="rounded-full w-8 h-8"
                    alt="Profile"
                  />
                  <span className="text-gray-600 dark:text-gray-200">
                    {userData?.username || "User"}
                  </span>
                </button>
              </Tooltip>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

              <div className="flex flex-row gap-5 items-center">
                <button
                  onClick={triggerVerse}
                  aria-label="Verse"
                  className={`${showVerseMenu ? "text-purple-400" : ""} flex duration-300 transition-all hover:underline flex-row items-center justify-center h-full space-x-2`}
                >
                  <span className="icon-[ic--baseline-create] w-6 h-6"></span>
                  <span>Verse</span>
                </button>

                <button
                  onClick={triggerZenon}
                  aria-label="AI assistant"
                  className={`${showZenonMenu ? "text-purple-400" : ""} flex duration-300 transition-all hover:underline flex-row items-center justify-center h-full space-x-2`}
                >
                  <span className="icon-[mingcute--ai-fill] w-6 h-6"></span>
                  <span>Zenon</span>
                </button>

                <button
                  onClick={triggerMenu}
                  aria-label="Menu"
                  className={`${showMenu ? "text-purple-400" : ""} flex duration-300 transition-all hover:underline flex-row items-center justify-center h-full space-x-2`}
                >
                  <span className="icon-[material-symbols--menu] w-6 h-6"></span>
                </button>

                <Tooltip
                  placement="bottom"
                  mouseLeaveDelay={0}
                  title="Notifications"
                >
                  <button
                    aria-label="Notifications"
                    className="flex duration-300 transition-all items-center justify-center h-full"
                  >
                    <span className="icon-[mingcute--notification-fill] w-6 h-6"></span>
                  </button>
                </Tooltip>

                <Tooltip placement="bottom" mouseLeaveDelay={0} title="Report">
                  <button
                    aria-label="Report"
                    className="flex duration-300 transition-all items-center justify-center h-full"
                  >
                    <span className="icon-[material-symbols--report] w-6 h-6"></span>
                  </button>
                </Tooltip>

                <Tooltip placement="bottom" mouseLeaveDelay={0} title="Logout">
                  <button
                    aria-label="Logout"
                    className="flex hover:text-red-600 duration-300 transition-all items-center justify-center h-full"
                  >
                    <span className="icon-[material-symbols--logout] w-6 h-6"></span>
                  </button>
                </Tooltip>
              </div>
            </div>
          )}

          {userData === null && (
            <div className="flex flex-row gap-5">
              <button
                aria-label="Login"
                onClick={toggleSignInVisibility}
                className="border border-purple-600 font-medium text-black dark:text-gray-200 hover:text-white py-2 px-5 rounded-md shadow-sm hover:bg-purple-600 transition duration-300 text-sm"
              >
                {t("general.SignInBtn")}
              </button>
              <SignInModal
                visible={isSignInVisible}
                setIsOpen={setSignInVisible}
              />
              <button
                aria-label="Register"
                onClick={toggleSignUpVisibility}
                className="bg-violet-600 font-medium text-white py-2 px-5 rounded-md shadow-sm hover:bg-violet-500 transition duration-300 text-sm"
              >
                {t("general.RegisterBtn")}
              </button>
              <SignUpModal
                visible={isSignUpVisible}
                setIsOpen={setSignUpVisible}
              />
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
