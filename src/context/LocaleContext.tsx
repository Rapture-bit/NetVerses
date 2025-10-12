import React, {
  useState,
  useEffect,
  useLayoutEffect,
  createContext,
} from "react";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

export const LocaleContext = createContext(undefined);

const LocaleProvider = ({ children }) => {
  const defaultLocale = "en-US";

  const [currentGlobalLocale, setGlobalLocale] = useState<string>();
  const { i18n } = useTranslation();

  const changeGlobalLocale = (locale) => {
    i18n.changeLanguage(locale);
    setGlobalLocale(locale);
  };

  const updateLocaleOnCookie = () => {
    const cookieLocale = Cookies.get("locale") || defaultLocale;
    setGlobalLocale(cookieLocale);
    i18n.changeLanguage(cookieLocale);
  };

  useLayoutEffect(() => {
    updateLocaleOnCookie();
  }, []);

  useEffect(() => {
    Cookies.set("locale", currentGlobalLocale, { expires: 365, path: "/" });
    i18n.changeLanguage(currentGlobalLocale);
  }, [currentGlobalLocale]);

  return (
    <LocaleContext.Provider value={{ currentGlobalLocale, changeGlobalLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export default LocaleProvider;
