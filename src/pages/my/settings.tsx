import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import PageTitle from "@/components/others/PageTitle";
import BottomBar from "@/components/navigation/BottomBar";

import { Tooltip } from "antd";

const Settings = () => {
  const navigate = useNavigate();

  function toggleBack() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  return (
    <>
      <PageTitle title="NetVerses ~ Settings" />
      <BottomBar />
      <div className="flex flex-col overflow-x-hidden justify-start items-center w-full h-full pt-24 bg-fixed bg-cover bg-center">
        <div className="flex flex-col overflow-x-hidden space-y-5 items-center w-full roboto">
          <div className="flex flex-row border border-neutral-700 justify-between gap-5 p-4 sm:pl-5 sm:py-4 rounded-md mx-auto sm:mx-0 w-1/2 darkerBackgroundColor">
            <Tooltip mouseLeaveDelay={0} title={"Back"} placement={"bottom"}>
              <button
                aria-label="Go Back"
                onClick={toggleBack}
                className="w-5 h-5"
              >
                <span className="icon-[eva--arrow-back-outline] w-5 h-5"></span>
              </button>
            </Tooltip>
            <span className="font-medium">Settings</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
