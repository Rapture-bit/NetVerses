import React from "react";
import { Tooltip } from "antd";

export default function SecondFriendMenu({ user }) {
  return (
    <div className="flex flex-row border borderColor darkerBackgroundColor rounded-lg overflow-hidden">
      <Tooltip placement="bottom" title="Report this user" mouseLeaveDelay={0}>
        <button className="flex flex-col items-center justify-center flex-1 p-3 hover:bg-red-800/10 active:scale-95 transition-all duration-300">
          <span className="icon-[material-symbols--report-outline-rounded] text-red-800 h-8 w-8"></span>
          <span className="text-xs mt-1 text-red-800 font-medium">Report</span>
        </button>
      </Tooltip>

      <div className="w-px bg-[#a8a8a8] dark:bg-[#313131]"></div>

      <Tooltip placement="bottom" title="Block this user" mouseLeaveDelay={0}>
        <button className="flex flex-col items-center justify-center flex-1 p-3 hover:bg-red-800/10 active:scale-95 transition-all duration-300">
          <span className="icon-[ic--baseline-block] text-red-800 h-8 w-8"></span>
          <span className="text-xs mt-1 text-red-800 font-medium">Block</span>
        </button>
      </Tooltip>

      <div className="w-px bg-[#a8a8a8] dark:bg-[#313131]"></div>

      <Tooltip placement="bottom" title="Remove Friend" mouseLeaveDelay={0}>
        <button className="flex flex-col items-center justify-center flex-1 p-3 hover:bg-red-800/10 active:scale-95 transition-all duration-300">
          <span className="icon-[ci--user-remove] text-red-800 h-8 w-8"></span>
          <span className="text-xs mt-1 text-red-800 font-medium">
            Unfriend
          </span>
        </button>
      </Tooltip>
    </div>
  );
}
