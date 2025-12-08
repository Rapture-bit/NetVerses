import React, { useState } from "react";
import BottomBar from "@/components/navigation/BottomBar";
import PageTitle from "@/components/others/PageTitle";
import SearchBar from "@/components/input/SearchBar";

import { Tooltip } from "antd";

const Explore = () => {
  const toggleBack = () => {};

  const [selectedCategory, setSelectedCategory] = useState<string>("constant");
  const [isFocused, setFocused] = useState<boolean>(false);

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <>
      <PageTitle title="NetVerses ~ Explore" />
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
            <span className="font-medium">Explore</span>
          </div>

          <div
            className={`flex items-center border duration-300 transition-all border-neutral-700 rounded-md w-1/2 mx-auto sm:mx-0 p-4 gap-2 bg-transparent darkerBackgroundColor ${isFocused ? "border-purple-700 shadow-[0_0_10px_rgba(147,51,234,0.4)]" : "border-[#3b3b3b]"}`}
          >
            <svg
              className="w-5 h-5 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
            <input
              onFocus={() => {
                setFocused(true);
              }}
              onBlur={() => {
                setFocused(false);
              }}
              type="text"
              className="flex-1 bg-transparent border-none text-base text-white placeholder-neutral-500 focus:outline-none focus:ring-0"
              placeholder="Search"
            />
          </div>

          <div className="flex flex-col w-1/2 gap-10 relative">
            <div className="flex flex-col">
              <div className="flex flex-row justify-left items-center w-full">
                <span className="font-semibold text-base">
                  Relevant Searches
                </span>
                <div className="flex flex-row gap-3 overflow-x-auto">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
