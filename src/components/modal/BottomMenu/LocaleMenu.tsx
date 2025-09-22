import React, { useState, useEffect, useLayoutEffect } from "react";
import Dropdown from "@/components/input/Dropdown";
import Cookies from "js-cookie";

import { useTranslation } from "react-i18next";

export default function LocaleMenu() {
  const defaultLocale = "en-US";
  const defaultMaxLocales = 9;

  const { t, i18n } = useTranslation();

  const [currentLocale, setCurrentLocale] = useState<string>(defaultLocale);
  const [currentLang, setCurrentLang] = useState<string>("English");
  const [clearDropdown, setClearDropdown] = useState<boolean>(undefined);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [smallDevice, setSmallDevice] = useState<boolean>(
    window.innerWidth <= 620,
  );
  const [primaryOption, setPrimaryOption] = useState<string>("Open");
  const [secondPrimaryOption, setSecondPrimaryOption] =
    useState<string>("Choose Language");
  const [maxLocales, setMaxLocales] = useState<number>(defaultMaxLocales);

  const availableLocales = [
    { content: "English", locale: "en-US" },
    { content: "ⵜⴰⵎⴰⵣⵉⵖⵜ", locale: "tzm-Latn-DZ" },
    { content: "中文", locale: "zh-CN" },
    { content: "الدّارجة", locale: "ary-MA" },
    { content: "العربية", locale: "ar" },
    { content: "Italiano", locale: "it-IT" },
    { content: "German", locale: "de-DE" },
    { content: "日本語", locale: "ja-JP" },
    { content: "Español", locale: "es-ES" },
    { content: "Français", locale: "fr-FR" },
    { content: "Português (PT)", locale: "pt-PT" },
    { content: "Português (BR)", locale: "pt-BR" },
    { content: "Русский", locale: "ru-RU" },
    { content: "한국어", locale: "ko-KR" },
    { content: "हिन्दी", locale: "hi-IN" },
    { content: "বাংলা", locale: "bn-BD" },
    { content: "Türkçe", locale: "tr-TR" },
    { content: "فارسی", locale: "fa-IR" },
    { content: "ภาษาไทย", locale: "th-TH" },
    { content: "Українська", locale: "uk-UA" },
    { content: "עברית", locale: "he-IL" },
    { content: "Svenska", locale: "sv-SE" },
    { content: "Nederlands", locale: "nl-NL" },
    { content: "Polski", locale: "pl-PL" },
    { content: "Ελληνικά", locale: "el-GR" },
    { content: "Tiếng Việt", locale: "vi-VN" },
    { content: "Malay", locale: "ms-MY" },
    { content: "Swahili", locale: "sw-KE" },
    { content: "Română", locale: "ro-RO" },
    { content: "Filipino", locale: "fil-PH" },
  ];

  const dropdownLocales = availableLocales.slice(maxLocales);

  const getLangFromLocale = (locale: string) =>
    availableLocales.find((item) => item.locale === locale)?.content ||
    "English";

  const getLocaleFromLang = (lang: string) =>
    availableLocales.find((item) => item.content === lang)?.locale ||
    defaultLocale;

  const forceDropdownContent = (isReset: boolean, content?: string) => {
    setPrimaryOption(isReset ? "Open" : content);
    setSecondPrimaryOption(isReset ? "Choose Language" : content);
    setClearDropdown(false);
    setTimeout(() => setClearDropdown(undefined), 500);
  };

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSmallDevice(screenWidth <= 620);
    setMaxLocales(screenWidth <= 620 ? 0 : defaultMaxLocales);
  }, [screenWidth]);

  useEffect(() => {
    const cookieLocale = Cookies.get("locale") || defaultLocale;
    setCurrentLocale(cookieLocale);
    setCurrentLang(getLangFromLocale(cookieLocale));
    i18n.changeLanguage(cookieLocale);
  }, []);

  useEffect(() => {
    const lang = getLangFromLocale(currentLocale);
    if (currentLang !== lang) setCurrentLang(lang);
    Cookies.set("locale", currentLocale, { expires: 365, path: "/" });
  }, [currentLocale]);

  useEffect(() => {
    const locale = getLocaleFromLang(currentLang);
    if (locale && currentLocale !== locale)
      setCurrentLocale(locale) && i18n.changeLanguage(locale);
  }, [currentLang]);

  useLayoutEffect(() => {
    const cookieLocale = Cookies.get("locale") || defaultLocale;
    const foundLocale = dropdownLocales.find(
      (item) => item.locale === cookieLocale,
    );
    forceDropdownContent(!foundLocale, foundLocale?.content);
  }, [dropdownLocales, screenWidth]);

  useEffect(() => {
    const selectedDropdownOption = dropdownLocales.find(
      (item) => item.locale === currentLocale,
    );
    if (primaryOption !== "Open" && !selectedDropdownOption) {
      forceDropdownContent(true);
    }
  }, [currentLocale]);

  useLayoutEffect(() => {
    const locale = getLocaleFromLang(currentLang);
    i18n.changeLanguage(locale);
  }, [currentLang, currentLocale]);

  return (
    <>
      <div className="fixed bottom-0 w-full flex justify-start items-center mb-3 space-x-3">
        {!smallDevice && (
          <div className="flex flex-row flex-wrap gap-2 transition-all duration-300 ease-in-out">
            {availableLocales.slice(0, maxLocales).map((loc) => (
              <button
                key={loc.locale}
                className={`localeBtn text-sm transition-colors duration-200 hover:underline ${
                  currentLocale === loc.locale
                    ? "font-bold underline"
                    : "font-normal"
                }`}
                onClick={() => (
                  setCurrentLocale(loc.locale),
                  i18n.changeLanguage(loc.locale),
                  console.log(loc.locale)
                )}
              >
                {loc.content}
              </button>
            ))}
          </div>
        )}

        {!smallDevice && dropdownLocales.length > 0 && (
          <Dropdown
            setOption={setCurrentLang}
            currentOption={currentLang}
            clearTrigger={clearDropdown}
            primaryOption={primaryOption}
            contentArray={dropdownLocales.map((loc) => loc.content)}
            size="sm"
            openSide="up"
          />
        )}
      </div>
      <div>
        {smallDevice && dropdownLocales.length > 0 && (
          <Dropdown
            primaryOption={secondPrimaryOption}
            currentOption={currentLang}
            contentArray={dropdownLocales.map((loc) => loc.content)}
            clearTrigger={clearDropdown}
            setOption={setCurrentLang}
            size="sm"
            openSide="up"
          />
        )}
      </div>
    </>
  );
}
