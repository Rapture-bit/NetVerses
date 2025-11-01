import React, { createContext, useState } from "react";

export const AnimateContext = createContext();

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
