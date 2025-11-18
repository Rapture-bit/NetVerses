import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "antd";
import FriendMessage from "../messages/FriendMessage";

export default function PortableChat() {
  const [rightPosition, setRightPosition] = useState("8%");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isExpanded, setExpanded] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [inputFocused, setInputFocused] = useState(false);

  const updatePosition = () => {
    const windowHeight = window.innerHeight;
    if (windowHeight < 740) setRightPosition("6%");
    else if (windowHeight < 900) setRightPosition("7%");
    else setRightPosition("8%");
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  const chatWidth = Math.min(Math.max(windowWidth * 0.157, 200), 300);
  const maxChatHeight = Math.min(window.innerHeight * 0.7, 600);
  const chatHeight = isExpanded ? maxChatHeight : 60;

  const handleUserSelection = (author: string) => {
    console.log("Selected user:", author);
  };

  const messages = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    author: `Rapture_TY_${i}`,
    last_message: "Wanna play?",
    isUnread: i % 2 === 0,
  }));

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = msg.author
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && msg.isUnread) ||
      (filter === "read" && !msg.isUnread);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fixed bottom-0 right-0 flex flex-col z-[800] pointer-events-none min-h-screen min-w-full">
      <AnimatePresence>
        <motion.div
          className="flex flex-col fixed bottom-0 pointer-events-auto rounded-t-lg darkerBackgroundColor border-t border-l border-r border-purple-800 overflow-hidden"
          style={{
            right: rightPosition,
            width: chatWidth,
            boxShadow: "0 4px 15px rgba(128, 0, 255, 0.5)",
            backdropFilter: "blur(10px)",
            transformOrigin: "bottom",
          }}
          animate={{ height: chatHeight }}
          initial={{ height: 60 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          <div className="flex justify-between items-center px-4 py-2 border-b dark:border-[#383838]">
            <Link
              to="/my/messages"
              className="font-medium roboto text-gray-800 dark:text-white flex items-center transition"
            >
              Messages
            </Link>

            <Tooltip
              placement="top"
              title={isExpanded ? "Collapse" : "Expand"}
              mouseLeaveDelay={0}
            >
              <motion.button
                className="p-1 rounded-full flex items-center justify-center hover:bg-purple-800/20 transition"
                onClick={() => setExpanded((prev) => !prev)}
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: isExpanded ? 180 : 0 }}
              >
                <span
                  className={`${
                    isExpanded
                      ? "icon-[si--expand-more-fill]"
                      : "icon-[si--expand-less-fill]"
                  } w-6 h-6 block text-white`}
                />
              </motion.button>
            </Tooltip>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="flex flex-col gap-2 p-3 border-b border-purple-700 dark:border-neutral-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className={`w-full px-3 py-1 rounded-md border transition-all duration-300 ${
                    inputFocused
                      ? "border-purple-700"
                      : "dark:border-neutral-700"
                  } bg-transparent text-white placeholder-gray-400 outline-none`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 text-gray-700 dark:text-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((msg) => (
                    <FriendMessage
                      key={msg.id}
                      author={msg.author}
                      last_message={msg.last_message}
                      imageSize="small"
                      calling={false}
                      isSelected={false}
                      onSelected={() => handleUserSelection(msg.author)}
                      isUnread={msg.isUnread}
                    />
                  ))
                ) : (
                  <div className="text-gray-400 text-sm text-center mt-4">
                    No friends found
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
