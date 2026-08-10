import jobTitles from "@/ui/input/data/careersDatabase.json";

import React, { useState, useEffect, useRef, useContext } from "react";
import PrimaryModal from "@/ui/modal/Primary";
import { motion, AnimatePresence } from "framer-motion";
import { Button, ConfigProvider } from "antd";
import { ThemeContext } from "@/context/ThemeContext";
import { UserContext } from "@/context/UserContext";
import { Tooltip } from "antd";
import PrimaryInput from "@/ui/input/Primary";

import { useTranslation } from "react-i18next";

import { useCSRFStore } from "@/context/CSRFStore";

import Dropdown from "@/ui/input/Dropdown";

interface ErrorState {
  TabTwo: {
    DisplayName: Object;
    Bio: Object;
    JobTitle: Object;
  };
}

const capitalizeFirstAlphabetic = (str?: string): string | null => {
  if (!str) return null;
  if (str === "sms") {
    return "SMS";
  }

  const chars = str.split("");

  for (let i = 0; i < chars.length; i++) {
    if (/[a-zA-Z]/.test(chars[i])) {
      chars[i] = chars[i].toUpperCase();
      break;
    }
  }

  return chars.join("");
};

export default function ProfileCustomization({ visible, setIsOpen }) {
  const { colorProperties } = useContext(ThemeContext);
  const { userData } = useContext(UserContext)!;
  const { t } = useTranslation();

  const displayingText = t("profileCustomization.gettingReady");
  const [displayedText, setDisplayedText] = useState(
    t("profileCustomization.gettingReady"),
  );
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [currentTab, setTab] = useState<number>(0);
  const [customImgSrc, setCustomImgSrc] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedPronouns, setSelectedPronouns] = useState<string>("None");
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  const [selectedZodiac, setSelectedZodiac] = useState<string>("None");
  const [CareerComplete, setCareerComplete] = useState<boolean>(false);
  const [clearDropdown, setClearDropdown] = useState<boolean | undefined>(
    undefined,
  );
  const [clearZodiacDropdown, setClearZodiacDropdown] = useState<
    boolean | undefined
  >(undefined);

  const avatars = [
    "/images/avatars/avatar1.png",
    "/images/avatars/avatar2.png",
    "/images/avatars/avatar3.png",
    "/images/avatars/avatar4.png",
    "/images/avatars/avatar5.png",
  ];

  const { csrfToken, setCSRFToken } = useCSRFStore();

  const interestOptions = [
    "Astronomy",
    "News",
    "Gaming",
    "Art",
    "Cooking",
    "Music",
    "Travel",
    "Sports",
    "Technology",
    "Movies",
    "Books",
    "Photography",
    "Writing",
    "Programming",
  ];

  const dropdownPronouns = [
    { title: "not_specified", value: t("pronouns.notspecified") },
    { title: "sheher", value: t("pronouns.sheher") },
    { title: "hehim", value: t("pronouns.hehim") },
    { title: "theythem", value: t("pronouns.theythem") },
  ];

  const dropdownPronounsValues = [
    t("pronouns.notspecified"),
    t("pronouns.sheher"),
    t("pronouns.hehim"),
    t("pronouns.theythem"),
  ];

  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [errorState, setErrorState] = useState<ErrorState>({
    TabTwo: {
      DisplayName: {
        Invalid: false,
        msg: "",
      },
      Bio: {
        Invalid: false,
        msg: "",
      },
      JobTitle: {
        Invalid: false,
        msg: "",
      },
    },
  });

  const indexRef = useRef(0);
  const typingRef = useRef(true);
  const fileInputRef = useRef(null);

  const findPronounsTitle = (v: string) => {
    const foundElement = dropdownPronouns.find((element) => {
      console.log(element.value, v);
      return element.value == v;
    });

    console.log(foundElement);

    if (foundElement) {
      return foundElement.title;
    } else {
      return;
    }
  };

  const handleClick = () => {
    if (fileInputRef.current === null) return;
    fileInputRef.current?.click();
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      }
      if (prev.length >= 8) return prev;
      return [...prev, interest];
    });
  };

  useEffect(() => {
    console.log(findPronounsTitle(selectedPronouns));
  }, [selectedPronouns]);

  const confirmRequest = async () => {
    let csrfTokenStore: any;
    const updateProfileFetch = await fetch(
      "https://api.netverses.com/v1/me/update-profile",
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          display_name: displayName,
          career: jobTitle,
          pronouns:
            selectedPronouns !== "None" &&
            findPronounsTitle(selectedPronouns) !== "not_specified"
              ? selectedPronouns
              : null,
          profile_picture:
            selectedAvatar === "custom"
              ? await (async () => {
                  if (!selectedFile) return null;
                  const formData = new FormData();
                  formData.append("file", selectedFile);

                  const uploadResponse = await fetch(
                    "https://api.netverses.com/v1/me/avatar-upload",
                    {
                      method: "POST",
                      credentials: "include",
                      body: formData,
                      headers: {
                        "X-CSRF-Token": csrfToken,
                      },
                    },
                  );
                  if (!uploadResponse.ok)
                    throw new Error("Failed to upload avatar");
                  const uploadData = await uploadResponse.json();
                  csrfTokenStore = uploadData.csrfToken;
                  return uploadData.avatar_url;
                })()
              : "https://netverses.com" + selectedAvatar,
          newlyRegistered: false,
        }),
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfTokenStore ? csrfTokenStore : csrfToken,
        },
      },
    );

    if (!updateProfileFetch.ok) {
      setIsTransitioning(false);
      return;
    }

    const updateProfileResponse = await updateProfileFetch.json();
    console.log(updateProfileResponse);

    csrfTokenStore = updateProfileResponse.csrfToken;
    if (!updateProfileResponse) return null;
    if (!updateProfileResponse.success) return null;

    const syncInterestsFetch = await fetch(
      "https://api.netverses.com/v1/me/sync/interests",
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ interests: selectedInterests }),
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfTokenStore,
        },
      },
    );

    if (!syncInterestsFetch.ok) {
      setIsTransitioning(false);
      return;
    }

    csrfTokenStore = (await syncInterestsFetch.json()).csrfToken;
    window.location.href = "/";
  };

  const handleConfirm = () => {
    if (currentTab === 1) {
      if (
        selectedAvatar === null ||
        (selectedAvatar === "custom" && !selectedFile)
      )
        return;
    }

    if (currentTab === 2) {
      if (
        !displayName ||
        errorState.TabTwo.DisplayName["Invalid"] ||
        errorState.TabTwo.JobTitle["Invalid"]
      )
        return;
    }

    if (currentTab === 3) {
      if (selectedInterests.length === 0) return;

      setIsTransitioning(true);

      setTimeout(() => {
        setIsTransitioning(false);
        setTab(4);
        setTimeout(async () => {
          await confirmRequest();
        }, 1200);
      }, 1200);

      return;
    }

    setIsTransitioning(true);

    setTimeout(() => {
      setIsTransitioning(false);
      toggleTab();
    }, 1200);
  };

  const toggleTab = () => {
    setTab(currentTab + 1);
  };

  const handleSkip = () => {
    (async () => {
      setSelectedInterests(null);
      await confirmRequest();
    })();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "image/gif") {
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomImgSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
    console.log("URL: ", customImgSrc);
    console.log("File: ", file);

    setSelectedFile(file);
    setSelectedAvatar("custom");
  };

  useEffect(() => {
    console.log(jobTitle);
  }, [jobTitle]);

  useEffect(() => {
    const loop = () => {
      if (typingRef.current) {
        if (indexRef.current < displayingText.length) {
          indexRef.current += 1;
          setDisplayedText(displayingText.slice(0, indexRef.current));
          setTimeout(loop, 40);
        } else {
          typingRef.current = false;
          setTimeout(loop, 800);
        }
      } else {
        if (indexRef.current > 0) {
          indexRef.current -= 1;
          setDisplayedText(displayingText.slice(0, indexRef.current));
          setTimeout(loop, 20);
        } else {
          typingRef.current = true;
          setTimeout(loop, 400);
        }
      }
    };

    loop();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 4000);

    setTimeout(() => {
      setTab(1);
    }, 15000);
  }, []);

  useEffect(() => {
    return () => {
      if (customImgSrc) URL.revokeObjectURL(customImgSrc);
    };
  }, [customImgSrc]);

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const trimmed = value.trim();

    if (trimmed.length < 100) {
      setJobTitle(value);
    }

    setErrorState((prev) => ({
      ...prev,
      TabTwo: {
        ...prev.TabTwo,
        JobTitle: {
          Invalid: trimmed.length > 100,
          msg: trimmed.length > 100 ? "Job title is too long" : "",
        },
      },
    }));
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const trimmed = value.trim();

    const regex = /^[A-Za-z0-9_.-]+( [A-Za-z0-9_.-]+)*$/;
    const isValid =
      trimmed.length >= 3 && trimmed.length <= 20 && regex.test(trimmed);

    setDisplayName(value);

    setErrorState((prev) => ({
      ...prev,
      TabTwo: {
        ...prev.TabTwo,
        DisplayName: {
          Invalid: !isValid,
          msg:
            trimmed.length < 3
              ? t("profileCustomization.tabTwo.errors.displayNameTooShort")
              : !regex.test(trimmed)
                ? t(
                    "profileCustomization.tabTwo.errors.displayNameInvalidChars",
                  )
                : "",
        },
      },
    }));
  };

  const toggleInputComplete = (isComplete: boolean, selectedOption: string) => {
    setCareerComplete(isComplete);
    setJobTitle(selectedOption);
  };

  useEffect(() => {
    console.log(selectedPronouns, selectedZodiac);
  }, [selectedPronouns, selectedZodiac]);

  useEffect(() => {
    if (!visible) return;

    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-999 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[20px] pointer-events-auto rounded-lg" />

          <div
            className={`relative flex flex-col space-y-3 ${currentTab !== 0 ? "w-1/4" : ""} darkerBackgroundColor rounded-lg p-3 z-10`}
          >
            {isTransitioning && (
              <div className="w-full mt-2">
                <div className="h-1.5 w-full bg-gray-500/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="h-full w-1/2 bg-indigo-500 rounded-full"
                  />
                </div>

                <p className="text-xs text-gray-400 mt-1 text-center">
                  {t("profileCustomization.saving")}
                </p>
              </div>
            )}
            <div className="justify-center items-center flex flex-col space-y-3 p-2">
              <AnimatePresence mode="wait">
                {isLoading && (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="icon-[eos-icons--loading] w-9 h-9 dark:text-white/85 text-black"
                  ></motion.span>
                )}

                {!isLoading && currentTab === 0 && (
                  <motion.div
                    key="tab-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="lato font-medium dark:text-white/85 text-black"
                  >
                    <span>
                      {displayedText}
                      <span className="blinking-cursor">|</span>
                    </span>
                  </motion.div>
                )}

                {!isLoading && currentTab === 1 && (
                  <motion.div
                    key="tab-1"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="flex flex-col space-y-3 justify-start items-start w-full"
                  >
                    <div className="flex flex-col space-y-2 w-full">
                      <h2 className="lato font-semibold text-lg dark:text-white/85 text-black text-left">
                        {t("profileCustomization.tabOneTitle")}
                      </h2>
                      <div className="flex flex-col space-y-4 w-full">
                        <div className="flex flex-col space-y-0.5">
                          <p className="text-base dark:text-white/70 text-gray-800">
                            {t("profileCustomization.welcomeWord")},{" "}
                            <span className="font-medium hover:underline cursor-pointer">
                              {capitalizeFirstAlphabetic(userData?.username)}
                            </span>
                            !
                          </p>
                          <p className="text-sm dark:text-white/60 text-gray-700">
                            {t("profileCustomization.avatarOptionsDescription")}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 sm:gap-4">
                          {avatars.map((avatar) => (
                            <button
                              key={avatar}
                              onClick={() => setSelectedAvatar(avatar)}
                              className="relative aspect-square overflow-hidden transition-all duration-300 rounded-lg hover:scale-105 focus:outline-none min-h-0"
                            >
                              <img
                                className={`w-full h-full object-cover rounded-lg border-0 ${
                                  selectedAvatar === avatar
                                    ? "border-3 border-indigo-400"
                                    : ""
                                }`}
                                src={avatar}
                                alt={`Avatar ${avatars.indexOf(avatar) + 1}`}
                              />
                            </button>
                          ))}

                          <button
                            onClick={handleClick}
                            className={`relative aspect-square w-full h-full rounded-lg ${selectedAvatar == customImgSrc ? "border-3 border-indigo-400" : "border-2 border-gray-300"} border-dashed dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 overflow-hidden min-h-0`}
                          >
                            {!customImgSrc ? (
                              <div className="flex flex-col items-center justify-center w-full h-full p-1.5">
                                <div className="p-1 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors duration-300 flex-shrink-0 w-8 h-8 flex">
                                  <span className="icon-[material-symbols--upload] w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300" />
                                </div>
                                <p className="text-[9px] sm:text-[10px] text-center text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 leading-tight mt-1 px-0.5 font-medium">
                                  {t("profileCustomization.customAvatarUpload")}
                                </p>
                                <p className="text-[8px] sm:text-[9px] text-gray-400 dark:text-gray-500 leading-tight">
                                  {t("profileCustomization.size")}
                                  <span className="text-red-400 dark:text-red-500 ml-0.5">
                                    *
                                  </span>
                                </p>
                              </div>
                            ) : (
                              <img
                                className={`w-full h-full object-cover rounded-lg`}
                                src={customImgSrc}
                                alt="Uploaded Avatar"
                              />
                            )}
                          </button>

                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>

                        <div className="w-full flex flex-row justify-center items-center">
                          <button
                            disabled={
                              !selectedAvatar ||
                              isTransitioning ||
                              (selectedAvatar === "custom" && !selectedFile)
                            }
                            onClick={handleConfirm}
                            className={`${!selectedAvatar || isTransitioning || (selectedAvatar === "custom" && !selectedFile) ? "bg-indigo-700/20 text-white/30 cursor-not-allowed!" : "bg-indigo-700 text-white"} font-medium py-2 sm:px-10 px-5 rounded-lg shadow-sm hover:bg-opacity-85 transition duration-300 text-sm`}
                          >
                            <span>{t("general.Confirm")}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!isLoading && currentTab === 2 && (
                  <motion.div
                    key="tab-2"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="lato font-medium dark:text-white/85 text-black"
                  >
                    <h2 className="lato font-semibold text-lg dark:text-white/85 text-black text-left">
                      {t("profileCustomization.tabOneTitle")}
                    </h2>
                    <div className="flex flex-col space-y-4 w-full">
                      <div className="flex flex-col space-y-2.5">
                        <p className="text-sm dark:text-white/60 text-gray-700">
                          {t("profileCustomization.tabTwo.description")}
                        </p>

                        <ConfigProvider
                          theme={{
                            token: {
                              colorBgBase: colorProperties.backgroundColor
                                ? colorProperties.backgroundColor
                                : "#1677ff",
                              colorPrimary: "#535353",
                              colorTextPlaceholder: "#9ca3af",
                              colorBorder: colorProperties.borderInputColor
                                ? colorProperties.borderInputColor
                                : "#1677ff",
                            },
                          }}
                        >
                          <div className="flex flex-col space-y-1 font-normal">
                            <PrimaryInput
                              maxLength={20}
                              type="text"
                              placeholder={t(
                                "profileCustomization.tabTwo.displayname",
                              )}
                              ColorSettings={{
                                BorderColor: errorState.TabTwo.DisplayName[
                                  "Invalid"
                                ]
                                  ? "#EF4444"
                                  : colorProperties.borderInputColor
                                    ? colorProperties.borderInputColor
                                    : "#1677ff",
                              }}
                              prefix={
                                <span className="icon-[material-symbols--tag] w-4 h-4 mr-1"></span>
                              }
                              onChange={handleDisplayNameChange}
                              errorMessage={
                                errorState.TabTwo.DisplayName["Invalid"]
                                  ? errorState.TabTwo.DisplayName["msg"]
                                  : ""
                              }
                            />
                          </div>

                          <div className="flex flex-col space-y-1 font-normal">
                            <PrimaryInput
                              maxLength={200}
                              type="selection"
                              data={jobTitles["job-titles"]}
                              toggleInputComplete={toggleInputComplete}
                              placeholder={t(
                                "profileCustomization.tabTwo.jobtitle",
                              )}
                              ColorSettings={{
                                BorderColor: errorState.TabTwo.JobTitle[
                                  "Invalid"
                                ]
                                  ? "#EF4444"
                                  : colorProperties.borderInputColor
                                    ? colorProperties.borderInputColor
                                    : "#1677ff",
                              }}
                              prefix={
                                <span className="icon-[mingcute--suitcase-line] w-4 h-4 mr-1"></span>
                              }
                              onChange={handleJobTitleChange}
                              errorMessage={
                                errorState.TabTwo.JobTitle["Invalid"]
                                  ? errorState.TabTwo.JobTitle["msg"]
                                  : ""
                              }
                            />
                          </div>

                          <div className="flex flex-row items-center space-x-2 font-normal border dark:border-gray-500/20 hover:border-gray-500/36 transition-all duration-300 rounded-md p-1 px-2.5">
                            <span className="icon-[fa--intersex] w-4 h-4 mr-1"></span>

                            <div className="flex-1">
                              <Dropdown
                                setOption={setSelectedPronouns}
                                currentOption={selectedPronouns}
                                clearTrigger={clearDropdown}
                                primaryOption={t(
                                  "profileCustomization.tabTwo.pronouns",
                                )}
                                contentArray={dropdownPronounsValues}
                                size="sm"
                                openSide="up"
                                fullWidth={true}
                                buttonStyling={`${selectedPronouns !== "None" ? `!text-white` : `!text-gray-400`} ml-1 w-full justify-between items-center mr-4`}
                              />
                            </div>
                          </div>

                          <div className="w-full mt-1.5 flex flex-row justify-center items-center">
                            <button
                              disabled={
                                !displayName ||
                                isTransitioning ||
                                errorState.TabTwo.DisplayName["Invalid"] ||
                                errorState.TabTwo.JobTitle["Invalid"] ||
                                (!CareerComplete &&
                                  jobTitle &&
                                  jobTitle.trim() !== "" &&
                                  jobTitle.length > 0)
                              }
                              onClick={handleConfirm}
                              className={`${
                                !displayName ||
                                isTransitioning ||
                                (!CareerComplete &&
                                  jobTitle &&
                                  jobTitle.trim() !== "" &&
                                  jobTitle.length > 0) ||
                                errorState.TabTwo.DisplayName["Invalid"] ||
                                errorState.TabTwo.JobTitle["Invalid"]
                                  ? "bg-indigo-700/20 text-white/30 cursor-not-allowed!"
                                  : "bg-indigo-700 text-white"
                              } font-medium py-2 sm:px-10 px-5 rounded-lg shadow-sm hover:bg-opacity-85 transition duration-300 text-sm`}
                            >
                              <span>{t("general.Confirm")}</span>
                            </button>
                          </div>
                        </ConfigProvider>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!isLoading && currentTab === 3 && (
                  <motion.div
                    key="tab-3"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="lato font-medium dark:text-white/85 text-black"
                  >
                    <h2 className="lato font-semibold text-lg text-left">
                      {t("profileCustomization.tabThree.title")}
                    </h2>

                    <div className="flex flex-col space-y-4 w-full">
                      <p className="text-sm dark:text-white/60 text-gray-700">
                        {t("profileCustomization.tabThree.description")}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {interestOptions.map((interest) => {
                          const isSelected =
                            selectedInterests.includes(interest);

                          return (
                            <button
                              key={interest}
                              onClick={() => toggleInterest(interest)}
                              className={`
              px-3 py-2 rounded-lg text-sm transition-all duration-300
              border
              ${
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-500 scale-105"
                  : "bg-transparent hover:bg-white/10 border-gray-500/20"
              }
            `}
                            >
                              {interest}
                            </button>
                          );
                        })}
                      </div>

                      <p className="text-xs text-gray-400">
                        {selectedInterests.length}/8{" "}
                        {t("profileCustomization.tabThree.selectedWord")}
                      </p>

                      <div className="flex flex-row space-x-3">
                        <div className="w-full flex justify-center mt-2">
                          <button
                            onClick={handleSkip}
                            disabled={isTransitioning}
                            className={`
                              font-medium py-2 px-6 rounded-lg transition duration-300 text-sm
                              ${
                                isTransitioning
                                  ? "bg-white/5 text-white/20 cursor-not-allowed"
                                  : "bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/70 cursor-pointer"
                              }
                              border border-white/5 hover:border-white/10
                            `}
                          >
                            Skip for now
                          </button>
                        </div>

                        <div className="w-full flex justify-center mt-2">
                          <button
                            disabled={
                              selectedInterests.length === 0 || isTransitioning
                            }
                            onClick={handleConfirm}
                            className={`
                              font-medium py-2 px-6 rounded-lg shadow-sm transition duration-300 text-sm
                              ${
                                selectedInterests.length === 0 ||
                                isTransitioning
                                  ? "bg-indigo-700/20 text-white/30 cursor-not-allowed"
                                  : "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                              }
                            `}
                          >
                            {t("general.Confirm")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!isLoading && currentTab === 4 && (
                  <motion.div
                    key="tab-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center space-y-1.5 text-center p-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      }}
                      className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center"
                    >
                      <span className="icon-[mdi--check] w-8 h-8 text-indigo-400"></span>
                    </motion.div>

                    <h2 className="text-lg font-semibold">
                      {t("SignUp.accountCreationSuccessful.title")}
                    </h2>

                    <p className="text-sm text-gray-400">
                      {t("SignUp.accountCreationSuccessful.description")}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
