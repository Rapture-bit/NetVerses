import React, { useState, useEffect } from "react";
import PageTitle from "@/components/others/PageTitle";
import BottomBar from "@/components/navigation/BottomBar";
import { Tooltip } from "antd";
import ProfilePreview from "@/components/profile/ProfilePreview";
import ContentPreview from "@/components/profile/ContentPreview";

const ProfilePage = () => {
  const [availableUsernames, setAvailableUsernames] = useState<string[]>([
    "xenon",
  ]); // Update with API data
  const [topNews, setTopNews] = useState<object[]>([
    {
      title: "Breaking News 1",
      description: "This is the description for breaking news 1.",
      category: "Business",
    },
    {
      title: "Breaking News 2",
      description: "This is the description for breaking news 2.",
      category: "Technology",
    },
    {
      title: "Breaking News 3",
      description: "This is the description for breaking news 3.",
      category: "Health",
    },
  ]);

  const [username, setUsername] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<boolean>(false);

  useEffect(() => {
    const pathname = window.location.pathname;
    const extractedUsername = pathname.split("/").pop();

    if (extractedUsername) {
      const normalizedUsername = extractedUsername.toLowerCase();

      setUsername(normalizedUsername);
      setIsAvailable(
        availableUsernames.some(
          (username) => username.toLowerCase() === normalizedUsername,
        ),
      );
    }
  }, [availableUsernames]);

  function toggleBack() {
    if (window.history.length > 1) {
      const previousUrl = document.referrer;
      if (previousUrl.startsWith(window.location.origin)) {
        window.history.back();
      } else {
        window.location.href = "/";
      }
    } else {
      window.location.href = "/";
    }
  }

  return (
    <>
      <PageTitle title="NetVerse ~ Profile" />
      <BottomBar />
      <div
        className={`flex flex-col gap-3 ${isAvailable ? "justify-start" : "justify-center"} items-center w-full h-full pt-24 bg-fixed bg-cover bg-center`}
      >
        <div className="relative flex flex-col p-4 sm:pl-5 sm:py-4 rounded-md mx-4 sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor">
          <div className="flex flex-row justify-between items-center">
            <Tooltip mouseLeaveDelay={0} title={"Back"} placement={"bottom"}>
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
                <span className="font-medium text-lg jost">{username}</span>
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
            <ProfilePreview username={username} />
            <ContentPreview username={username} />
          </>
        ) : (
          <div className="justify-center items-center text-center flex flex-col gap-3">
            <span className="icon-[hugeicons--unavailable] w-12 h-12 hover:scale-110 duration-300 transition-all"></span>
            <span>This page is unavailable.</span>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
