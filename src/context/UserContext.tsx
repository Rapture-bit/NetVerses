import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  createContext,
} from "react";
import { CSRFContext } from "@/context/CSRFContext";
import fetchCSRFPost from "@/utils/fetchPostPage";

interface User {
  id: string;
  display_name: string;
  username: string;
  profile_picture: string;
  banner: string;
  bio: string;
  colorPreference: string;
  isVerified: boolean;
  career: string;
  followers: number;
  following: number;
  createdAt: string;
  updatedAt: string;
}

interface UserContextType {
  userCache: Record<string, any>;
  updateCache: () => Promise<Object[]>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

const UserProvider = ({ children }) => {
  const { setCSRFToken } = useContext(CSRFContext);
  const [userCache, setUserCache] = useState<User | null>(null);
  const [cacheExpirationDate, setCacheExpirationDate] = useState<
    number | null
  >();

  const updateCache = async () => {
    let csrfToken = null;

    const csrfElement = document.getElementsByName("csrf")[0];
    if (csrfElement) {
      const csrfContent = csrfElement.getAttribute("content");
      setCSRFToken(csrfContent);
      csrfToken = csrfContent;

      console.log(csrfToken, csrfContent);
    }

    const now = Date.now();
    if (userCache !== null && cacheExpirationDate && now < cacheExpirationDate)
      return;

    try {
      const selfData = await fetchCSRFPost(
        "https://api.netverses.com/v1/self",
        csrfToken,
      );

      if (!selfData) {
        return null;
      }

      if (!selfData.success) {
        setUserCache(null);
        return null;
      }

      if (selfData.success && selfData.user) {
        console.log(selfData.user);
        setUserCache(selfData.user);
        return selfData.user;
      } else {
        setUserCache(null);
        return null;
      }
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  };

  return (
    <UserContext.Provider value={{ userCache, updateCache }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
