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

interface ThemeContextType {
  colorProperties: ColorPropertiesElement;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

const defaultColors = {
  TextColor: "#000000",
  BackgroundColor: "#ffffff",
  PrimaryColor: "#1890ff",
  BorderInputColor: "#d9d9d9",
};

const ThemeProvider = ({ children }) => {
  const [textColor, setTextColor] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState<string>("");
  const [borderInputColor, setBorderInputColor] = useState<string>("");
  const [colorProperties, setColorProperties] =
    useState<ColorPropertiesElement>(defaultColors);

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

  useEffect(() => {
    setColorProperties({
      textColor: textColor,
      backgroundColor: backgroundColor,
      primaryColor: primaryColor,
      borderInputColor: borderInputColor,
    });
  }, [textColor, backgroundColor, primaryColor, borderInputColor]);

  return (
    <ThemeContext.Provider value={{ colorProperties }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
