import React, { useState, useEffect, useRef, useContext } from "react";
import PrimaryModal from "@/ui/modal/Primary";
import { motion, AnimatePresence } from "framer-motion";
import { Button, ConfigProvider } from "antd";
import { ThemeContext } from "@/context/ThemeContext";
import { UserContext } from "@/context/UserContext";
import { Tooltip } from "antd";
import PrimaryInput from "@/ui/input/Primary";

import { useCSRFStore } from "@/context/CSRFStore";

import Dropdown from "@/ui/input/Dropdown";

interface ErrorState {
  TabTwo: {
    DisplayName: Object;
    Bio: Object;
    JobTitle: Object;
  };
}

export default function ProfileCustomization({ visible, setIsOpen }) {
  const { colorProperties } = useContext(ThemeContext);
  const { userData } = useContext(UserContext)!;

  const displayingText = "We're getting things ready for you!";
  const [displayedText, setDisplayedText] = useState("");
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
  const [clearDropdown, setClearDropdown] = useState<boolean | undefined>(
    undefined,
  );
  const [clearZodiacDropdown, setClearZodiacDropdown] = useState<
    boolean | undefined
  >(undefined);

  const { csrfToken, setCSRFToken } = useCSRFStore();

  const interestOptions = [
    "Astronomy",
    "Gaming",
    "Art",
    "Cooking",
    "Music",
    "Travel",
    "Sports",
    "Technology",
    "Fitness",
    "Movies",
    "Books",
    "Fashion",
    "Photography",
    "Writing",
    "Local news",
    "Programming",
    "Other",
  ];

  const dropdownPronouns = [
    "Prefer not to say",
    "He/Him",
    "She/Her",
    "They/Them",
  ];

  const zodiacSigns = [
    "Prefer not to say",
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
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
          let csrfTokenStore;
          const updateProfileFetch = await fetch(
            "https://api.netverses.com/v1/me/update-profile",
            {
              method: "POST",
              credentials: "include",
              body: JSON.stringify({
                display_name: displayName,
                career: jobTitle,
                pronouns: selectedPronouns !== "None" ? selectedPronouns : null,
                zodiac_sign: selectedZodiac !== "None" ? selectedZodiac : null,
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

  useEffect(() => {}, [currentTab]);
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

    if (
      trimmed.length <= 20 &&
      trimmed.length >= 3 &&
      /^[A-Za-z0-9 _.-]+$/.test(trimmed)
    ) {
      setDisplayName(value);
    }

    setErrorState((prev) => ({
      ...prev,
      TabTwo: {
        ...prev.TabTwo,
        DisplayName: {
          Invalid: trimmed.length < 3 || !/^[A-Za-z0-9 _.-]+$/.test(trimmed),
          msg:
            trimmed.length < 3
              ? "Display name must be at least 3 characters"
              : !/^[A-Za-z0-9 _.-]+$/.test(trimmed)
                ? "Display name contains invalid characters"
                : "",
        },
      },
    }));
  };

  useEffect(() => {
    console.log(selectedPronouns, selectedZodiac);
  }, [selectedPronouns, selectedZodiac]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
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
                  Saving...
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
                        Profile Customization
                      </h2>
                      <div className="flex flex-col space-y-4 w-full">
                        <div className="flex flex-col space-y-0.5">
                          <p className="text-base dark:text-white/70 text-gray-800">
                            Welcome,{" "}
                            <span className="font-medium hover:underline cursor-pointer">
                              {userData?.username}
                            </span>
                            !
                          </p>
                          <p className="text-sm dark:text-white/60 text-gray-700">
                            Please choose from the preset avatar options below,
                            or upload your own image.
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <button
                            onClick={() =>
                              setSelectedAvatar("/images/avatars/avatar1.png")
                            }
                            className="hover:scale-105 transition-all duration-300"
                          >
                            <img
                              className={`rounded-sm ${selectedAvatar === "/images/avatars/avatar1.png" ? "border-2 border-indigo-400" : ""}`}
                              src="/images/avatars/avatar1.png"
                              alt="Avatar 1"
                            />
                          </button>
                          <button
                            onClick={() =>
                              setSelectedAvatar("/images/avatars/avatar2.png")
                            }
                            className="hover:scale-105 transition-all duration-300"
                          >
                            <img
                              className={`rounded-sm ${selectedAvatar === "/images/avatars/avatar2.png" ? "border-2 border-indigo-400" : ""}`}
                              src="/images/avatars/avatar2.png"
                              alt="Avatar 2"
                            />
                          </button>
                          <button
                            onClick={() =>
                              setSelectedAvatar("/images/avatars/avatar3.png")
                            }
                            className="hover:scale-105 transition-all duration-300"
                          >
                            <img
                              className={`rounded-sm ${selectedAvatar === "/images/avatars/avatar3.png" ? "border-2 border-indigo-400" : ""}`}
                              src="/images/avatars/avatar3.png"
                              alt="Avatar 3"
                            />
                          </button>
                          <button
                            onClick={() =>
                              setSelectedAvatar("/images/avatars/avatar4.png")
                            }
                            className="hover:scale-105 transition-all duration-300"
                          >
                            <img
                              className={`rounded-sm ${selectedAvatar === "/images/avatars/avatar4.png" ? "border-2 border-indigo-400" : ""}`}
                              src="/images/avatars/avatar4.png"
                              alt="Avatar 4"
                            />
                          </button>
                          <button
                            onClick={() =>
                              setSelectedAvatar("/images/avatars/avatar5.png")
                            }
                            className="hover:scale-105 transition-all duration-300"
                          >
                            <img
                              className={`rounded-sm ${selectedAvatar === "/images/avatars/avatar5.png" ? "border-2 border-indigo-400" : ""}`}
                              src="/images/avatars/avatar5.png"
                              alt="Avatar 5"
                            />
                          </button>

                          <button onClick={handleClick}>
                            {!customImgSrc && (
                              <div className="flex flex-col items-center hover:bg-white/10 transition-all duration-300 justify-center border-2 border-dashed rounded-sm h-full w-full p-2">
                                {" "}
                                <span className="icon-[material-symbols--upload] w-6 h-6 dark:text-white/70 text-gray-700"></span>{" "}
                                <p className="text-xs dark:text-white/60 text-gray-600">
                                  {" "}
                                  Upload Custom Avatar{" "}
                                </p>{" "}
                              </div>
                            )}
                            {customImgSrc && (
                              <img
                                className="rounded-sm"
                                src={customImgSrc}
                                alt="Uploaded Image"
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
                            <span>Confirm</span>
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
                      Profile Customization
                    </h2>
                    <div className="flex flex-col space-y-4 w-full">
                      <div className="flex flex-col space-y-2.5">
                        <p className="text-sm dark:text-white/60 text-gray-700">
                          To finish the setup, please complete the following.
                          You can update these later in your profile settings.
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
                              placeholder={"Display Name"}
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
                              maxLength={20}
                              type="text"
                              placeholder={"Job Title (Optional)"}
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
                                primaryOption={"Select Pronouns (Optional)"}
                                contentArray={dropdownPronouns}
                                size="sm"
                                openSide="up"
                                fullWidth={true}
                                buttonStyling={`${selectedPronouns !== "None" ? `!text-white` : `!text-gray-400`} ml-1 w-full justify-between items-center mr-4`}
                              />
                            </div>
                          </div>

                          <div className="flex flex-row items-center space-x-2 font-normal border dark:border-gray-500/20 hover:border-gray-500/36 transition-all duration-300 rounded-md p-1 px-2.5">
                            <span className="icon-[streamline--zodiac-1] w-4 h-4 mr-1"></span>

                            <div className="flex-1">
                              <Dropdown
                                setOption={setSelectedZodiac}
                                currentOption={selectedZodiac}
                                clearTrigger={clearZodiacDropdown}
                                primaryOption={"Select Zodiac Sign (Optional)"}
                                contentArray={zodiacSigns}
                                size="sm"
                                openSide="up"
                                fullWidth={true}
                                buttonStyling={`${selectedZodiac !== "None" ? `!text-white` : `!text-gray-400`} ml-1 w-full justify-between items-center mr-4`}
                              />
                            </div>
                          </div>

                          <div className="w-full mt-1.5 flex flex-row justify-center items-center">
                            <button
                              disabled={
                                !displayName ||
                                isTransitioning ||
                                errorState.TabTwo.DisplayName["Invalid"] ||
                                errorState.TabTwo.JobTitle["Invalid"]
                              }
                              onClick={handleConfirm}
                              className={`${!displayName || isTransitioning ? "bg-indigo-700/20 text-white/30 cursor-not-allowed!" : "bg-indigo-700 text-white"} font-medium py-2 sm:px-10 px-5 rounded-lg shadow-sm hover:bg-opacity-85 transition duration-300 text-sm`}
                            >
                              <span>Confirm</span>
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
                      Choose Your Interests
                    </h2>

                    <div className="flex flex-col space-y-4 w-full">
                      <p className="text-sm dark:text-white/60 text-gray-700">
                        Select up to 8 interests to personalize your experience.
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
                        {selectedInterests.length}/8 selected
                      </p>

                      <div className="w-full flex justify-center mt-2">
                        <button
                          disabled={
                            selectedInterests.length === 0 || isTransitioning
                          }
                          onClick={handleConfirm}
                          className={`${
                            selectedInterests.length === 0 || isTransitioning
                              ? "bg-indigo-700/20 text-white/30 cursor-not-allowed"
                              : "bg-indigo-700 text-white"
                          } font-medium py-2 px-6 rounded-lg shadow-sm hover:bg-opacity-85 transition duration-300 text-sm`}
                        >
                          Confirm
                        </button>
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

                    <h2 className="text-lg font-semibold">You're all set 🎉</h2>

                    <p className="text-sm text-gray-400">
                      Your profile has been successfully created.
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
