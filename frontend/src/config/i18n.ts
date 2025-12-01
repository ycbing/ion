import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonEn from "@/locales/en/common.json";
import featuresEn from "@/locales/en/features.json";
import pagesEn from "@/locales/en/pages.json";
import commonZh from "@/locales/zh-CN/common.json";
import featuresZh from "@/locales/zh-CN/features.json";
import pagesZh from "@/locales/zh-CN/pages.json";

export const LANGUAGE_STORAGE_KEY = "content-generator-language";
export const DEFAULT_LANGUAGE = "zh-CN";

export const SUPPORTED_LANGUAGES = [
  { value: "zh-CN" },
  { value: "en" }
];

const resources = {
  en: {
    common: commonEn,
    pages: pagesEn,
    features: featuresEn
  },
  "zh-CN": {
    common: commonZh,
    pages: pagesZh,
    features: featuresZh
  }
};

const storedLanguage =
  typeof window !== "undefined"
    ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    : undefined;

const initialLanguage = storedLanguage && resources[storedLanguage as keyof typeof resources]
  ? storedLanguage
  : DEFAULT_LANGUAGE;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: "common",
    ns: ["common", "pages", "features"],
    interpolation: {
      escapeValue: false
    }
  })
  .catch((error) => {
    console.error("[i18n] Initialisation failed", error);
  });

if (typeof window !== "undefined") {
  const applyLanguage = (language: string) => {
    document.documentElement.lang = language;
  };

  applyLanguage(initialLanguage);

  i18n.on("languageChanged", (language) => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    applyLanguage(language);
  });
}

export default i18n;
