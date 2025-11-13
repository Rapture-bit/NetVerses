import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "antd";

import FriendMessage from "../messages/FriendMessage";

export default function PortableChat() {
  const [rightPosition, setRightPosition] = useState<string>("8%");
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [isExpanded, setExpanded] = useState<boolean>(false);

  const updatePosition = () => {
    const windowHeight = window.innerHeight;
    if (windowHeight < 740) {
      setRightPosition("6%");
    } else if (windowHeight >= 700 && windowHeight < 900) {
      setRightPosition("7%");
    } else {
      setRightPosition("8%");
    }
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  const chatWidth = Math.min(Math.max(windowWidth * 0.157, 200), 300);

  const calculatedChatHeight = 500;

  const initialChatHeight = 60;
  const chatHeight = isExpanded ? calculatedChatHeight : initialChatHeight;

  const handleUserSelection = () => {};

  return (
    <div className="fixed flex flex-col z-[4000] pointer-events-none min-h-screen min-w-full">
      <AnimatePresence>
        <motion.div
          className="flex flex-col fixed bottom-0 pointer-events-auto rounded-t-lg darkerBackgroundColor border-t border-l border-r border-purple-800 overflow-hidden"
          style={{
            right: rightPosition,
            width: chatWidth,
            boxShadow: "0 4px 15px rgba(128, 0, 255, 0.5)",
            backdropFilter: "blur(10px)",
            originY: 1,
          }}
          animate={{
            height: chatHeight,
          }}
          initial={{ height: initialChatHeight }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 20,
          }}
        >
          <div className="flex flex-row justify-between items-center px-3 py-2 border-b dark:border-[#383838]">
            <Link
              to="/my/messages"
              className="font-medium roboto text-gray-800 dark:text-white flex items-center"
            >
              Messages
            </Link>

            <Tooltip
              placement="top"
              title={isExpanded ? "Collapse" : "Expand"}
              mouseLeaveDelay={0}
            >
              <button
                className="p-1 rounded-full transition-colors flex items-center justify-center"
                onClick={() => setExpanded((prev) => !prev)}
              >
                <span
                  className={`${
                    isExpanded
                      ? "icon-[si--expand-more-fill]"
                      : "icon-[si--expand-less-fill]"
                  } w-6 h-6 block`}
                ></span>
              </button>
            </Tooltip>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto text-gray-700 dark:text-gray-200">
                <div className="flex-1 flex flex-col gap-2">
                  <FriendMessage
                    key={"Rapture_TY"}
                    author={"Rapture_TY"}
                    last_message={"Wanna play?"}
                    imageSize="small"
                    calling={false}
                    isSelected={false}
                    onSelected={handleUserSelection}
                    isUnread={true}
                  />

                  <FriendMessage
                    key={"Rapture_TY"}
                    author={"Rapture_TY"}
                    last_message={"Wanna play?"}
                    imageSize="small"
                    calling={false}
                    isSelected={false}
                    onSelected={handleUserSelection}
                    isUnread={true}
                  />

                  <FriendMessage
                    key={"Rapture_TY"}
                    author={"Rapture_TY"}
                    last_message={"Wanna play?"}
                    imageSize="small"
                    calling={false}
                    isSelected={false}
                    onSelected={handleUserSelection}
                    isUnread={true}
                  />

                  <FriendMessage
                    key={"Rapture_TY"}
                    author={"Rapture_TY"}
                    last_message={"Wanna play?"}
                    imageSize="small"
                    calling={false}
                    isSelected={false}
                    onSelected={handleUserSelection}
                    isUnread={true}
                  />

                  <FriendMessage
                    key={"Rapture_TY"}
                    author={"Rapture_TY"}
                    last_message={"Wanna play?"}
                    imageSize="small"
                    calling={false}
                    isSelected={false}
                    onSelected={handleUserSelection}
                    isUnread={true}
                  />

                  <FriendMessage
                    key={"Rapture_TY"}
                    author={"Rapture_TY"}
                    last_message={"Wanna play?"}
                    imageSize="small"
                    calling={false}
                    isSelected={false}
                    onSelected={handleUserSelection}
                    isUnread={true}
                  />

                  <FriendMessage
                    key={"Rapture_TY"}
                    author={"Rapture_TY"}
                    last_message={"Wanna play?"}
                    imageSize="small"
                    calling={false}
                    isSelected={false}
                    onSelected={handleUserSelection}
                    isUnread={true}
                  />

                  <FriendMessage
                    key={"Rapture_TY"}
                    author={"Rapture_TY"}
                    last_message={"Wanna play?"}
                    imageSize="small"
                    calling={false}
                    isSelected={false}
                    onSelected={handleUserSelection}
                    isUnread={true}
                  />

                  <FriendMessage
                    key={"Rapture_TY"}
                    author={"Rapture_TY"}
                    last_message={"Wanna play?"}
                    imageSize="small"
                    calling={false}
                    isSelected={false}
                    onSelected={handleUserSelection}
                    isUnread={true}
                  />

                  <FriendMessage
                    key={"Rapture_TY"}
                    author={"Rapture_TY"}
                    last_message={"Wanna play?"}
                    imageSize="small"
                    calling={false}
                    isSelected={false}
                    onSelected={handleUserSelection}
                    isUnread={true}
                  />

                  <FriendMessage
                    key={"Rapture_TY"}
                    author={"Rapture_TY"}
                    last_message={"Wanna play?"}
                    imageSize="small"
                    calling={false}
                    isSelected={false}
                    onSelected={handleUserSelection}
                    isUnread={true}
                  />

                  <FriendMessage
                    key={"Rapture_TY"}
                    author={"Rapture_TY"}
                    last_message={"Wanna play?"}
                    imageSize="small"
                    calling={false}
                    isSelected={false}
                    onSelected={handleUserSelection}
                    isUnread={true}
                  />
                </div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
