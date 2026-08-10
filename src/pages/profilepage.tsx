import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useLayoutEffect } from "react";
import PageTitle from "@/ui/others/PageTitle";
import BottomBar from "@/ui/navigation/BottomBar";

import Tooltip from "@/ui/Tooltip";
import ProfilePreview from "@/ui/profile/ProfilePreview";
import ContentPreview from "@/ui/profile/ContentPreview";

import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const [profileData, setProfileData] = useState<any>(window.__PROFILE__);
  const [isAvailable, setIsAvailable] = useState<boolean>(!!window.__PROFILE__);

  useEffect(() => {
    if (window.__PROFILE__) {
      console.log("Available");
      setProfileData(window.__PROFILE__);
      setIsAvailable(!!window.__PROFILE__);
    } else {
      console.log("Unavailable?");
    }
  }, [window.__PROFILE__, username]);

  function toggleBack() {
    if (window.history.length > 1) {
      const previousUrl = document.referrer;
      if (previousUrl.startsWith(window.location.origin)) {
        navigate(-1);
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }

  return (
    <>
      {isAvailable ? (
        <PageTitle
          title={`NetVerses ~ ${profileData?.display_name}'s Profile`}
        />
      ) : (
        <PageTitle title={`NetVerses ~ Page Not Found`} />
      )}
      <BottomBar />
      <div
        className={`flex flex-col gap-3 ${isAvailable ? "justify-start" : "justify-center"} items-center w-full h-full pt-24 bg-fixed bg-cover bg-center`}
      >
        <div className="relative flex border borderColor flex-col p-4 sm:pl-5 sm:py-4 rounded-lg mx-4 sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor">
          <div className="flex flex-row justify-between items-center">
            <Tooltip label="Back">
              <button
                aria-label="Go Back"
                onClick={toggleBack}
                className="w-5 h-5"
              >
                <span className="icon-[eva--arrow-back-outline] w-5 h-5"></span>
              </button>
            </Tooltip>
            {isAvailable && (
              <>
                <span className="font-medium text-lg jost">
                  {profileData?.display_name}
                </span>
                <Tooltip
                  mouseLeaveDelay={0}
                  title={"Search"}
                  placement={"bottom"}
                >
                  <button
                    aria-label="Search"
                    onClick={toggleBack}
                    className="w-5 h-5"
                  >
                    <span className="icon-[material-symbols--search] w-5 h-5"></span>
                  </button>
                </Tooltip>
              </>
            )}
          </div>
        </div>
        {isAvailable ? (
          <>
            <ProfilePreview profileData={profileData} />
            <ContentPreview profileData={profileData} />
          </>
        ) : (
          <div className="justify-center items-center mt-5 text-center flex flex-col gap-3">
            <span className="icon-[hugeicons--unavailable] w-12 h-12 hover:scale-110 duration-300 transition-all"></span>
            <span className="leading-relaxed wrap-break-words whitespace-normal">
              {t("general.unavailable_page")}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
