import React, { useState } from "react";
import PageTitle from "@/components/others/PageTitle";
import BottomBar from "@/components/navigation/BottomBar";

import { Tooltip } from "antd";

const Clubs = () => {
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
      <PageTitle title="NetVerses ~ Clubs" />
      <BottomBar />
      <div className="flex flex-col overflow-x-hidden justify-start items-center w-full h-full pt-24 bg-fixed bg-cover bg-center">
        <div className="flex flex-col overflow-x-hidden space-y-5 items-center w-full roboto">
          <div className="flex flex-row justify-between gap-5 p-4 sm:pl-5 sm:py-4 rounded-md mx-auto sm:mx-0 w-1/2 darkerBackgroundColor">
            <Tooltip mouseLeaveDelay={0} title={"Back"} placement={"bottom"}>
              <button
                aria-label="Go Back"
                onClick={toggleBack}
                className="w-5 h-5"
              >
                <span className="icon-[eva--arrow-back-outline] w-5 h-5"></span>
              </button>
            </Tooltip>
            <span className="font-semibold">Clubs</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Clubs;
