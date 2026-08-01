import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  createContext,
} from "react";
import { useCSRFStore } from "@/context/CSRFStore";
import fetchCSRF from "@/utils/fetchPageWithCSRFToken";

interface User {
  id: string;
  display_name: string;
  username: string;
  profile_picture: string;
  badges: any[];
  banner: string;
  bio: string;
  color: string;
  email: string;
  phone: string;
  zodiac_sign: string;
  isVerified: boolean;
  socialMediaConnections: Record<string, string>;
  showCustomizationMenu: boolean;
  pronouns: string;
  career: string;
  newlyRegistered: any;
  followers: number;
  following: number;
  posts: number;
  createdAt: string;
  updatedAt: string;
}

interface UserContextType {
  userData: User | null;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
  settingsData: any;
  setSettingsData: React.Dispatch<React.SetStateAction<any>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [settingsData, setSettingsData] = useState<any>(null);

  useEffect(() => {
    const settings = window.__SETTINGS__;
    if (!settings) return;

    setSettingsData({
      theme: settings.theme ?? "dark",
      notifications: settings.notifications ?? {
        email: false,
        push: false,
        sms: false,
      },
      profileVisibility: settings.profileVisibility ?? "public",
      showbirthdate: settings.showbirthdate ?? false,
      showlocation: settings.showlocation ?? false,
      twoFactorOption: settings.twoFactorOption ?? "disabled",
    });
  }, [window.__SETTINGS__]);

  useEffect(() => {
    const user = window.__USER__;
    if (!user) return;

    setUserData({
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      username: user.username,
      profile_picture: user.pfp,
      badges: user.badges ?? [],
      banner: user.banner ?? "",
      bio: user.bio ?? "",
      phone: user.phone ?? "",
      color: user.preferences?.colorScheme ?? "purple",
      isVerified: user.isVerified ?? false,
      newlyRegistered: user.newlyRegistered ?? false,
      pronouns: user.pronouns ?? "",
      showCustomizationMenu: false,
      zodiac_sign: user.zodiac_sign ?? "",
      career: user.career ?? "",
      socialMediaConnections: user.socialMediaConnections ?? {
        twitter: "",
        linkedin: "",
        instagram: "",
        github: "",
      },
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      posts: user.posts ?? 0,
      createdAt: user.createdAt ?? "",
      updatedAt: user.updatedAt ?? "",
    });
  }, [window.__USER__]);

  return (
    <UserContext.Provider
      value={{ userData, settingsData, setSettingsData, setUserData }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
