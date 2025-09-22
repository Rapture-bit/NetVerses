interface interpolationProps {
  escapeValue?: boolean;
}

class Navi18n {
  lang?: string;
  fallbackLang?: any[];
  resources?: object | string;
  debug?: boolean;
  interpolation?: interpolationProps;
  locale?: string;
  localeToLang?: any[];

  constructor(
    fallbackLang?: any[],
    locale?: string,
    localeToLang?: any[],
    resources?: object | string,
    debug?: boolean,
    lang?: string,
    interpolation?: interpolationProps,
  ) {
    this.locale = locale || "en-US"; // Current locale
    this.lang = lang || "en"; // Current language
    this.fallbackLang = fallbackLang || ["en"]; // Fallback language(s), if one or more translation keys are missing
    this.resources = resources || {}; // Translation data (or file)
    this.localeToLang = localeToLang || [{ lang: "en", locale: "en-US" }]; // Locale-Lang Data
    this.debug = debug || true; // Debug mode
    this.interpolation = interpolation || { escapeValue: true }; // Escape HTML special characters (safety)
    this.init(); // Initialize
  }

  init(): void {
    this.asyncLocaleLang();
  }

  private asyncLocaleLang(callback?: (errorMsg: string) => void): void {
    try {
      const findLngInData = this.localeToLang.find(
        (item) => item.lang === this.lang,
      );
      const findLocaleInData = this.localeToLang.find(
        (item) => item.locale === this.locale,
      );

      if (findLocaleInData && findLocaleInData.lang !== this.lang) {
        this.changeLanguage(findLocaleInData.lang);
      }
      if (findLngInData && findLngInData.locale !== this.locale) {
        this.changeLanguage(findLocaleInData.locale);
      }
      if (callback) callback(undefined);
    } catch (e) {
      if (callback) callback(e);
    }
  }

  changeLanguage(
    lang: string,
    callback?: (success: boolean, lang?: string) => void,
  ): void {
    try {
      if (!this.localeToLang.find((item) => item.lang === lang)) {
        if (callback) callback(false, undefined);
        console.error(`Locale mapping for language "${lang}" not found.`);
        return;
      }
      const updatedLang = lang.toLowerCase();
      this.lang = updatedLang;
      this.asyncLocaleLang((errorMsg: string) => {
        if (!errorMsg) {
          if (callback) callback(true, updatedLang);
        } else {
          if (callback) callback(false, undefined);
          console.error(errorMsg);
        }
      });
    } catch (e) {
      if (callback) callback(false);
      console.error(e);
    }
  }

  changeLocale(
    locale: string,
    callback?: (success: boolean, locale?: string) => void,
  ): void {
    try {
      if (!this.localeToLang.find((item) => item.locale === locale)) {
        console.error(`Locale mapping for "${locale}" not found.`);
        if (callback) callback(false, undefined);
        return;
      }
      this.locale = locale;
      this.asyncLocaleLang((errorMsg: string) => {
        if (!errorMsg) {
          if (callback) callback(true, locale);
        } else {
          if (callback) callback(false, undefined);
          console.error(errorMsg);
        }
      });
    } catch (e) {
      if (callback) callback(false);
      console.error(e);
    }
  }

  getLanguage(): string {
    return this.lang;
  }

  // Functionalities
  private formatDate(
    date: Date | string | number,
    options?: { locale?: string; region?: string },
  ): string {
    return "Placeholder";
  }

  t(
    key: string,
    params?: object,
    options?: {
      defaultValue?: string;
      count?: number;
      lng: string;
      context?: string;
    },
  ): string {
    return "Placeholder";
  }
}

const Initi18n = new Navi18n();
Initi18n.changeLanguage("en", (success, updatedLang) => {
  if (success) {
    console.log(`Successfully changed language to ${updatedLang}`);
  }
});
Initi18n.changeLocale("en-US", (success, updatedLocale) => {
  if (success) {
    console.log(`Successfully changed locale to ${updatedLocale}`);
  }
});
