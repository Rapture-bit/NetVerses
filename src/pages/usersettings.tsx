import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Tooltip, ConfigProvider } from "antd";
import PageTitle from "@/ui/others/PageTitle";
import {
  User,
  Shield,
  Palette,
  UserCog,
  Lock,
  Cake,
  Wallet,
  MapPin,
  Laptop,
  SlidersHorizontal,
  CreditCard,
  Bell,
  UserX,
  Users,
  Link,
  History,
  Settings,
} from "lucide-react";

import Dropdown from "@/ui/input/Dropdown";

import { ThemeContext } from "@/context/ThemeContext";
import { UserContext } from "@/context/UserContext";

import TextArea from "@/ui/input/TextArea";
import PrimaryInput from "@/ui/input/Primary";

interface FieldError {
  Invalid: boolean;
  msg: string;
}

interface ErrorState {
  ProfileTab: {
    DisplayName: FieldError;
    Username: FieldError;
    Bio: FieldError;

    ZodiacSign: FieldError;
    Pronouns: FieldError;
    ProfileVisibility: FieldError;
    Birthdate: FieldError;
    Location: FieldError;

    linkedinUser: FieldError;
    twitterUser: FieldError;
    instagramUser: FieldError;
    githubUser: FieldError;

    ProfileTheme: FieldError;
  };
  AccountTab: {
    Email: FieldError; // Required
    Phone: FieldError;
    deactivateAccount: FieldError;
    deleteAccount: FieldError;
  };
  SecurityTab: {
    Password: FieldError;
    twoFA: FieldError;
    Sessions: FieldError;
  };
}

