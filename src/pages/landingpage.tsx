import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navi18n from "@/libraries/Navi18n";

import SignUpModal from "@/ui/modal/SignUp";
import SignInModal from "@/ui/modal/SignIn";
import FeaturesList from "@/ui/others/FeaturesList";
import PageTitle from "@/ui/others/PageTitle";
import LocaleMenu from "@/ui/modal/BottomMenu/LocaleMenu";
import { useTranslation } from "react-i18next";

export default function Page() {
  const [isSignUpVisible, setSignUpVisible] = useState<boolean>(false);
  const [isSignInVisible, setSignInVisible] = useState<boolean>(false);
  const { t } = useTranslation();

  const toggleSignUpVisibility = () => {
    setSignUpVisible((prevVisible) => !prevVisible);
  };

  const toggleSignInVisibility = () => {
    setSignInVisible((prevVisible) => !prevVisible);
  };

  return (
    <>
      <PageTitle title="NetVerses" />
      <div className="flex flex-col ml-4 items-start justify-center min-h-screen p-4 z-10 roboto">
        <div className="flex flex-col items-start space-y-4 w-full">
          <h1 className="text-4xl rtl:text-right md:text-5xl font-bold dark:text-violet-100">
            {t("welcomePage.title")}
          </h1>
          <div className="w-full md:w-3/4 lg:w-1/2 border-l-2 border-violet-300 pl-3">
            <blockquote className="text-base font-medium dark:text-violet-300 italic">
              {t("welcomePage.quote")}
            </blockquote>
          </div>
          <div className="w-full md:w-3/4 lg:w-1/2">
            <p className="text-base font-normal">
              {t("welcomePage.description")}
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-2 justify-center items-start mt-4">
          <div className="flex lg:flex-row space-x-3 lg:space-y-0">
            <button
              aria-label="Register"
              onClick={toggleSignUpVisibility}
              className="bg-violet-600 font-medium text-white py-2 sm:px-16 px-12 rounded-full shadow-sm hover:bg-opacity-85 transition duration-300 text-sm"
            >
              {t("general.RegisterBtn")}
            </button>
            <SignUpModal
              visible={isSignUpVisible}
              setIsOpen={setSignUpVisible}
            />
            <button
              aria-label="Sign In"
              onClick={toggleSignInVisibility}
              className="bg-violet-900 font-medium text-white py-2 sm:px-16 px-12 rounded-full shadow-sm hover:bg-opacity-85 transition duration-300 text-sm"
            >
              {t("general.SignInBtn")}
            </button>
            <SignInModal
              visible={isSignInVisible}
              setIsOpen={setSignInVisible}
            />
          </div>

          <p className="text-xs textColor mt-2">
            {t("welcomePage.termsAgreement")}{" "}
            <Link
              to="https://help.netverses.com/tos"
              className="textColor transition duration-300"
            >
              <u>{t("general.tosLabel")}</u>
            </Link>{" "}
            {t("general.andLabel")}{" "}
            <Link
              to="https://help.netverses.com/privacy"
              className="textColor transition duration-300"
            >
              <u>{t("general.privacyLabel")}</u>
            </Link>
            .
          </p>
        </div>

        <FeaturesList />
        <LocaleMenu />
      </div>
    </>
  );
}
