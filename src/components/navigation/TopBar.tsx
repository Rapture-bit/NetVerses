import React, { useState, useContext } from "react";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";

import { AuthContext } from "@/context/AuthContext";

import SignUpModal from "@/components/modal/SignUp";
import SignInModal from "@/components/modal/SignIn";

export default function TopBar() {
  const { t } = useTranslation();
  const { isAuth } = useContext(AuthContext);
  const [isSignInVisible, setSignInVisible] = useState<boolean>(false);
  const [isSignUpVisible, setSignUpVisible] = useState<boolean>(false);

  const toggleSignUpVisibility = () => {
    setSignUpVisible((prevVisible) => !prevVisible);
  };

  const toggleSignInVisibility = () => {
    setSignInVisible((prevVisible) => !prevVisible);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full darkerBackgroundColor border-b-2 border-purple-800 text-white px-4 md:px-10 py-3 z-50">
      <div className="flex flex-row justify-between items-center space-x-3 font-semibold">
        <a
          href="/"
          className="flex items-center text-xl md:text-2xl select-none"
        >
          <span className="dark:text-gray-200 text-black">Net</span>
          <span className="text-purple-600">Verses</span>
        </a>

        {isAuth && (
          <div className="flex flex-row gap-5 justify-center items-center">
            <Tooltip placement="bottom" title="Notifications">
              <button
                aria-label="Notifications"
                className="flex items-center p-1"
              >
                <span className="icon-[mdi--bell-outline] w-6 h-6 text-gray-600 hover:text-gray-800 dark:text-neutral-200 dark:hover:text-white transition-all duration-300"></span>
                <span className="sr-only">Notifications</span>
              </button>
            </Tooltip>
            <Tooltip placement="bottom" title="Notifications">
              <button aria-label="Messages" className="flex items-center p-1">
                <span className="icon-[mingcute--message-2-line] w-6 h-6 text-gray-600 hover:text-gray-800 dark:text-neutral-200 dark:hover:text-white transition-all duration-300"></span>
                <span className="sr-only">Messages</span>
              </button>
            </Tooltip>
            <Tooltip placement="bottom" title="Profile">
              <button aria-label="Profile">
                <div className="rounded-full flex flex-row gap-3 justify-center items-center">
                  <span className="text-gray-600 dark:text-gray-200">
                    Xenon
                  </span>
                  <img
                    src={"/"}
                    className="rounded-full w-8 h-8"
                    alt="Profile"
                  />
                </div>
              </button>
            </Tooltip>
          </div>
        )}

        {!isAuth && (
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
  );
}
