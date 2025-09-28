import React, { useState, useLayoutEffect, createContext } from "react";

interface AuthContextType {
  isAuth: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuth, setAuth] = useState<boolean>(false);

  useLayoutEffect(() => {
    const checkAuth = async () => {
      try {
        const fetchAPI = await fetch("https://api.netverses.com/v1/self", {
          method: "POST",
          credentials: "include",
        });

        if (!fetchAPI.ok) {
          setAuth(false);
          return;
        }

        const fetchResponse = await fetchAPI.json();
        setAuth(fetchResponse.success && fetchResponse.user);
      } catch (error) {
        setAuth(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
