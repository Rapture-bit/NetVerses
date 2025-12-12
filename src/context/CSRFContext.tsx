import { useState, useEffect, createContext } from "react";

interface CSRFContextType {
  csrfToken: string | null;
  setCSRFToken: (key: string | null) => void;
}

export const CSRFContext = createContext<CSRFContextType | undefined>(
  undefined,
);

export default function CSRFProvider({ children }) {
  const [csrfToken, setCSRFToken] = useState<string | null>(null);

  useEffect(() => {
    const csrfElement = document.getElementsByName("csrf")[0];
    if (csrfElement) {
      const csrfContent = csrfElement.getAttribute("content");
      setCSRFToken(csrfContent);
    }
  }, []);

  useEffect(() => {
    if (csrfToken !== null) {
      console.log("CSRF Token:", csrfToken);
    }
  }, [csrfToken]);

  return (
    <CSRFContext.Provider value={{ csrfToken, setCSRFToken }}>
      {children}
    </CSRFContext.Provider>
  );
}
