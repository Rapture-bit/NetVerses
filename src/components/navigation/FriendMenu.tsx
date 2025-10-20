import React from "react";
import { Tooltip } from "antd";

export default function FriendMenu({ user }) {
  return (
    <div className="flex flex-row darkerBackgroundColor rounded-lg justify-between divide-x dark:divide-[#313131] divide-[#a8a8a8]">
      <Tooltip
        placement="bottom"
        title="Invite user to family"
        mouseLeaveDelay={0}
      >
        <button className="flex flex-col items-center justify-center flex-1 p-3 hover:bg-white/5 transition duration-200 rounded-l-lg">
          <span className="icon-[fluent-mdl2--family] h-8 w-8"></span>
          <span className="text-xs mt-1">Invite To Family</span>
        </button>
      </Tooltip>

      <Tooltip
        placement="bottom"
        title="Switch encryption algorithm"
        mouseLeaveDelay={0}
      >
        <button className="flex flex-col items-center justify-center flex-1 p-3 hover:bg-white/5 transition duration-200">
          <span className="icon-[si--lock-line] h-8 w-8"></span>
          <span className="text-xs mt-1">Switch E2EE</span>
        </button>
      </Tooltip>

      <Tooltip placement="bottom" title="Export Chat" mouseLeaveDelay={0}>
        <button className="flex flex-col items-center justify-center flex-1 p-3 hover:bg-white/5 transition duration-200 rounded-r-lg">
          <span className="icon-[lsicon--save-outline] h-8 w-8"></span>
          <span className="text-xs mt-1">Export Chat</span>
        </button>
      </Tooltip>
    </div>
  );
}