export default function UserSettings() {
  const navigate = useNavigate();

  const { colorProperties } = useContext(ThemeContext);

  const [textAdded, setTextAdded] = useState<string>("");
  const [active, setActive] = useState("profile");
  const [search, setSearch] = useState("");
  const [hoveredTextArea, setHoveredTextArea] = useState<boolean>(false);

  const [hasChanges, setHasChanges] = useState(false);
  const [selectedZodiacSign, setSelectedZodiacSign] = useState<string>("");
  const [selectedProfileVisibility, setProfileVisibility] =
    useState<string>("");
  const [selectedProfileTheme, setProfileTheme] = useState<string>("");
  const [clearDropdown, setClearDropdown] = useState<boolean | undefined>(
    undefined,
  );
  const { userData } = useContext(UserContext)!;

  const [Username, setUsername] = useState<string>(userData?.username || "");
  const [DisplayName, setDisplayName] = useState<string>(
    userData?.display_name || "",
  );
  const [Status, setStatus] = useState<string>("");
  const [Pronouns, setPronouns] = useState<string>(userData?.pronouns || "");

  useEffect(() => {
    if (
      Username === userData?.username &&
      DisplayName === userData?.display_name &&
      Pronouns === userData?.pronouns
    ) {
      setHasChanges(false);
    } else {
      setHasChanges(true);
    }
  }, [Username, DisplayName, Pronouns]);

  const showEmojiMenu = () => {};

  const dropdownPronouns = [
    "Prefer not to say",
    "He/Him",
    "She/Her",
    "They/Them",
  ];

  const dropdownProfileVisibility = [
    "Public",
    "Friends Only",
    "Followers Only",
    "Friends & Followers",
    "Private",
  ];

  const profileVisibilityDescription = [
    {
      value: "Public",
      description: "Anyone can view your profile",
    },
    {
      value: "Friends Only",
      description: "Only your friends can view your profile",
    },
    {
      value: "Followers Only",
      description: "Only people who follow you can view your profile",
    },
    {
      value: "Friends & Followers",
      description: "Friends and followers can view your profile",
    },
    {
      value: "Private",
      description: "Only you can view your profile",
    },
  ];

  const dropdownProfileThemes = [
    "Gray",
    "Red",
    "Orange",
    "Yellow",
    "Green",
    "Cyan",
    "Blue",
    "Indigo",
    "Violet",
    "Purple",
    "Pink",
    "Rose",
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

  const [errorState, setErrorState] = useState<ErrorState>({
    ProfileTab: {
      DisplayName: { Invalid: false, msg: "" },
      Username: { Invalid: false, msg: "" },
      Bio: { Invalid: false, msg: "" },

      ZodiacSign: { Invalid: false, msg: "" },
      Pronouns: { Invalid: false, msg: "" },
      ProfileVisibility: { Invalid: false, msg: "" },
      Birthdate: { Invalid: false, msg: "" },
      Location: { Invalid: false, msg: "" },

      linkedinUser: { Invalid: false, msg: "" },
      twitterUser: { Invalid: false, msg: "" },
      instagramUser: { Invalid: false, msg: "" },
      githubUser: { Invalid: false, msg: "" },

      ProfileTheme: { Invalid: false, msg: "" },
    },
    AccountTab: {
      Email: { Invalid: false, msg: "" },
      Phone: { Invalid: false, msg: "" },
      deactivateAccount: { Invalid: false, msg: "" },
      deleteAccount: { Invalid: false, msg: "" },
    },
    SecurityTab: {
      Password: { Invalid: false, msg: "" },
      twoFA: { Invalid: false, msg: "" },
      Sessions: { Invalid: false, msg: "" },
    },
  });

  const items = [
    { type: "section", label: "User" },
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: UserCog },

    { type: "section", label: "Security & Privacy" },
    { id: "security", label: "Security", icon: Shield },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "devices", label: "Devices", icon: Laptop },

    { type: "section", label: "Billing" },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "subscriptions", label: "Subscriptions", icon: Wallet },

    { type: "section", label: "Activity" },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "activity", label: "Activity Log", icon: SlidersHorizontal },

    { type: "section", label: "Social" },
    { id: "social", label: "Connections", icon: User },
    { id: "friends", label: "Friends & Followers", icon: UserCog },
    { id: "blocking", label: "Blocking", icon: UserX },

    { type: "section", label: "Preferences" },
    { id: "content", label: "Content", icon: SlidersHorizontal },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()),
  );

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

  function bioInputChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const input = e.target.value.trim();
  }

  return (
    <>
      <PageTitle
        title={`NetVerses ~ ${active === "profile" ? "Profile Customization" : active === "account" ? "Account Settings" : active === "security" ? "Security Settings" : "User Settings"}`}
      />
      <div
        className={`flex flex-col gap-3 justify-center items-center w-full h-full pt-24 bg-fixed bg-cover bg-center`}
      >
        <div className="relative flex border borderColor flex-col p-4 sm:pl-5 sm:py-4 rounded-md mx-4 sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor">
          <div className="flex flex-row justify-between items-center">
            <Tooltip mouseLeaveDelay={0} title={"Back"} placement={"bottom"}>
              <button
                aria-label="Go Back"
                onClick={toggleBack}
                className="w-5 h-5"
              >
                <span className="icon-[eva--arrow-back-outline] w-5 h-5"></span>
              </button>
            </Tooltip>
            <span className="font-medium text-lg jost">User Settings</span>
          </div>
        </div>
        <div
          className="darkerBackgroundColor 
  h-[70vh] min-h-[500px] max-h-[800px]
  justify-between relative flex border borderColor flex-row rounded-md 
  w-full sm:w-3/4 lg:w-3/4 xl:w-1/2"
        >
          <div className="flex flex-col overflow-y-auto w-1/3 border-r borderColor p-2 space-y-1">
            <div className="px-2 pt-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md dark:bg-blue-500/3 border borderColor">
                <span className="icon-[si--search-line] w-4 h-4 flex-shrink-0 transition-colors duration-300" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search settings..."
                  className="bg-transparent w-full text-sm text-gray-200 outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="h-2" />

            {filteredItems.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">
                No settings found
              </div>
            )}

            {filteredItems.map((item) => {
              if (item.type === "section") {
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 px-4 pt-4 pb-2"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                      {item.label}
                    </span>

                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                );
              }

              const isActive = active === item.id;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`flex items-center w-full px-4 py-3 cursor-pointer rounded-md transition-colors duration-150
        ${
          isActive
            ? "bg-white/10 text-white"
            : "text-gray-300 hover:text-white hover:bg-white/5"
        }
      `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col space-y-3 ml-2 items-start w-full px-4 py-4 overflow-y-auto">
            {active === "profile" && (
              <>
                <div className="justify-between flex flex-row w-full">
                  <span className="text-lg font-semibold hover:underline">
                    Profile Customization
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => console.log("Preview")}
                      className="px-4 py-2 text-sm font-medium rounded-lg
               border border-white/10 text-white/80
               bg-blue-500/3 backdrop-blur-sm
               transition-all duration-200
               hover:bg-blue-500/10 hover:text-white
               active:scale-95"
                    >
                      Preview
                    </button>

                    <button
                      disabled={!hasChanges}
                      onClick={() => console.log("Save")}
                      className="px-4 py-2 select-none text-sm font-semibold rounded-lg
               text-white bg-purple-600
               shadow-md shadow-purple-600/20
               transition-all duration-200
               hover:bg-purple-700 hover:shadow-purple-600/30
               active:scale-95
               disabled:opacity-40
               disabled:cursor-not-allowed
               disabled:shadow-none
               disabled:hover:bg-purple-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
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
                  <div className="flex flex-col w-1/2 space-y-2 font-normal">
                    <span className="text-sm font-medium jost select-none">
                      Profile Picture (PFP)
                    </span>

                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden cursor-pointer relative group">
                      <div className="w-full h-full rounded-full border sm:border-2 border-purple-900 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/50 group-hover:scale-105">
                        <svg
                          viewBox="0 0 100 100"
                          className="w-10 h-10 sm:w-14 sm:h-14"
                        >
                          <circle
                            cx="50"
                            cy="35"
                            r="15"
                            fill="white"
                            opacity="0.9"
                          />
                          <path
                            d="M 30 70 Q 50 55 70 70 L 70 85 Q 50 70 30 85 Z"
                            fill="white"
                            opacity="0.9"
                          />
                        </svg>
                      </div>

                      <button
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() => console.log("Edit PFP clicked")}
                      >
                        <div className="bg-white/90 text-black p-1.5 rounded-full shadow-md">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2L7 19H3v-4l10-10z"
                            />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col w-1/2 space-y-1 font-normal">
                    <span className="text-sm font-medium jost select-none">
                      Username <span className="text-red-500">*</span>
                    </span>
                    <PrimaryInput
                      maxLength={20}
                      type="text"
                      value={Username}
                      placeholder={"Username"}
                      ColorSettings={{
                        BorderColor: errorState.ProfileTab.Username["Invalid"]
                          ? "#EF4444"
                          : colorProperties.borderInputColor
                            ? colorProperties.borderInputColor
                            : "#1677ff",
                      }}
                      prefix={
                        <span className="icon-[ri--user-line] w-4 h-4 mr-1"></span>
                      }
                      onChange={(e) => setUsername(e.target.value)}
                      errorMessage={
                        errorState.ProfileTab.Username["Invalid"]
                          ? errorState.ProfileTab.Username["msg"]
                          : ""
                      }
                    />
                    <span className="text-xs italic text-neutral-400/80 leading-relaxed tracking-[0.001em]">
                      You can only change your username once every 7 days
                    </span>
                  </div>

                  <div className="flex flex-col w-1/2 space-y-1 font-normal">
                    <span className="text-sm font-medium jost select-none">
                      Display Name <span className="text-red-500">*</span>
                    </span>
                    <PrimaryInput
                      maxLength={20}
                      type="text"
                      value={DisplayName}
                      placeholder={"Display Name"}
                      ColorSettings={{
                        BorderColor: errorState.ProfileTab.DisplayName[
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
                      onChange={(e) => setDisplayName(e.target.value)}
                      errorMessage={
                        errorState.ProfileTab.DisplayName["Invalid"]
                          ? errorState.ProfileTab.DisplayName["msg"]
                          : ""
                      }
                    />
                  </div>

                  <div className="flex flex-col w-1/2 space-y-1 font-normal">
                    <span className="text-sm font-medium jost select-none">
                      Status
                    </span>
                    <PrimaryInput
                      maxLength={20}
                      type="text"
                      placeholder={"Status"}
                      ColorSettings={{
                        BorderColor: errorState.ProfileTab.DisplayName[
                          "Invalid"
                        ]
                          ? "#EF4444"
                          : colorProperties.borderInputColor
                            ? colorProperties.borderInputColor
                            : "#1677ff",
                      }}
                      prefix={
                        <button
                          onClick={showEmojiMenu}
                          className="w-3 h-3 mb-1.5 mr-2"
                        >
                          <span className="icon-[gridicons--status]"></span>
                        </button>
                      }
                      onChange={(e) => console.log(e)}
                      errorMessage={
                        errorState.ProfileTab.DisplayName["Invalid"]
                          ? errorState.ProfileTab.DisplayName["msg"]
                          : ""
                      }
                    />
                  </div>

                  <div className="flex flex-col w-1/2 space-y-1 font-normal">
                    <span className="text-sm font-medium jost select-none">
                      Pronouns
                    </span>
                    <div className="flex flex-row items-center space-x-2 font-normal border dark:border-gray-500/20 hover:border-gray-500/36 transition-all duration-300 rounded-md p-1 px-2.5">
                      <span className="icon-[fa--intersex] w-4 h-4 mr-1"></span>

                      <div className="flex-1">
                        <Dropdown
                          setOption={setPronouns}
                          currentOption={Pronouns}
                          clearTrigger={clearDropdown}
                          primaryOption={Pronouns || "Select Pronouns"}
                          contentArray={dropdownPronouns}
                          size="sm"
                          openSide="up"
                          fullWidth={true}
                          buttonStyling={`${Pronouns !== "None" ? `!text-white/70` : `!text-gray-400`} ml-1 w-full justify-between items-center mr-4`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col w-1/2 space-y-1 font-normal">
                    <span className="text-sm font-medium jost select-none">
                      Bio
                    </span>
                    <div
                      className={`flex flex-row items-start justify-center border borderColor ${hoveredTextArea ? "border-white/40" : "borderColor"} rounded-md`}
                    >
                      <span className="icon-[ant-design--profile-outlined] mt-2 ml-2 w-4.5 h-4.5 mr-1"></span>
                      <TextArea
                        minHeight={43}
                        addText={textAdded}
                        onChange={bioInputChanged}
                        placeholder={"Bio"}
                        className={`!bg-transparent pl-0 ml-1.5 mt-1.5 overflow-hidden resize-none select-none border-none !text-white/80 outline-none text-sm focus:border-none dark:text-white opacity-95 w-full placeholder:text-[#9ca3af]`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-1/2 space-y-1 font-normal">
                    <span className="text-sm font-medium jost select-none">
                      Birthdate
                    </span>
                    <PrimaryInput
                      maxLength={20}
                      type="text"
                      placeholder={"DD/MM/YYYY"}
                      ColorSettings={{
                        BorderColor: errorState.ProfileTab.DisplayName[
                          "Invalid"
                        ]
                          ? "#EF4444"
                          : colorProperties.borderInputColor
                            ? colorProperties.borderInputColor
                            : "#1677ff",
                      }}
                      prefix={<Cake className="w-4 h-4 mr-1" />}
                      onChange={(e) => console.log(e)}
                      errorMessage={
                        errorState.ProfileTab.DisplayName["Invalid"]
                          ? errorState.ProfileTab.DisplayName["msg"]
                          : ""
                      }
                    />
                  </div>

                  <div className="flex flex-col w-1/2 space-y-1 font-normal">
                    <span className="text-sm font-medium jost select-none">
                      Location
                    </span>
                    <PrimaryInput
                      maxLength={20}
                      type="text"
                      placeholder={"City, Country, Place, Planet"}
                      ColorSettings={{
                        BorderColor: errorState.ProfileTab.DisplayName[
                          "Invalid"
                        ]
                          ? "#EF4444"
                          : colorProperties.borderInputColor
                            ? colorProperties.borderInputColor
                            : "#1677ff",
                      }}
                      prefix={<MapPin className="w-4 h-4 mr-1" />}
                      onChange={(e) => console.log(e)}
                      errorMessage={
                        errorState.ProfileTab.DisplayName["Invalid"]
                          ? errorState.ProfileTab.DisplayName["msg"]
                          : ""
                      }
                    />
                  </div>

                  <div className="flex flex-col w-1/2 space-y-1 font-normal">
                    <span className="text-sm font-medium jost select-none">
                      Zodiac Sign
                    </span>
                    <div className="flex flex-row items-center space-x-2 font-normal border dark:border-gray-500/20 hover:border-gray-500/36 transition-all duration-300 rounded-md p-1 px-2.5">
                      <span className="icon-[streamline--zodiac-1] w-4 h-4 mr-1"></span>

                      <div className="flex-1">
                        <Dropdown
                          setOption={setSelectedZodiacSign}
                          currentOption={selectedZodiacSign}
                          clearTrigger={clearDropdown}
                          primaryOption={"Select Zodiac Sign"}
                          contentArray={zodiacSigns}
                          size="sm"
                          openSide="up"
                          fullWidth={true}
                          buttonStyling={`${selectedZodiacSign !== "None" ? `!text-white/70` : `!text-gray-400`} ml-1 w-full justify-between items-center mr-4`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col w-1/2 space-y-1 font-normal">
                    <span className="text-sm font-medium jost select-none">
                      Profile Visibility
                    </span>
                    <div className="flex flex-row items-center space-x-2 font-normal border dark:border-gray-500/20 hover:border-gray-500/36 transition-all duration-300 rounded-md p-1 px-2.5">
                      <span className="icon-[material-symbols--visibility] w-4 h-4 mr-1"></span>

                      <div className="flex-1">
                        <Dropdown
                          setOption={setProfileVisibility}
                          currentOption={selectedProfileVisibility}
                          clearTrigger={clearDropdown}
                          primaryOption={"Select Visibility"}
                          contentArray={dropdownProfileVisibility}
                          size="sm"
                          openSide="up"
                          fullWidth={true}
                          buttonStyling={`${selectedProfileVisibility !== "None" ? `!text-white/70` : `!text-gray-400`} ml-1 w-full justify-between items-center mr-4`}
                        />
                      </div>
                    </div>
                    <span className="text-xs italic text-neutral-400/80 leading-relaxed tracking-[0.001em]">
                      {
                        profileVisibilityDescription.find(
                          (element) =>
                            element.value === selectedProfileVisibility,
                        )?.description
                      }
                    </span>
                  </div>

                  <div className="flex flex-col w-1/2 space-y-1 font-normal">
                    <span className="text-sm font-medium jost select-none">
                      Profile Color
                    </span>
                    <div className="flex flex-row items-center space-x-2 font-normal border dark:border-gray-500/20 hover:border-gray-500/36 transition-all duration-300 rounded-md p-1 px-2.5">
                      <span className="icon-[ic--outline-color-lens] w-4 h-4 mr-1"></span>

                      <div className="flex-1">
                        <Dropdown
                          setOption={setProfileTheme}
                          currentOption={selectedProfileTheme}
                          clearTrigger={clearDropdown}
                          primaryOption={"Select Theme"}
                          contentArray={dropdownProfileThemes}
                          size="sm"
                          openSide="up"
                          fullWidth={true}
                          buttonStyling={`${selectedProfileTheme !== "None" ? `!text-white/70` : `!text-gray-400`} ml-1 w-full justify-between items-center mr-4`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1 font-normal">
                    <span className="text-sm font-medium jost select-none">
                      Social Connections
                    </span>
                    <div className="flex flex-row space-x-3">
                      <div className="flex flex-col space-y-3 font-normal">
                        <PrimaryInput
                          maxLength={20}
                          type="text"
                          placeholder={"username"}
                          ColorSettings={{
                            BorderColor: errorState.ProfileTab.Username[
                              "Invalid"
                            ]
                              ? "#EF4444"
                              : colorProperties.borderInputColor
                                ? colorProperties.borderInputColor
                                : "#1677ff",
                          }}
                          prefix={
                            <span className="select-none">instagram.com/</span>
                          }
                          onChange={(e) => console.log(e)}
                          errorMessage={
                            errorState.ProfileTab.Username["Invalid"]
                              ? errorState.ProfileTab.Username["msg"]
                              : ""
                          }
                        />

                        <PrimaryInput
                          maxLength={20}
                          type="text"
                          placeholder={"username"}
                          ColorSettings={{
                            BorderColor: errorState.ProfileTab.Username[
                              "Invalid"
                            ]
                              ? "#EF4444"
                              : colorProperties.borderInputColor
                                ? colorProperties.borderInputColor
                                : "#1677ff",
                          }}
                          prefix={
                            <span className="select-none">github.com/</span>
                          }
                          onChange={(e) => console.log(e)}
                          errorMessage={
                            errorState.ProfileTab.Username["Invalid"]
                              ? errorState.ProfileTab.Username["msg"]
                              : ""
                          }
                        />
                      </div>
                      <div className="flex flex-col space-y-3 font-normal">
                        <PrimaryInput
                          maxLength={20}
                          type="text"
                          placeholder={"username"}
                          ColorSettings={{
                            BorderColor: errorState.ProfileTab.Username[
                              "Invalid"
                            ]
                              ? "#EF4444"
                              : colorProperties.borderInputColor
                                ? colorProperties.borderInputColor
                                : "#1677ff",
                          }}
                          prefix={<span className="select-none">x.com/</span>}
                          onChange={(e) => console.log(e)}
                          errorMessage={
                            errorState.ProfileTab.Username["Invalid"]
                              ? errorState.ProfileTab.Username["msg"]
                              : ""
                          }
                        />

                        <PrimaryInput
                          maxLength={20}
                          type="text"
                          placeholder={"username"}
                          ColorSettings={{
                            BorderColor: errorState.ProfileTab.Username[
                              "Invalid"
                            ]
                              ? "#EF4444"
                              : colorProperties.borderInputColor
                                ? colorProperties.borderInputColor
                                : "#1677ff",
                          }}
                          prefix={
                            <span className="select-none">
                              linkedin.com/in/
                            </span>
                          }
                          onChange={(e) => console.log(e)}
                          errorMessage={
                            errorState.ProfileTab.Username["Invalid"]
                              ? errorState.ProfileTab.Username["msg"]
                              : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                </ConfigProvider>
              </>
            )}

            {active === "account" && (
              <>
                <div className="justify-between flex flex-row w-full">
                  <span className="text-lg font-semibold hover:underline">
                    Account Settings
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={!hasChanges}
                      onClick={() => console.log("Save")}
                      className="px-4 select-none py-2 text-sm font-semibold rounded-lg
               text-white bg-purple-600
               shadow-md shadow-purple-600/20
               transition-all duration-200
               hover:bg-purple-700 hover:shadow-purple-600/30
               active:scale-95
               disabled:opacity-40
               disabled:cursor-not-allowed
               disabled:shadow-none
               disabled:hover:bg-purple-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
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
                  <div className="flex flex-col w-full space-y-2 font-normal">
                    <div className="flex flex-col w-1/2 space-y-1 font-normal">
                      <span className="text-sm font-medium jost select-none">
                        Email <span className="text-red-500">*</span>
                      </span>

                      <PrimaryInput
                        maxLength={20}
                        type="text"
                        placeholder={"Email"}
                        ColorSettings={{
                          BorderColor: errorState.AccountTab.Email["Invalid"]
                            ? "#EF4444"
                            : colorProperties.borderInputColor
                              ? colorProperties.borderInputColor
                              : "#1677ff",
                        }}
                        prefix={
                          <span className="icon-[mdi--at] w-4 h-4 mr-1"></span>
                        }
                        onChange={(e) => console.log(e)}
                        errorMessage={
                          errorState.AccountTab.Email["Invalid"]
                            ? errorState.AccountTab.Email["msg"]
                            : ""
                        }
                      />
                      <span className="text-xs italic text-neutral-400/80 leading-relaxed tracking-[0.001em]">
                        Used for verification and account recovery
                      </span>
                    </div>

                    <div className="flex flex-col w-1/2 space-y-1 font-normal">
                      <span className="text-sm font-medium jost select-none">
                        Phone
                      </span>
                      <PrimaryInput
                        maxLength={20}
                        type="text"
                        placeholder={"Phone"}
                        ColorSettings={{
                          BorderColor: errorState.AccountTab.Phone["Invalid"]
                            ? "#EF4444"
                            : colorProperties.borderInputColor
                              ? colorProperties.borderInputColor
                              : "#1677ff",
                        }}
                        prefix={
                          <span className="icon-[fa--mobile] w-4 h-4 mr-1"></span>
                        }
                        onChange={(e) => console.log(e)}
                        errorMessage={
                          errorState.AccountTab.Phone["Invalid"]
                            ? errorState.AccountTab.Phone["msg"]
                            : ""
                        }
                      />
                      <span className="text-xs italic text-neutral-400/80 leading-relaxed tracking-[0.001em]">
                        Used for account verification and security (Optional)
                      </span>
                    </div>

                    <div className="flex flex-row space-x-5 mt-2">
                      <div className="flex flex-col">
                        <button
                          onClick={() => console.log("Save")}
                          className="w-full select-none py-1.5 text-sm font-semibold rounded-lg
               text-white bg-red-800
               shadow-md shadow-red-600/20
               transition-all duration-200
               hover:bg-red-900 hover:shadow-red-600/30
               active:scale-95
               disabled:opacity-40
               disabled:cursor-not-allowed
               disabled:shadow-none
               disabled:hover:bg-red-600"
                        >
                          Delete Account
                        </button>
                        <span className="text-xs italic text-neutral-400/80 leading-relaxed tracking-[0.001em]">
                          Permanently delete your account and all data.{" "}
                          <strong className="text-red-500 hover:underline">
                            This action cannot be undone
                          </strong>
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <button
                          onClick={() => console.log("Save")}
                          className="w-full select-none py-1.5 text-sm font-semibold rounded-lg
               text-white bg-neutral-600
               shadow-md shadow-neutral-600/20
               transition-all duration-200
               hover:bg-neutral-700 hover:shadow-neutral-600/30
               active:scale-95
               disabled:opacity-40
               disabled:cursor-not-allowed
               disabled:shadow-none
               disabled:hover:bg-neutral-600"
                        >
                          Deactivate Account
                        </button>
                        <span className="text-xs italic text-neutral-400/80 leading-relaxed tracking-[0.001em]">
                          Deactivate your account to temporarily disable access.
                          You can reactivate it anytime by signing back in
                        </span>
                      </div>
                    </div>
                  </div>
                </ConfigProvider>
              </>
            )}

            {active === "security" && (
              <>
                <span className="text-lg font-semibold">Security</span>
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
                  <div className="flex flex-col w-1/2 space-y-1 font-normal">
                    <span className="text-sm font-medium jost select-none">
                      Password <span className="text-red-500">*</span>
                    </span>
                    <div className="flex flex-row gap-3">
                      <PrimaryInput
                        maxLength={0}
                        disabled
                        value={"****************"}
                        type="text"
                        placeholder={"Password"}
                        ColorSettings={{
                          BorderColor: errorState.SecurityTab.Password[
                            "Invalid"
                          ]
                            ? "#EF4444"
                            : colorProperties.borderInputColor
                              ? colorProperties.borderInputColor
                              : "#1677ff",
                        }}
                        prefix={
                          <span className="icon-[material-symbols--password] w-4 h-4 mr-1"></span>
                        }
                        onChange={(e) => console.log(e)}
                        errorMessage={
                          errorState.SecurityTab.Password["Invalid"]
                            ? errorState.SecurityTab.Password["msg"]
                            : ""
                        }
                      />
                      <button
                        onClick={() => console.log("Save")}
                        className="px-4 py-2 select-none text-sm font-semibold rounded-lg
               text-white bg-purple-600
               shadow-md shadow-purple-600/20
               transition-all duration-200
               hover:bg-purple-700 hover:shadow-purple-600/30
               active:scale-95
               disabled:opacity-40
               disabled:cursor-not-allowed
               disabled:shadow-none
               disabled:hover:bg-purple-600"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </ConfigProvider>

                <span>2FA</span>
                <span>Sessions</span>
              </>
            )}

            {active === "appearance" && (
              <>
                <span className="text-lg font-semibold">Appearance</span>
                <span>Theme</span>
                <span>Colors</span>
                <span>Layout density</span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
