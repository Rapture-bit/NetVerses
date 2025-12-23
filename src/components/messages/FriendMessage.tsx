import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";

import { Tooltip } from "antd";

interface Props {
  last_message?: string;
  isUnread: boolean;
  onSelected: (author: string) => void;
  isSelected: boolean;
  imageSize?: string;
  author: string;
  calling: boolean;
}

const FriendMessage = ({
  last_message,
  isUnread,
  imageSize,
  onSelected,
  isSelected,
  author,
  calling,
}: Props) => {
  const [username, setUsername] = useState<string>(author);
  const [pfp, setPfp] = useState<string>("/images/avatars/default.jpg");
  const { colorProperties } = useContext(ThemeContext);

  useEffect(() => {
    setUsername(author);
  }, [author]);

  return (
    <button
      id="friend"
      className={`flex items-center w-full py-1.5 px-4 ${!calling ? (isSelected ? (colorProperties.textColor === "#c0c0c0" ? "bg-[#1f2844]" : "bg-neutral-300") : "bg-transparent") : "bg-green-800"} ${!calling ? (colorProperties.textColor === "#c0c0c0" ? "hover:bg-[#1f2844]" : "hover:bg-neutral-300") : "text-white"} transition-all duration-200`}
      onClick={() => {
        onSelected(author);
      }}
    >
      <div
        id="details"
        className="flex flex-row justify-between items-center w-full gap-3"
      >
        <div id="info" className="flex flex-row items-center gap-3">
          <img
            id="pfp"
            src={pfp}
            className={`${imageSize === "small" ? "w-11 h-11" : "w-12 h-12"} rounded-full ${calling ? "animate-pulse" : "animate-none"}`}
            alt={`${username}'s profile`}
          />
          <div className="flex flex-col text-start justify-start ml-0 gap-0.5 text-sm roboto">
            <span className="text-base roboto" id="username">
              {username}
            </span>
            <span
              className={`text-sm ${!calling ? (colorProperties.textColor === "#c0c0c0" ? "text-neutral-400" : "text-neutral-600") : "text-white"} roboto`}
            >
              {last_message || "No messages yet."}{" "}
            </span>
          </div>
        </div>
        {isUnread && !calling && (
          <div className="bg-purple-700 rounded-full p-1" />
        )}
        {calling && (
          <div className="flex flex-row space-x-2">
            <Tooltip title="Answer Call" mouseLeaveDelay={0} placement="bottom">
              <button className="flex items-center justify-center p-1 bg-white text-green-600 rounded-full shadow-md hover:bg-green-100 transition-all duration-200 transform hover:scale-110">
                <span className="icon-[ic--round-call] w-[1.4rem] h-[1.4rem]" />
              </button>
            </Tooltip>

            <Tooltip title="Reject Call" mouseLeaveDelay={0} placement="bottom">
              <button className="flex items-center justify-center p-1 bg-white text-red-600 rounded-full shadow-md hover:bg-red-100 transition-all duration-200 transform hover:scale-110">
                <span className="icon-[material-symbols--call-end] w-[1.4rem] h-[1.4rem]" />
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </button>
  );
};

export default FriendMessage;
