import React, { useState } from "react";
import Navi18n from "@/libraries/Navi18n";

import SignUpModal from "@/components/modal/SignUp";
import SignInModal from "@/components/modal/SignIn";
import FeatureList from "@/components/others/FeatureList";
import PageTitle from "@/components/others/PageTitle";
import LocaleMenu from "@/components/modal/BottomMenu/LocaleMenu";
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
            <a href="/tos" className="textColor transition duration-300">
              <u>{t("general.tosLabel")}</u>
            </a>{" "}
            {t("general.andLabel")}{" "}
            <a href="/privacy" className="textColor transition duration-300">
              <u>{t("general.privacyLabel")}</u>
            </a>
            .
          </p>
        </div>

        <FeatureList />
        <LocaleMenu />
      </div>
    </>
  );
}
