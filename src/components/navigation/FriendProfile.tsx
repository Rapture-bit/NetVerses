import React, { useState } from "react";
import { Tooltip } from "antd";

export default function FriendProfile({ username }) {
  const [friendProfileColor, setFriendProfileColor] = useState<string>("blue");
  const [friendProfileColors, setFriendProfileColors] = useState<Object>({
    bannerGradient: `from-${friendProfileColor}-700`,
    background: `bg-${friendProfileColor}-800`,
    hoverBackground: `hover:bg-${friendProfileColor}-800`,
    borderColor: `border-${friendProfileColor}-800`,
    textColor: `text-${friendProfileColor}-500`,
  });
  const [friendUsername, setFriendUsername] = useState<string>(username);
  const [friendAvatar, setFriendAvatar] = useState<string>(
    "/images/avatars/default.jpg",
  );
  const [friendJob, setFriendJob] = useState("Entrepreneur");

  const [friendBio, setFriendBio] = useState("I'm cool.");

  return (
    <div className="relative flex flex-col">
      <div
        className={`bg-gradient-to-b ${friendProfileColors.bannerGradient} to-transparent h-20 w-full absolute top-0 left-0 rounded-t-lg`}
      >
        <a
          href={`/${friendUsername}`}
          className="absolute z-10 mt-7 ml-5 w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 hover:border-white/30 transition-all duration-300"
          aria-label={`Profile of ${friendUsername}`}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${friendAvatar})` }}
          ></div>
        </a>
      </div>

      <div className="flex flex-col space-y-3 py-5 max-h-full px-7 rounded-lg darkerBackgroundColor text-center pt-28">
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-1">
            <span className="text-xl font-semibold dark:text-white transition-colors duration-300 leading-none">
              {username}
            </span>
            <Tooltip placement="bottom" title="Official Profile">
              <span
                className={`icon-[material-symbols--verified-outline-rounded] ${friendProfileColors.textColor} w-4 h-4 mt-1`}
                aria-label="Verified"
              ></span>
            </Tooltip>
          </div>
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-1">
              <span
                className={`font-semibold ${friendProfileColors.textColor} text-sm hover:underline cursor-pointer`}
              >
                {friendJob}
              </span>
            </div>
          </div>
        </div>

        <p className="description text-sm text-left w-full whitespace-normal break-words">
          {friendBio}
        </p>
      </div>
    </div>
  );
}
