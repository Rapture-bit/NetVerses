import React, { useState, useEffect, useLayoutEffect } from "react";
import Dropdown from "@/components/input/Dropdown";
import Cookies from "js-cookie";

export default function LocaleMenu() {
  const [currentLocale, setCurrentLocale] = useState<string>("en-US");
  const [currentLang, setCurrentLang] = useState<string>("English");
  const [clearDropdown, setClearDropdown] = useState<boolean>(undefined);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [smallDevice, setSmallDevice] = useState<boolean>(
    window.innerWidth <= 620,
  );
  const [primaryOption, setPrimaryOption] = useState<string>("Open");
  const [secondPrimaryOption, setSecondPrimaryOption] =
    useState<string>("Choose Language");

  const maxLocales = 9;
  const availableLocales = [
    { content: "English", locale: "en-US" },
    { content: "ⵜⴰⵎⴰⵣⵉⵖⵜ", locale: "tzm-Latn-DZ" },
    { content: "中文", locale: "zh-CN" },
    { content: "الدّارجة", locale: "ary-MA" },
    { content: "العربية", locale: "ar" },
    { content: "Italiano", locale: "it-IT" },
    { content: "Deutsch", locale: "de-DE" },
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

  const forceDropdownContent = (isReset: boolean, content?: string) => {
    if (!isReset) {
      setPrimaryOption(content);
      setSecondPrimaryOption(content);
    } else {
      setPrimaryOption("Open");
      setSecondPrimaryOption("Choose Language");
    }
    setClearDropdown(false);
    setTimeout(() => {
      setClearDropdown(undefined);
    }, 2 * 1000);
  };

  const getLangFromLocale = (locale: string) =>
    availableLocales.find((item) => item.locale === locale)?.content ||
    "English";

  const getLocaleFromLang = (lang: string) =>
    availableLocales.find((item) => item.content === lang)?.locale || "en-US";

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSmallDevice(screenWidth <= 620);
  }, [screenWidth]);

  useEffect(() => {
    const cookieLocale = Cookies.get("locale") || "en-US";
    setCurrentLocale(cookieLocale);
    setCurrentLang(getLangFromLocale(cookieLocale));
  }, []);

  useEffect(() => {
    const lang = getLangFromLocale(currentLocale);
    if (currentLang !== lang) setCurrentLang(lang);
    Cookies.set("locale", currentLocale, { expires: 365, path: "/" });
  }, [currentLocale]);

  useEffect(() => {
    const locale = getLocaleFromLang(currentLang);
    if (locale && currentLocale !== locale) setCurrentLocale(locale);
  }, [currentLang]);

  useLayoutEffect(() => {
    const cookieLocale = Cookies.get("locale") || "en-US";
    const selectedDropdownOption = dropdownLocales.find(
      (item) => item.locale === cookieLocale,
    );
    if (selectedDropdownOption) {
      forceDropdownContent(false, selectedDropdownOption.content);
    }
  }, []);

  useEffect(() => {
    const selectedDropdownOption = dropdownLocales.find(
      (item) => item.locale === currentLocale,
    );
    if (primaryOption != "Open" && !selectedDropdownOption) {
      forceDropdownContent(true);
    }
  }, [currentLocale]);

  return (
    <>
      <div className="fixed bottom-0 w-full flex justify-start items-center mb-3 space-x-3">
        {!smallDevice && (
          <div className="flex flex-row space-x-3">
            {availableLocales.slice(0, maxLocales).map((loc, index) => (
              <button
                key={index}
                className={`localeBtn text-sm hover:underline ${
                  currentLocale === loc.locale
                    ? "font-bold underline"
                    : "font-normal"
                }`}
                onClick={() => setCurrentLocale(loc.locale)}
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
    </>
  );
}
