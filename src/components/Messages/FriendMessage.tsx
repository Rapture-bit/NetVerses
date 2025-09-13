import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/themeContext";

interface Props {
  last_message?: string;
  isUnread: boolean;
  onSelected: (author: string) => void;
  isSelected: boolean;
  author: string;
}

const FriendMessage = ({
  last_message,
  isUnread,
  onSelected,
  isSelected,
  author,
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
      className={`flex items-center w-full py-1.5 px-4 ${isSelected ? (colorProperties.textColor === "#c0c0c0" ? "bg-neutral-700" : "bg-neutral-300") : "bg-transparent"} ${colorProperties.textColor === "#c0c0c0" ? "hover:bg-neutral-700" : "hover:bg-neutral-300"} transition-all duration-200`}
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
            className="w-12 h-12 rounded-full"
            alt={`${username}'s profile`}
          />
          <div className="flex flex-col text-start justify-start ml-0 gap-1 text-sm roboto">
            <span className="text-base roboto" id="username">
              {username}
            </span>
            <span
              className={`text-sm ${colorProperties.textColor === "#c0c0c0" ? "text-neutral-400" : "text-neutral-600"} roboto`}
            >
              {last_message || "No messages yet."}{" "}
            </span>
          </div>
        </div>
        {isUnread && <div className="bg-purple-700 rounded-full p-1" />}
      </div>
    </button>
  );
};

export default FriendMessage;
