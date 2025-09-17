import React, { useState, useEffect } from "react";
import Dropdown from "@/components/input/Dropdown";

export default function LocaleMenu() {
  const [currentLocale, setCurrentLocale] = useState<string | null>("en-US");
  const [availableLocales, setAvailableLocales] = useState<any[]>([
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
    { content: "Deutsch", locale: "de-DE" },
    { content: "中文", locale: "zh-TW" },
  ]);
  const [dropdownLocales, setDropdownLocales] = useState<any[]>([
    "English",
    "French",
  ]);

  const [maxLocales, setMaxLocales] = useState<number>(availableLocales.length);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [smallDevice, setSmallDevice] = useState<boolean>(false);
  // const [screenHeight, setScreenHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenWidth >= 1024 && screenWidth < 1125) {
      setMaxLocales(8);
      setSmallDevice(false);
    } else if (screenWidth < 1024) {
      if (screenWidth > 620) {
        setMaxLocales(9);
        setSmallDevice(false);
      } else {
        setMaxLocales(0);
        setSmallDevice(true);
      }
    } else {
      setMaxLocales(availableLocales.length - 2);
      setSmallDevice(false);
    }
  }, [screenWidth]);

  return (
    <>
      <div className="fixed bottom-0 w-full flex justify-start items-center mb-3 space-x-3">
        {availableLocales.slice(0, maxLocales).map((availableLocale, index) => (
          <button
            key={index}
            className={`localeBtn text-sm hover:underline ${
              currentLocale === availableLocale.locale
                ? "font-bold underline"
                : "font-normal"
            }`}
            onClick={() => setCurrentLocale(availableLocale.locale)}
          >
            {availableLocale.content}
          </button>
        ))}
        {!smallDevice && (
          <Dropdown
            primaryOption="Open"
            contentArray={dropdownLocales}
            size="sm"
            openSide="up"
          />
        )}
      </div>
      {smallDevice && (
        <div className="">
          <Dropdown
            primaryOption="Select Language"
            contentArray={dropdownLocales}
            size="sm"
            openSide="up"
          />
        </div>
      )}
    </>
  );
}
