import React, {
  createContext,
  useLayoutEffect,
  useEffect,
  useState,
} from "react";

interface ColorPropertiesElement {
  textColor: string;
  backgroundColor: string;
  darkerBackgroundColor?: string;
  primaryColor: string;
  borderInputColor: string;
}

interface ThemeContextType {
  colorProperties: ColorPropertiesElement;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

const defaultColors = {
  textColor: "#000000",
  backgroundColor: "#ffffff",
  primaryColor: "#1890ff",
  borderInputColor: "#d9d9d9",
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [textColor, setTextColor] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState<string>("");
  const [borderInputColor, setBorderInputColor] = useState<string>("");
  const [darkerBackgroundColor, setDarkerBackgroundColor] =
    useState<string>("");
  const [colorProperties, setColorProperties] =
    useState<ColorPropertiesElement>(defaultColors);

  const getCssVariable = (variable: string) => {
    const root = document.documentElement;
    return getComputedStyle(root).getPropertyValue(variable).trim();
  };

  useLayoutEffect(() => {
    const updateColors = () => {
      setTextColor(getCssVariable("--text-color"));
      setBackgroundColor(getCssVariable("--background-color"));
      setDarkerBackgroundColor(getCssVariable("--darker-background-color"));
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
      darkerBackgroundColor: darkerBackgroundColor,
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
