import { Link } from "react-router-dom";
import React, { useState, useContext } from "react";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";

import { UserContext } from "@/context/UserContext";

import SignUpModal from "@/components/modal/SignUp";
import SignInModal from "@/components/modal/SignIn";

export default function TopBar() {
  const { t } = useTranslation();
  const { userCache, updateCache } = useContext(UserContext);
  const [isSignInVisible, setSignInVisible] = useState<boolean>(false);
  const [isSignUpVisible, setSignUpVisible] = useState<boolean>(false);

  const toggleSignUpVisibility = () => {
    setSignUpVisible((prevVisible) => !prevVisible);
  };

  const toggleSignInVisibility = () => {
    setSignInVisible((prevVisible) => !prevVisible);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full darkerBackgroundColor border-b-2 border-purple-800 text-white px-4 md:px-10 py-3 z-50`}
      style={{
        boxShadow: "0 4px 15px rgba(128, 0, 255, 0.5)",
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

        {userCache !== null && (
          <div className="flex flex-row gap-5 justify-center items-center">
            <Tooltip placement="bottom" title="Profile">
              <button aria-label="Profile">
                <div className="rounded-full flex flex-row gap-3 justify-center items-center">
                  <span className="text-gray-600 dark:text-gray-200">
                    Xenon
                  </span>
                  <img
                    src={"/images/avatars/default.jpg"}
                    className="rounded-full w-8 h-8"
                    alt="Profile"
                  />
                </div>
              </button>
            </Tooltip>
          </div>
        )}

        {userCache === null && (
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
