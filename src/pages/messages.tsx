import React, { useState, useEffect, useLayoutEffect } from "react";

import TopBar from "@/components/Navigation/TopBar";
import SearchBar from "@/components/Input/SearchBar";
import BottomBar from "@/components/Navigation/BottomBar";
import FriendMessage from "@/components/Messages/FriendMessage";
import TextArea from "@/components/Input/TextArea";
import Options from "@/components/Others/Options";

import { Tooltip } from "antd";

import PageTitle from "@/components/Others/PageTitle";

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

export default function Messages() {
  const [IsOptionsSelected, setOptionsSelected] = useState<boolean>(false);
  const [textColor, setTextColor] = useState<string>("");

  const [selectedFriendDetails, setSelectedFriendDetails] = useState<Object[]>({
    username: "Xenon", // USERNAME
    pfp: "/images/avatars/default.jpg", // PFP
    messages: [
      {
        sender: "Xenon",
        recipient: "Rapture_TY",
        message: "Hey, did you finish the project we discussed?",
        date: "2024-10-24T09:30:00Z",
      },
      {
        sender: "Rapture_TY",
        recipient: "Xenon",
        message: "Yes, I just sent it over to you. What do you think?",
        date: "2024-10-24T09:31:00Z",
      },
      {
        sender: "Xenon",
        recipient: "Rapture_TY",
        message: "I think it's great! Just a few minor adjustments.",
        date: "2024-10-24T09:32:00Z",
      },
      {
        sender: "Rapture_TY",
        recipient: "Xenon",
        message: "Sure, let me know what needs to be changed.",
        date: "2024-10-24T09:33:00Z",
      },
    ],
  }); // API
  const [friendsMessages, setFriendsMessages] = useState<Object[]>([
    {
      Author: "Xenon",
      Unread: false,
      LastMessage: "Hey!",
      timestamp: "2024-10-21T12:30:00",
    },
    {
      Author: "Rapture_TY",
      Unread: true,
      LastMessage: "Hello",
      timestamp: "2024-10-22T09:15:00",
    },
    {
      Author: "Blitz_Jay",
      Unread: false,
      LastMessage: "Let's meet up later.",
      timestamp: "2024-10-21T14:45:00",
    },
    {
      Author: "NovaVibes",
      Unread: true,
      LastMessage: "Did you check the file?",
      timestamp: "2024-10-22T08:00:00",
    },
    {
      Author: "PixelCloud",
      Unread: true,
      LastMessage: "Good morning!",
      timestamp: "2024-10-22T07:30:00",
    },
    {
      Author: "EchoWave",
      Unread: false,
      LastMessage: "I'll be there in 10 minutes.",
      timestamp: "2024-10-21T15:20:00",
    },
    {
      Author: "QuantumDash",
      Unread: false,
      LastMessage: "See you tomorrow.",
      timestamp: "2024-10-20T18:10:00",
    },
    {
      Author: "SolarFlare",
      Unread: true,
      LastMessage: "Can you send me the link?",
      timestamp: "2024-10-22T10:00:00",
    },
    {
      Author: "LunarDreamer",
      Unread: false,
      LastMessage: "I'll think about it.",
      timestamp: "2024-10-21T17:50:00",
    },
    {
      Author: "NebulaSkies",
      Unread: true,
      LastMessage: "Thanks for the help!",
      timestamp: "2024-10-22T09:45:00",
    },
    {
      Author: "CyberPulse",
      Unread: true,
      LastMessage: "Are we still on for tonight?",
      timestamp: "2024-10-22T11:30:00",
    },
  ]); // API

  const [filter, setFilter] = useState<string>("All");
  const [friendsFilter, setFriendsFilter] = useState<string>("");
  const [filteredFriendsMessages, setFilteredFriendsMessages] = useState<
    Object[]
  >([]);

  const handleSearchChange = (value: string) => {
    setFriendsFilter(value);
  };

  const getCssVariable = (variable) => {
    const root = document.documentElement;
    return getComputedStyle(root).getPropertyValue(variable).trim();
  };

  useLayoutEffect(() => {
    const updateColors = () => {
      setTextColor(getCssVariable("--text-color"));
    };

    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const now = new Date();

    const positionFilter = friendsMessages.sort((a: any, b: any) =>
      a.Unread === b.Unread ? 0 : a.Unread ? -1 : 1,
    );

    const preferenceFilter = positionFilter.filter((message: any) => {
      const authorMatchesFilter = friendsFilter
        ? message.Author.toLowerCase().includes(
            friendsFilter.trim().toLowerCase(),
          )
        : true;

      if (filter === "All") return authorMatchesFilter;
      if (filter === "Unread") return message.Unread && authorMatchesFilter;
      if (filter === "Read") return !message.Unread && authorMatchesFilter;
      if (filter === "Recent") {
        const messageDate = new Date(message.timestamp);
        return (
          (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60) <= 24 &&
          authorMatchesFilter
        );
      }

      return false;
    });

    setFilteredFriendsMessages(preferenceFilter);
  }, [friendsMessages, friendsFilter, filter]);

  const handleUserSelection = () => {};

  return (
    <>
      <PageTitle title="NetVerse ~ Messages" />
      <TopBar />
      <BottomBar />

      <div className="flex flex-col gap-3 justify-start items-center w-full h-screen pt-24 bg-fixed bg-cover bg-center sm:px-9">
        <Options
          setVisible={setOptionsSelected}
          isVisible={IsOptionsSelected}
        />
        <div className="flex flex-row justify-between gap-5 p-4 sm:pl-5 sm:py-4 rounded-md mx-auto sm:mx-0 w-full darkerBackgroundColor">
          <Tooltip mouseLeaveDelay={0} title={"Back"} placement={"bottom"}>
            <button
              aria-label="Go Back"
              onClick={toggleBack}
              className="w-5 h-5"
            >
              <span className="icon-[eva--arrow-back-outline] w-5 h-5"></span>
            </button>
          </Tooltip>
          <span className="font-semibold">Messages</span>
        </div>

        <div className="flex flex-row gap-3 w-full min-h-screen md:min-h-0 md:h-5/6">
          <div className="flex flex-col p-0 w-full md:w-1/3 rounded-lg darkerBackgroundColor">
            <div className="flex flex-col gap-3 p-4">
              <div className="flex flex-row justify-between">
                <span className="font-semibold select-none">Friends</span>
                <Tooltip
                  mouseLeaveDelay={0}
                  title={"Options"}
                  placement={"bottom"}
                >
                  <button aria-label="More Options">
                    <span className="icon-[ri--more-fill] w-5 h-5"></span>
                  </button>
                </Tooltip>
              </div>
              <SearchBar
                height="py-1"
                placeholder="Search friends"
                onSearchChange={handleSearchChange}
              />
              <div className="flex flex-row gap-3">
                <button
                  onClick={() => setFilter("All")}
                  className={`rounded-lg text-sm dark:text-white text-black transition-all duration-300 ease-in-out ${filter === "All" ? "bg-purple-600 text-white" : "backgroundColor"} py-1 px-2`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("Unread")}
                  className={`rounded-lg text-sm dark:text-white text-black transition-all duration-300 ease-in-out ${filter === "Unread" ? "bg-purple-600 text-white" : "backgroundColor"} py-1 px-2`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setFilter("Read")}
                  className={`rounded-lg text-sm dark:text-white text-black transition-all duration-300 ease-in-out ${filter === "Read" ? "bg-purple-600 text-white" : "backgroundColor"} py-1 px-2`}
                >
                  Read
                </button>
                <button
                  onClick={() => setFilter("Recent")}
                  className={`rounded-lg text-sm dark:text-white text-black transition-all duration-300 ease-in-out ${filter === "Recent" ? "bg-purple-600 text-white" : "backgroundColor"} py-1 px-2`}
                >
                  Recent
                </button>
              </div>
            </div>
            <div className="relative flex flex-col gap-3 h-full">
              <div
                className="flex flex-col rounded-b-lg overflow-y-auto h-full absolute top-0 left-0 right-0 bottom-0"
                id="messages_container"
              >
                {filteredFriendsMessages.map((filteredFriendsMessage) => (
                  <FriendMessage
                    key={filteredFriendsMessage.Author}
                    author={filteredFriendsMessage.Author}
                    last_message={filteredFriendsMessage.LastMessage}
                    isSelected={
                      selectedFriendDetails["username"] ===
                      filteredFriendsMessage.Author
                    }
                    onSelected={handleUserSelection}
                    isUnread={filteredFriendsMessage.Unread}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex-col hidden justify-between md:flex p-4 rounded-lg w-full gap-3 darkerBackgroundColor">
            {selectedFriendDetails["username"].trim() === "" ? (
              <div className="flex flex-col gap-3 justify-center items-center">
                <span className="icon-[bi--stars] w-20 h-20 textColor transition-transform duration-200 hover:scale-110"></span>
                <span className="font-medium select-none textColor text-lg sm:text-xl text-center">
                  No messages yet; it's as clean as a clear night!
                </span>
              </div>
            ) : (
              <>
                <div className="flex flex-row border-b border-gray-400 pb-2.5 gap-2 justify-between items-center w-full">
                  <div className="flex flex-row gap-2 items-center">
                    <img
                      id="pfp"
                      src={selectedFriendDetails["pfp"]}
                      className="w-8 h-8 rounded-full"
                      alt=""
                    />
                    <div className="flex flex-row items-center gap-0.5">
                      <span className="select-none font-normal text-lg   roboto">
                        {selectedFriendDetails["username"]}
                      </span>
                      <div className="flex flex-row">
                        <Tooltip
                          title="End-to-end encryption enabled"
                          placement="bottom"
                        >
                          <button className="flex items-center justify-center p-1">
                            <span className="icon-[material-symbols--lock-outline] w-4 h-4" />
                          </button>
                        </Tooltip>
                        <Tooltip title="Family Member" placement="bottom">
                          <button className="flex items-center justify-center p-1">
                            <span className="icon-[uis--house-user] w-4 h-4"></span>
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-3">
                    <Tooltip placement="bottom" title="Save Chat">
                      <button>
                        <span className="icon-[ri--save-line] w-5 h-5"></span>
                      </button>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Options">
                      <button onClick={() => setOptionsSelected(true)}>
                        <span className="icon-[ph--dots-three-vertical] w-5 h-5"></span>
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <div className="flex flex-col flex-grow overflow-y-auto">
                  {selectedFriendDetails.messages.map((msg, index) => {
                    const isSender = msg.sender === "Rapture_TY";
                    return (
                      <div
                        key={index}
                        className={`flex flex-row items-center w-full mb-2 ${isSender ? "justify-end" : "justify-start"}`}
                      >
                        {isSender && (
                          <span className="text-sm font-normal mr-2 select-none">
                            You
                          </span>
                        )}
                        <div
                          className={`flex rounded-md py-2 px-3 ${
                            isSender
                              ? "bg-purple-700"
                              : textColor === "#c0c0c0"
                                ? "bg-neutral-700"
                                : "bg-neutral-600"
                          } text-white items-start gap-3`}
                        >
                          <span>{msg.message}</span>
                        </div>
                        {!isSender && (
                          <button className="flex ml-2 items-center justify-center">
                            <span className="icon-[fluent--emoji-add-16-regular] hover:text-neutral-300 text-neutral-400 transition-colors duration-300 w-4 h-4"></span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-row items-center gap-3">
                  <Tooltip title="Add Emoji" placement="bottom">
                    <button className="flex items-center justify-center p-1">
                      <span className="icon-[iconoir--emoji] w-6 h-6"></span>
                    </button>
                  </Tooltip>

                  <input
                    type="text"
                    placeholder="Type your message here"
                    className="focus:border-purple-600 duration-300 transition-color flex-grow py-1 bg-transparent focus:outline-none focus:ring-0 focus:shadow-none border-b border-gray-400 focus:border-t-0 focus:border-l-0 focus:border-r-0"
                  />

                  <div className="flex flex-row items-center gap-5">
                    <Tooltip title="Attachments" placement="bottom">
                      <button className="flex items-center justify-center transition-transform duration-200 transform hover:-translate-y-1">
                        <span className="icon-[lsicon--attachments-filled] w-6 h-6"></span>
                      </button>
                    </Tooltip>

                    <Tooltip title="Gifts" placement="bottom">
                      <button className="flex items-center justify-center transition-transform duration-200 transform hover:-translate-y-1">
                        <span className="icon-[ri--gift-line] w-6 h-6"></span>
                      </button>
                    </Tooltip>

                    <Tooltip title="Send Money" placement="bottom">
                      <button className="flex items-center justify-center1 transition-transform duration-200 transform hover:-translate-y-1">
                        <span className="icon-[hugeicons--money-send-02] w-6 h-6"></span>
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
