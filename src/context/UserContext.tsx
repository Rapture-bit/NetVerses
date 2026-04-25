import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  createContext,
} from "react";
import { useCSRFStore } from "@/context/CSRFStore";
import fetchCSRF from "@/utils/fetchPageWithCSRF";

interface User {
  id: string;
  display_name: string;
  username: string;
  profile_picture: string;
  badges: any[];
  banner: string;
  bio: string;
  color: string;
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
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const user = window.__USER__;
    if (!user) return;

    console.log(user.socialMediaConnections);

    setUserData({
      id: user.id,
      display_name: user.display_name,
      username: user.username,
      profile_picture: user.pfp,
      badges: user.badges ?? [],
      banner: user.banner ?? "",
      bio: user.description ?? "",
      color: user.preferences?.colorScheme ?? "#000000",
      isVerified: user.isVerified ?? false,
      newlyRegistered: user.newlyRegistered ?? false,
      pronouns: user.pronouns ?? "",
      showCustomizationMenu: false,
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

    console.log(userData);
  }, [window.__USER__]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
