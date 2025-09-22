import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enUS from "./en-US.json";
import frFR from "./fr-FR.json";
// import other locales similarly...

const resources = {
  "en-US": { translation: enUS },
  "fr-FR": { translation: frFR },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en-US",
  fallbackLng: "en-US",
  interpolation: { escapeValue: false },
});

export default i18n;
