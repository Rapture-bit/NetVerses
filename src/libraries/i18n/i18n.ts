import i18n from "i18next";
import { initReactI18next, Translation } from "react-i18next";

import enUS from "./translations/en-US.json";
import frFR from "./translations/fr-FR.json";
import ruRU from "./translations/ru-RU.json";
import zhCN from "./translations/zh-CN.json";
import deDE from "./translations/de-DE.json";
import heIL from "./translations/he-IL.json";
import arAR from "./translations/ar-AR.json";
import jaJP from "./translations/ja-JP.json";
import aryMA from "./translations/ary-MA.json";
// import other locales similarly...

const resources = {
  "en-US": { translation: enUS },
  "fr-FR": { translation: frFR },
  "ru-RU": { translation: ruRU },
  "zh-CN": { translation: zhCN },
  "de-DE": { translation: deDE },
  "he-IL": { translation: heIL },
  "ar-AR": { translation: arAR },
  "ja-JP": { translation: jaJP },
  "ary-MA": { translation: aryMA },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en-US",
  fallbackLng: "en-US",
  interpolation: { escapeValue: false },
});

export default i18n;
