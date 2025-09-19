import React, { useState, useEffect, useLayoutEffect } from "react";
import Dropdown from "@/components/input/Dropdown";

export default function LocaleMenu() {
  const [currentLocale, setCurrentLocale] = useState<string>("en-US"); // determined by region or cookies
  const [currentLang, setCurrentLang] = useState<string>("English"); // determined by region or cookies
  const [availableLocales] = useState<any[]>([
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
  ]);

  const [dropdownLocales, setDropdownLocales] = useState<any[]>([]);
  const [maxLocales, setMaxLocales] = useState<number>(9); // Always maximum 9
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [smallDevice, setSmallDevice] = useState<boolean>(false);
  const [clearDropdown, setClearDropdown] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    setSmallDevice(screenWidth <= 620);
  }, [screenWidth]);

  useEffect(() => {
    setDropdownLocales(availableLocales.slice(maxLocales));
  }, [availableLocales, maxLocales]);

  useEffect(() => {
    const match = availableLocales.find(
      (item) => item.locale === currentLocale,
    );
    if (match) setCurrentLang(match.content);
  }, [currentLocale, availableLocales]);

  useEffect(() => {
    const match = availableLocales.find((item) => item.content === currentLang);
    if (match) setCurrentLocale(match.locale);
  }, [currentLang]);

  useEffect(() => {
    console.log(currentLocale);
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
            primaryOption="Open"
            contentArray={dropdownLocales.map((loc) => loc.content)}
            clearTrigger={clearDropdown}
            size="sm"
            openSide="up"
          />
        )}
      </div>

      {smallDevice && dropdownLocales.length > 0 && (
        <Dropdown
          primaryOption="Choose Language"
          currentOption={currentLang}
          contentArray={dropdownLocales.map((loc) => loc.content)}
          setOption={setCurrentLang}
          clearTrigger={clearDropdown}
          size="sm"
          openSide="up"
        />
      )}
    </>
  );
}
