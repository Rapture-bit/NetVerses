import React, {
  createContext,
  useLayoutEffect,
  useEffect,
  useState,
} from "react";

interface ColorPropertiesElement {
  TextColor: string;
  BackgroundColor: string;
  PrimaryColor: string;
  BorderInputColor: string;
}

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [textColor, setTextColor] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState<string>("");
  const [borderInputColor, setBorderInputColor] = useState<string>("");
  const [colorProperties, setColorProperties] =
    useState<ColorPropertiesElement>({
      TextColor: textColor,
      BackgroundColor: backgroundColor,
      PrimaryColor: primaryColor,
      BorderInputColor: borderInputColor,
    });

  const getCssVariable = (variable) => {
    const root = document.documentElement;
    return getComputedStyle(root).getPropertyValue(variable).trim();
  };

  useLayoutEffect(() => {
    const updateColors = () => {
      setTextColor(getCssVariable("--text-color"));
      setBackgroundColor(getCssVariable("--background-color"));
      setBorderInputColor(getCssVariable("--border-input-color"));
      setPrimaryColor(getCssVariable("--primary-color"));
    };

    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {}, []);

  return (
    <ThemeContext.Provider value={{ colorProperties }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
