import React, {
  useState,
  useEffect,
  useLayoutEffect,
  createContext,
} from "react";

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
  const [userCache, setUserCache] = useState<User | null>(null);
  const [cacheExpirationDate, setCacheExpirationDate] = useState<
    number | null
  >();

  const updateCache = async () => {
    const now = Date.now();
    if (userCache !== null && cacheExpirationDate && now < cacheExpirationDate)
      return;

    try {
      const fetchAPI = await fetch("https://api.netverses.com/v1/self", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!fetchAPI.ok) {
        setUserCache(null);
        return null;
      }

      const data = await fetchAPI.json();
      if (data.success && data.user) {
        console.log(data.user);
        setUserCache(data.user);
        return data.user;
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
