import { useNavigate, Link } from "react-router-dom";
import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
  useContext,
} from "react";

import { ThemeContext } from "@/context/ThemeContext";
import SearchBar from "@/ui/input/SearchBar";
import BottomBar from "@/ui/navigation/BottomBar";
import FriendMessage from "@/ui/messages/FriendMessage";

import FriendProfile from "@/ui/messages/FriendProfile";
import FriendActivity from "@/ui/messages/FriendActivity";
import FriendMenu from "@/ui/messages/FriendMenu";
import SecondFriendMenu from "@/ui/messages/SecondFriendMenu";

import Tooltip from "@/ui/Tooltip";
import PageTitle from "@/ui/others/PageTitle";

interface messagesProp {
  sender: string;
  messageId: string;
  recipient: string;
  message: string;
  timestamp: string;
  attachemnt?: string;
}

interface filteredFriendsMessageProp {
  Author: string;
  LastMessage: string;
  Unread: boolean;
}

interface Call {
  username: string;
  callTime: Date;
  answered: boolean;
}

interface friendDetailsProp {
  username: string;
  pfp: string;
  messages: messagesProp[];
}

export default function Messages() {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});
  const [messageHeights, setMessageHeights] = useState<{
    [key: string]: number;
  }>({});

  function toggleBack() {
    if (window.history.length > 1) {
      const previousUrl = document.referrer;
      if (previousUrl.startsWith(window.location.origin)) {
        navigate(-1);
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }

  const navigate = useNavigate();
  const { colorProperties } = useContext(ThemeContext);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isFriendTyping, setFriendTyping] = useState<boolean>(true);
  const [Calls, setCalls] = useState<Call[]>([
    {
      username: "Rapture_TY",
      callTime: new Date(Date.now()),
      answered: false,
    },
  ]);
  const [selectedFriendDetails, setSelectedFriendDetails] =
    useState<friendDetailsProp>({
      username: "Blitz_Jay", // Friend's Username
      pfp: "/images/avatars/default.jpg", // PFP
      messages: [
        {
          sender: "Xenon",
          messageId: "eeee57d9-a02d-4950-b8b2-38eea6a34d99",
          recipient: "Blitz_Jay",
          message:
            "Hey! I just wanted to check in and see if you managed to finish the project we talked about last week. I know we set some pretty tight deadlines, so I completely understand if you’re still working on it or if you ran into any issues along the way. I’m eager to see what you’ve done so far, and if you need any help or want to go over some parts together, I’m happy to jump in. Let me know how things are going!",
          timestamp: "2024-10-24T09:30:00Z",
        },
        {
          sender: "Blitz_Jay",
          messageId: "6f133bb1-6106-402a-bf96-a1c3a4f3ca08",
          recipient: "Xenon",
          message: "Yes, I just sent it over to you. What do you think?",
          timestamp: "2024-10-24T09:31:00Z",
        },
        {
          sender: "Xenon",
          messageId: "0b711fa5-0fc4-4819-8929-43f6d11a7cb8",
          recipient: "Blitz_Jay",
          message: "I think it's great! Just a few minor adjustments.",
          timestamp: "2024-10-24T09:32:00Z",
        },
        {
          sender: "Blitz_Jay",
          messageId: "4a9bb4da-ca71-49ab-8b4a-341ae1cfa4eb",
          recipient: "Xenon",
          message: "Sure, let me know what needs to be changed.",
          timestamp: "2024-10-24T09:33:00Z",
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

  const [profileColor, setProfileColor] = useState<string>("purple"); // local user's profile color
  const [profileColors, setProfileColors] = useState<profileColors>({
    bannerGradient: `from-${profileColor}-700`,
    background: `bg-${profileColor}-800`,
    hoverBackground: `hover:bg-${profileColor}-800`,
    borderColor: `border-${profileColor}-800`,
    textColor: `text-${profileColor}-500`,
  });

  const [filter, setFilter] = useState<string>("All");
  const [friendsFilter, setFriendsFilter] = useState<string>("");
  const [filteredFriendsMessages, setFilteredFriendsMessages] = useState<
    Object[]
  >([]);

  const handleSearchChange = (value: string) => {
    setFriendsFilter(value);
  };

  const startCall = (recipients) => {};
  const endCall = (callId) => {};

  const findFriendCall = (recipientUsername: string): Call | null => {
    return Calls.find((c) => c.username === recipientUsername) || null;
  };

  useEffect(() => {
    function handleContextMenu(e) {
      e.preventDefault();
    }

    const messages = selectedFriendDetails.messages;
    messages.forEach((element) => {
      const msgId = element.messageId;
      const documentElement = document.getElementById(msgId);
      const parentElement = documentElement.parentElement;

      if (parentElement) {
        parentElement.addEventListener("contextmenu", handleContextMenu);
      }

      return () => {
        parentElement.removeEventListener("contextmenu", handleContextMenu);
      };
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newHeights: { [key: string]: number } = {};
      for (const id in messageRefs.current) {
        const el = messageRefs.current[id];
        if (el) newHeights[id] = el.offsetHeight;
      }
      setMessageHeights(newHeights);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedFriendDetails.messages]);

  useEffect(() => {
    const observers: ResizeObserver[] = [];

    for (const id in messageRefs.current) {
      const el = messageRefs.current[id];
      if (el) {
        const observer = new ResizeObserver(() => {
          setMessageHeights((prev) => ({
            ...prev,
            [id]: el.offsetHeight,
          }));
        });
        observer.observe(el);
        observers.push(observer);
      }
    }

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [selectedFriendDetails.messages]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    console.log(windowSize.width, windowSize.height);
  }, [windowSize]);

  const handleSend = () => {};

  const findMessageSizeInList = (msgId: string) => {
    console.log("right");
    const size = document.getElementById(msgId).offsetHeight;
    return size;
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedFriendDetails.messages]);

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
      <PageTitle title="NetVerses ~ Messages" />
      <BottomBar />

      <div className="flex flex-col gap-3 justify-start items-center w-full h-screen pt-24 bg-fixed bg-cover bg-center sm:px-9">
        <div className="flex flex-row border borderColor justify-between gap-5 p-4 sm:pl-5 sm:py-4 rounded-md mx-auto sm:mx-0 w-full darkerBackgroundColor">
          <Tooltip label={"Back"}>
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
          <div
            className={`flex flex-col border borderColor p-0 ${windowSize.width < 860 ? "w-full" : "w-1/3"} rounded-lg darkerBackgroundColor`}
          >
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
                {filteredFriendsMessages.map(
                  (filteredFriendsMessage: filteredFriendsMessageProp) => (
                    <FriendMessage
                      key={filteredFriendsMessage.Author}
                      author={filteredFriendsMessage.Author}
                      last_message={filteredFriendsMessage.LastMessage}
                      calling={
                        findFriendCall(filteredFriendsMessage.Author)
                          ?.answered === false
                      }
                      isSelected={
                        selectedFriendDetails["username"] ===
                        filteredFriendsMessage.Author
                      }
                      onSelected={handleUserSelection}
                      isUnread={filteredFriendsMessage.Unread}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
          <div
            className={`flex-col  ${windowSize.width < 860 ? "hidden" : "flex"} w-full space-y-3`}
          >
            <div
              className={`${findFriendCall(selectedFriendDetails["username"])?.answered && windowSize.width <= 970 ? "bg-green-700 text-white" : "darkerBackgroundColor"} w-full p-3 border borderColor rounded-lg md:flex justify-between hidden`}
            >
              <div className="flex flex-row gap-2 justify-between items-center w-full">
                <div className="flex flex-row gap-3 items-center">
                  <div className="relative w-9 h-9">
                    <img
                      draggable={false}
                      id="pfp"
                      src={selectedFriendDetails["pfp"]}
                      className="w-9 h-9 rounded-full"
                      alt=""
                    />
                    <span className="absolute bottom-0 right-0 block w-3 h-3 bg-violet-800 rounded-full"></span>
                  </div>

                  <div className="flex flex-row items-center gap-1">
                    <Tooltip
                      title={selectedFriendDetails["username"]}
                      placement="bottom"
                      mouseLeaveDelay={0}
                    >
                      <span className="select-none font-normal hover:underline cursor-pointer text-base inter">
                        {selectedFriendDetails["username"]}
                      </span>
                    </Tooltip>
                    <div className="flex flex-row">
                      <Tooltip
                        title="End-to-end encrypted"
                        mouseLeaveDelay={0}
                        placement="bottom"
                      >
                        <button className="flex items-center justify-center p-1">
                          <span className="icon-[material-symbols--lock-outline] w-[1.25rem] h-[1.25rem]" />
                        </button>
                      </Tooltip>
                      <Tooltip
                        title="Family Member"
                        mouseLeaveDelay={0}
                        placement="bottom"
                      >
                        <button className="flex items-center justify-center p-1">
                          <span className="icon-[uis--house-user] w-[1.25rem] h-[1.25rem]"></span>
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-3 items-center">
                  {findFriendCall(selectedFriendDetails["username"])
                    ?.answered && (
                    <Tooltip
                      title="End Call"
                      mouseLeaveDelay={0}
                      placement="bottom"
                    >
                      <button className="flex items-center justify-center p-1 hover:text-red-600 transition-colors duration-200 transform hover:scale-110">
                        <span className="icon-[material-symbols--call-end] w-[1.4rem] h-[1.4rem]"></span>
                      </button>
                    </Tooltip>
                  )}

                  {!findFriendCall(selectedFriendDetails["username"])
                    ?.answered && (
                    <Tooltip
                      title="Call"
                      mouseLeaveDelay={0}
                      placement="bottom"
                    >
                      <button className="flex items-center justify-center p-1">
                        <span className="icon-[ic--round-call] w-[1.4rem] h-[1.4rem]" />
                      </button>
                    </Tooltip>
                  )}

                  <Tooltip
                    title="Search in DMs"
                    mouseLeaveDelay={0}
                    placement="bottom"
                  >
                    <button className="flex items-center justify-center p-1">
                      <span className="icon-[material-symbols--search] w-[1.4rem] h-[1.4rem]" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
            {findFriendCall(selectedFriendDetails["username"])?.answered &&
              windowSize.width > 970 && (
                <div className="w-full hidden md:flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-green-700 to-emerald-600 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-green-400/20 animate-pulse blur-2xl" />

                  <div className="flex items-center gap-3 text-white relative z-10">
                    <span className="icon-[ic--round-call] w-[1.5rem] h-[1.5rem] animate-pulse" />
                    <span className="font-medium tracking-wide select-none">
                      In Call
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-white/90 font-mono relative z-10">
                    <span className="bg-white/10 px-3 py-1 rounded-lg">
                      {findFriendCall(
                        selectedFriendDetails["username"],
                      ).callTime.toLocaleTimeString([], { minute: "2-digit" }) +
                        ":" +
                        findFriendCall(
                          selectedFriendDetails["username"],
                        ).callTime.toLocaleTimeString([], {
                          second: "2-digit",
                        })}
                    </span>
                  </div>
                </div>
              )}
            <div className="darkerBackgroundColor border borderColor overflow-y-auto overflow-x-hidden flex flex-col gap-3 w-full p-4 rounded-lg md:flex justify-between h-screen">
              {selectedFriendDetails["messages"].length === 0 ? (
                <div className="flex flex-col gap-3 justify-center items-center">
                  <span className="icon-[bi--stars] w-20 h-20 textColor transition-transform duration-200 hover:scale-110"></span>
                  <span className="font-medium select-none textColor text-lg sm:text-xl text-center">
                    No messages yet; it's as clean as a clear night sky!
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex flex-col space-y-5 flex-grow overflow-y-auto">
                    {selectedFriendDetails.messages.map((msg, index) => {
                      const isSender =
                        msg.sender !== selectedFriendDetails["username"];
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
                            className={`relative flex py-2 px-3 items-start gap-3 ${
                              isSender
                                ? "bg-purple-700 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl justify-end hover:bg-purple-600"
                                : `rounded-tl-xl rounded-tr-xl rounded-br-xl justify-start ${
                                    colorProperties.textColor === "#c0c0c0" // Dark
                                      ? `bg-[#1f2844] text-white hover:bg-[#1f2844]/50`
                                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                                  }`
                            } items-start gap-3 transition-colors duration-200`}
                          >
                            <span
                              id={msg.messageId}
                              ref={(el) =>
                                (messageRefs.current[msg.messageId] = el)
                              }
                            >
                              {msg.message}
                            </span>
                            <div
                              style={{
                                transform: `translateY(${messageHeights[msg.messageId] || 0}px)`,
                              }}
                              className={`flex flex-row z-50 space-x-1.5 absolute p-0.5 rounded-md darkerBackgroundColor transition-all duration-200`}
                            >
                              <button className="inline-flex items-center justify-center">
                                <span className="icon-[fxemoji--skull] inline-block dark:hover:bg-[#303030] hover:bg-[#cececece] hover:scale-110 rounded-md p-0.5 duration-300 transition-all w-5 h-5"></span>
                              </button>

                              <button className="inline-flex items-center justify-center">
                                <span className="icon-[noto--fire] inline-block dark:hover:bg-[#303030] hover:bg-[#cececece] hover:scale-110 rounded-md p-0.5 duration-300 transition-all w-5 h-5"></span>
                              </button>

                              <button className="inline-flex items-center justify-center">
                                <span className="icon-[twemoji--red-heart] inline-block dark:hover:bg-[#303030] hover:bg-[#cececece] hover:scale-110 rounded-md p-0.5 duration-300 transition-all w-5 h-5"></span>
                              </button>
                            </div>
                            <div
                              className={`text-xs ${isSender ? "text-gray-300" : "dark:text-gray-300 text-gray-900"} mt-1`}
                            >
                              {(() => {
                                const msgDate = new Date(msg.timestamp);
                                const today = new Date();

                                const isToday =
                                  msgDate.getDate() === today.getDate() &&
                                  msgDate.getMonth() === today.getMonth() &&
                                  msgDate.getFullYear() === today.getFullYear();

                                if (isToday) {
                                  return msgDate.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  });
                                } else {
                                  return (
                                    msgDate.toLocaleDateString([], {
                                      month: "short",
                                      day: "numeric",
                                    }) +
                                    " " +
                                    msgDate.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  );
                                }
                              })()}
                            </div>
                          </div>
                          {!isSender && (
                            <Tooltip
                              placement="bottom"
                              mouseLeaveDelay={0}
                              title="Add Emoji"
                            >
                              <button className="flex ml-2 items-center justify-center">
                                <span className="icon-[mingcute--emoji-fill] hover:text-neutral-300 text-neutral-400 transition-colors duration-300 w-4 h-4"></span>
                              </button>
                            </Tooltip>
                          )}
                        </div>
                      );
                    })}
                    {isFriendTyping && (
                      <div className="flex flex-row items-center w-full mb-2 justify-start">
                        <div
                          className={`relative flex py-2 px-3 items-center gap-2 rounded-tl-xl rounded-tr-xl rounded-br-xl justify-start ${
                            colorProperties.textColor === "#c0c0c0"
                              ? `bg-[#1f2844] text-white hover:bg-[#1f2844]/50`
                              : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                          } transition-colors duration-200`}
                        >
                          <div className="flex items-end gap-[3px] h-[14px]">
                            {" "}
                            {[0, 1, 2, 3].map((i) => (
                              <span
                                key={i}
                                className="w-1 bg-current rounded-full animate-[wave_1s_ease-in-out_infinite]"
                                style={{
                                  animationDelay: `${i * 0.15}s`,
                                  height: "6px",
                                }}
                              ></span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row items-center gap-3">
                    <Tooltip
                      title="Add Emoji"
                      mouseLeaveDelay={0}
                      placement="bottom"
                    >
                      <button className="flex items-center justify-center p-1">
                        <span className="icon-[mingcute--emoji-fill] textColor w-6 h-6"></span>
                      </button>
                    </Tooltip>

                    <div className="relative flex flex-col-reverse w-full">
                      <textarea
                        placeholder="Type your message here"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          requestAnimationFrame(() => {
                            target.style.height = "35px";
                            target.style.height = `${target.scrollHeight}px`;
                          });
                        }}
                        style={{
                          height: "35px",
                          minHeight: "35px",
                          maxHeight: "200px",
                        }}
                        className="resize-none duration-300 transition-colors flex-grow py-1 bg-transparent focus:outline-none focus:ring-0 focus:shadow-none border-b border-gray-400"
                      />
                    </div>

                    <div className="flex flex-row items-center gap-4">
                      <Tooltip
                        title="Attachments"
                        mouseLeaveDelay={0}
                        placement="bottom"
                      >
                        <button className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 dark:bg-[#2b3554] text-gray-800 dark:text-white shadow hover:scale-110 transition-transform duration-200">
                          <span className="icon-[ic--baseline-attachment] w-6 h-6"></span>
                        </button>
                      </Tooltip>

                      <Tooltip
                        title="Gifts"
                        mouseLeaveDelay={0}
                        placement="bottom"
                      >
                        <button className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 dark:bg-[#2b3554] text-gray-800 dark:text-white shadow opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-200">
                          <span className="icon-[bxs--gift] w-6 h-6"></span>
                        </button>
                      </Tooltip>

                      <Tooltip
                        title="Send Money"
                        mouseLeaveDelay={0}
                        placement="bottom"
                      >
                        <button className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 dark:bg-[#2b3554] text-gray-800 dark:text-white shadow hover:scale-110 transition-transform duration-200">
                          <span className="icon-[hugeicons--money-send-02] w-6 h-6"></span>
                        </button>
                      </Tooltip>

                      <div className="w-px h-6 bg-gray-400 dark:bg-gray-600"></div>

                      <Tooltip
                        title="Send"
                        mouseLeaveDelay={0}
                        placement="bottom"
                      >
                        <button
                          className={`flex items-center justify-center w-10 h-10 rounded-md bg-${profileColor}-600 text-white shadow hover:bg-${profileColor}-700 hover:scale-110 transition-all duration-200`}
                        >
                          <span className="icon-[fluent--send-16-filled] w-6 h-6"></span>
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="hidden xl:flex space-y-3 flex-col w-1/3">
            <FriendProfile username={selectedFriendDetails["username"]} />
            <FriendActivity user={selectedFriendDetails["username"]} />
            <FriendMenu user={selectedFriendDetails["username"]} />
            <SecondFriendMenu user={selectedFriendDetails["username"]} />
            <div className="w-full border borderColor flex flex-row justify-center items-center p-2 darkerBackgroundColor rounded-lg">
              <Link
                to={`/${selectedFriendDetails["username"]}`}
                className="text-sm dark:hover:text-white hover:text-black transition duration-200"
              >
                View Profile
              </Link>
            </div>
            <span className="text-xs">© 2026 NetVerses</span>
          </div>
        </div>
      </div>
    </>
  );
}
