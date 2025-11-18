import React, { createContext, useState } from "react";

interface refProps {
  play: Function;
}

interface UserContextType {
  animSrc: string;
  currentRef: refProps;
  loaded: boolean;
  setCurrentRef: (key: string) => void;
  setAnimSrc: (key: string) => void;
  setLoaded: (key: boolean) => void;
}

export const AnimateContext = createContext<UserContextType | null>(null);
export default function AnimateProvider({ children }) {
  const [animSrc, setAnimSrc] = useState(null);
  const [currentRef, setCurrentRef] = useState(null);
  const [loaded, setLoaded] = useState(false);

  return (
    <AnimateContext.Provider
      value={{
        animSrc,
        setAnimSrc,
        currentRef,
        setCurrentRef,
        loaded,
        setLoaded,
      }}
    >
      {children}
    </AnimateContext.Provider>
  );
}
