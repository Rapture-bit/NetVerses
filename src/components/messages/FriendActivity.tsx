import React, { useState } from "react";
import { Tooltip } from "antd";

export default function FriendActivity({ user }) {
  const [activityName, setActivityName] = useState<string>("Minecraft"); // Replace with API
  const [activityType, setActivityType] =
    useState<["playing", "listening", "streaming", "watching"]>("playing"); // Replace with API
  const [activityUrl, setActivityUrl] = useState<string>(
    "https://minecraft.com",
  ); // Replace with API

  return (
    <div
      className={`flex flex-col space-y-3 ${activityType === "playing" ? "bg-green-700 text-white" : ""} ${activityType === "streaming" ? "bg-red-700 text-white" : ""} ${activityType === "listening" ? "bg-purple-700 text-white" : ""} ${activityType === "watching" ? "bg-purple-700 text-white" : ""} rounded-lg justify-between p-2`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-1">
          <span className="text-sm select-none">
            <span>
              {activityType.charAt(0).toUpperCase() + activityType.slice(1)}
            </span>{" "}
            <a
              href={activityUrl}
              target="_blank"
              className="font-semibold hover:underline cursor-pointer"
            >
              {activityName}
            </a>
          </span>
        </div>

        <div className="flex items-center">
          <Tooltip title="Learn more" placement="bottom" mouseLeaveDelay={0}>
            <button className="text-sm hover:bg-white/5 transition-all duration-300 p-1 rounded-full select-none flex items-center justify-center">
              <span className="icon-[material-symbols--info-outline-rounded] w-4 h-4"></span>
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
