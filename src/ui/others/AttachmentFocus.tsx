import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import formatNumber from "@/utils/formatNumber";
import ReactDOM from "react-dom";
import { Tooltip } from "antd";

import { ThemeContext } from "@/context/ThemeContext";

import type { MenuProps } from "antd/es/menu";
import { Dropdown, Space, ConfigProvider } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

import Comment from "@/ui/post/Comment";
import Boost from "@/ui/modal/Menu/Boost";

import { useTranslation } from "react-i18next";

interface AttachmentDetails {
  comment: string;
  src: string | undefined;
}

export interface AttachmentProps {
  id: string;
  type: string | null;
  videoType: null;
  attachmentDetails: AttachmentDetails;
}

type Props = {
  attachmentIndex: number;
  postDetails: any;
  colorProfile: any;
  onClose: () => void;
  attachments: AttachmentProps[];
};

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const AttachmentFocus = ({
  attachmentIndex,
  postDetails,
  colorProfile,
  attachments,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const { colorProperties } = useContext(ThemeContext);

  const [localColorPreference, setLocalColorPreference] = useState<string>(
    colorProfile ? colorProfile : "purple",
  );
  const [selectedFilter, setSelectedFilter] = useState<string>("Popular");
  const [filteredComments, setFilteredComments] = useState<object[]>(
    postDetails.comments,
  );
  const [isDropdownOpened, setDropdownOpened] = useState<boolean>(true);

  const items: MenuProps["items"] = [
    {
      label: (
        <button
          aria-label="Filter by Recent"
          onClick={() => setSelectedFilter("Recent")}
        >
          {t("home.filterOptions.recent")}
        </button>
      ),
      key: "0",
    },
    {
      label: (
        <button
          aria-label="Filter by Popular"
          onClick={() => setSelectedFilter("Popular")}
        >
          {t("home.filterOptions.popular")}
        </button>
      ),
      key: "1",
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isBoostMenuVisible, setBoostMenuVisible] = useState<boolean>(false);
  const [borderColor, setBorderColor] = useState<string>(
    `border-${localColorPreference}-600`,
  );
  const [shadowColor, setShadowColor] = useState<string>(
    `shadow-${localColorPreference}-600`,
  );
  const [bgColor, setBgColor] = useState<string>(
    `bg-${localColorPreference}-900`,
  );
  const [direction, setDirection] = useState<number>(0); // -1 = left, 1 = right

  const [textColor, setTextColor] = useState<string>(
    `text-${localColorPreference}-500`,
  );

  const navigate = useNavigate();

  const toggleBoost = () => {
    setBoostMenuVisible(!isBoostMenuVisible);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setBgColor(`bg-${localColorPreference}-900`);
    setTextColor(`text-${localColorPreference}-500`);
    setBorderColor(`border-${localColorPreference}-600`);
    setShadowColor(`shadow-${localColorPreference}-600`);
  }, [localColorPreference]);

  const toggleClick = (action) => {
    if (action === "Boost") {
      toggleBoost();
    } else if (action === "Comment") {
      navigate(`/${postDetails.author}/posts/${postDetails.postId}`, {
        replace: false,
      });

      setTimeout(() => {
        const commentElement = document.getElementById("comment");
        if (commentElement) {
          commentElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 0.5 * 1000);
    }
  };

  useEffect(() => {
    if (attachmentIndex === -1) return;
    setCurrentIndex(attachmentIndex);
  }, [attachmentIndex]);

  const onNext = () => {
    if (currentIndex < attachments.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const onPrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentAttachment = attachments[currentIndex];

  useEffect(() => {
    if (currentAttachment) {
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsOpen(false);
      document.body.style.overflow = "auto";
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
      document.body.style.overflow = "auto";
    };
  }, [currentAttachment]);

  const closeModal = () => {
    setIsOpen(false);
    onClose && onClose();
    document.body.style.overflow = "auto";
  };

  const glideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return ReactDOM.createPortal(
    <AnimatePresence initial={false} custom={direction}>
      {isOpen && currentAttachment && (
        <motion.div
          key="image-focus"
          className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999]"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          onClick={closeModal}
        >
          <div className="flex flex-row justify-center items-center space-x-4 relative">
            <div
              className="flex flex-row gap-3 items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-shrink-0 items-center justify-center h-12">
                {currentIndex !== 0 && (
                  <Tooltip
                    mouseLeaveDelay={0}
                    title="Previous"
                    placement="bottom"
                    arrow={false}
                  >
                    <button
                      className="hidden md:flex bg-black/40 rounded-full flex-shrink-0 p-2 z-[70] hover:scale-110 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPrevious();
                      }}
                    >
                      <span className="icon-[tabler--arrow-left] text-white h-7 w-7" />
                    </button>
                  </Tooltip>
                )}
              </div>

              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentAttachment.id}
                  className="flex flex-col"
                  custom={direction}
                  variants={glideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {currentAttachment.type === "img" && (
                    <img
                      src={currentAttachment.attachmentDetails.src}
                      alt="Focused"
                      className="
            w-[90vw] max-w-[500px]
            sm:w-[70vw] sm:max-w-[600px]
            md:w-[60vw] md:max-w-[700px]
            lg:w-[50vw] lg:max-w-[800px]
            xl:w-[40vw] xl:max-w-[900px]
            max-h-[70vh] object-contain
          "
                    />
                  )}

                  {currentAttachment.type === "vid" && (
                    <video
                      src={currentAttachment.attachmentDetails.src}
                      className="
            w-[90vw] max-w-[500px]
            sm:w-[70vw] sm:max-w-[600px]
            md:w-[60vw] md:max-w-[700px]
            lg:w-[50vw] lg:max-w-[800px]
            xl:w-[40vw] xl:max-w-[900px]
            max-h-[70vh] object-contain
          "
                      controls
                    />
                  )}

                  {currentAttachment.attachmentDetails.comment && (
                    <span className="text-white mt-2 block text-center">
                      {currentAttachment.attachmentDetails.comment}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Next Button */}
              <div className="flex flex-shrink-0 items-center justify-center h-12">
                {currentIndex !== attachments.length - 1 && (
                  <Tooltip
                    mouseLeaveDelay={0}
                    title="Next"
                    placement="bottom"
                    arrow={false}
                  >
                    <button
                      className="hidden md:flex bg-black/40 rounded-full p-2 z-[70] hover:scale-110 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                      }}
                    >
                      <span className="icon-[tabler--arrow-right] text-white h-7 w-7" />
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="darkerBackgroundColor fixed p-4 top-4 right-4 w-1/4 rounded-md z-50"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-white font-bold">Xenon</span>
                <Tooltip placement="bottom" mouseLeaveDelay={0} title="Back">
                  <button
                    onClick={() => closeMenu()}
                    className="flex items-center justify-center"
                  >
                    <span className="icon-[ic--round-close] w-4 h-4 text-neutral-300"></span>
                  </button>
                </Tooltip>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <p
                  className={`text-black dark:text-white transition-all duration-300 ${
                    postDetails.isNSFW ? "blur-sm hover:blur-none" : ""
                  }`}
                >
                  {postDetails.description}
                </p>

                {postDetails.isAIGenerated && (
                  <div className="mt-2">
                    <span
                      className={`inline-block text-xs select-none ${bgColor} text-white font-semibold rounded-full px-2 py-1`}
                    >
                      AI-generated
                    </span>
                    <div className={`mt-2`}>
                      <Link
                        to={`/${postDetails.author}/posts/${postDetails.postId}`}
                        className={`inline-block ${textColor} hover:underline font-medium`}
                      >
                        {t("general.showmore")}
                      </Link>
                    </div>
                  </div>
                )}

                {!postDetails.isAIGenerated && (
                  <Link
                    to={`/${postDetails.author}/posts/${postDetails.postId}`}
                    className={`mt-3 inline-block ${textColor} hover:underline font-medium`}
                  >
                    {t("general.showmore")}
                  </Link>
                )}
              </div>

              <footer className="flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    {["Like", "Dislike", "Comment", "Boost"].map(
                      (action, i) => {
                        const icons = {
                          Like: "mdi--like-outline",
                          Dislike: "mdi--dislike-outline",
                          Comment: "majesticons--comment-line",
                          Boost: "material-symbols--speed-outline",
                        };
                        const colors = {
                          Like: "hover:text-blue-500",
                          Dislike: "hover:text-red-500",
                          Comment: "hover:text-cyan-500",
                          Boost: "hover:text-orange-500",
                        };
                        const counts = {
                          Like: postDetails.interactions.likes,
                          Dislike: postDetails.interactions.dislikes,
                          Comment: postDetails.interactions.comments,
                          Boost: postDetails.interactions.boosts,
                        };
                        return (
                          <Tooltip
                            key={i}
                            mouseLeaveDelay={0}
                            title={action}
                            placement="bottom"
                            arrow={false}
                          >
                            <button
                              aria-label={action}
                              onClick={() => {
                                toggleClick(action);
                              }}
                              className={`flex items-center gap-1.5 ${colors[action]} transition-all duration-300 px-2 py-1 rounded-md hover:bg-[#dddddd] dark:hover:bg-[#1d1d1d]`}
                            >
                              <span
                                className={`icon-[${icons[action]}] w-4 h-4`}
                              />
                              <span>{formatNumber(counts[action])}</span>
                            </button>
                          </Tooltip>
                        );
                      },
                    )}
                  </div>

                  <div className="flex gap-3">
                    {true && (
                      <Tooltip
                        mouseLeaveDelay={0}
                        title={"Transfer Ownership"}
                        placement="bottom"
                        arrow={false}
                      >
                        <button
                          aria-label={"Transfer Ownership"}
                          className="flex items-center gap-2 dark:hover:text-neutral-100 hover:text-neutral-800 transition-all duration-300 p-1 rounded hover:bg-[#dddddd] dark:hover:bg-[#1d1d1d]"
                        >
                          <span className="icon-[mingcute--transfer-line] w-4 h-4" />
                        </button>
                      </Tooltip>
                    )}
                    {["Translate", "More"].map((action, i) => {
                      const icons = {
                        Translate: "material-symbols--translate",
                        More: "mingcute--more-2-fill",
                      };
                      return (
                        <Tooltip
                          key={i}
                          mouseLeaveDelay={0}
                          title={action}
                          placement="bottom"
                          arrow={false}
                        >
                          <button
                            aria-label={action}
                            className="flex items-center gap-2 dark:hover:text-neutral-100 hover:text-neutral-800 transition-all duration-300 p-1 rounded hover:bg-[#dddddd] dark:hover:bg-[#1d1d1d]"
                          >
                            <span
                              className={`icon-[${icons[action]}] w-4 h-4`}
                            />
                          </button>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col space-y-3"></div>
              </footer>

              <div
                id="comments"
                className="flex items-center justify-between w-full py-2 text-sm font-medium"
              >
                <hr className="flex-1 border-t borderColor mx-2" />
                <div className="gap-2 flex flex-row">
                  <span className="text-sm dark:text-neutral-400">
                    {t("home.sortLabel")}
                  </span>
                  <div className="flex flex-row gap-2">
                    <ConfigProvider
                      theme={{
                        token: {
                          colorBgBase: colorProperties.darkerBackgroundColor,
                          colorText: colorProperties.textColor,
                        },
                      }}
                    >
                      <Dropdown
                        menu={{ items }}
                        className="text-sm font-bold"
                        trigger={["click"]}
                        placement="bottom"
                        onOpenChange={(open) => {
                          setDropdownOpened(open);
                        }}
                      >
                        <a href="#" onClick={(e) => e.preventDefault()}>
                          <Space>
                            {t(
                              `home.filterOptions.${selectedFilter.toLowerCase()}`,
                            )}
                            {isDropdownOpened ? (
                              <UpOutlined />
                            ) : (
                              <DownOutlined />
                            )}
                          </Space>
                        </a>
                      </Dropdown>
                    </ConfigProvider>
                  </div>
                </div>
              </div>
              <div className="h-2"></div>
              <div className="flex flex-col w-full space-y-4">
                {filteredComments.map((comment, index) => (
                  <Comment
                    key={index}
                    extendWidth={true}
                    interactions={comment.interactions}
                    date={comment.date}
                    author={comment.author}
                    content={comment.text}
                  />
                ))}
              </div>

              <Boost
                visible={isBoostMenuVisible}
                setIsOpen={setBoostMenuVisible}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default AttachmentFocus;
