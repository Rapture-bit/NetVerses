import { AnimatePresence, motion } from "framer-motion";
import CustomCookies from "../Menu/CustomCookies";
import React, { useState, useEffect } from "react";

import Cookies from "js-cookie";

interface CookiesConsentProps {
  showNotif: boolean;
  setNotifVisibility: Function;
  setConsentedTo: Function;
}

export default function CookiesConsent({
  showNotif,
  setNotifVisibility,
  setConsentedTo,
}: CookiesConsentProps) {
  const [expand, SetExpand] = useState<boolean | null>(null);
  const [isCustomCookiesOpen, setCustomCookiesOpen] = useState<boolean>(false);
  const [allElementsSelected, setAllElements] = useState<boolean>(false);
  const [consentedCookiesList, setConsentedCookiesList] = useState<string[]>([
    "necessary",
    "functional",
    "advertising",
  ]);

  const openCustomMenu = () => {
    setCustomCookiesOpen(true);
  };

  const findElement = (cookieName: string): boolean => {
    return consentedCookiesList.includes(cookieName);
  };

  const onConfirm = (): void => {
    const timestamp = Date.now();
    const consented = {
      preferences: {
        essential: true,
        functional: findElement("functional"),
        advertising: findElement("advertising"),
      },
      timestamp: timestamp,
      version: "1.0",
    };

    Cookies.set("cookiesConsent", JSON.stringify(consented), {
      expires: 365,
      path: "/",
      sameSite: "Lax",
    });

    setConsentedTo(consentedCookiesList);
    setNotifVisibility(false);
  };

  useEffect(() => {
    setAllElements(
      findElement("necessary") &&
        findElement("functional") &&
        findElement("advertising"),
    );
    setConsentedTo(consentedCookiesList);
  }, [consentedCookiesList]);

  return (
    <AnimatePresence>
      {showNotif && (
        <motion.div
          key="cookie-notif"
          className="fixed bottom-0 w-full flex justify-center items-center p-4 z-50 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="darkerBackgroundColor w-full max-w-md p-4 rounded-xl shadow-lg flex flex-col space-y-1 pointer-events-auto">
            <div>
              <div className="flex items-center justify-between w-full max-w-md mx-auto px-2">
                <span className="flex-1 text-center text-base md:text-lg font-medium select-text">
                  <span className="text-black dark:text-gray-200">Net</span>
                  <span className="text-purple-600">Verse</span> uses cookies.
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-3">
                Our website uses cookies and similar tracking technologies to
                enhance your browsing experience, ensure the functionality of
                our services, and provide personalized content and
                recommendations.{" "}
                {!expand && (
                  <a
                    target="_blank"
                    onClick={() => {
                      SetExpand(true);
                    }}
                    rel="noopener noreferrer"
                    className="!underline cursor-pointer hover:text-violet-600 transition-all duration-300"
                  >
                    Learn more
                  </a>
                )}
                {expand && (
                  <p className="mb-3">
                    Cookies also help us analyze site traffic, understand user
                    behavior, and improve our products and services. To learn
                    more about how we handle your data and your rights, please
                    visit our{" "}
                    <a
                      href="/cookie-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="!underline hover:text-violet-600 transition-all duration-300"
                    >
                      Cookie Policy
                    </a>
                    .
                  </p>
                )}
              </p>
            </div>

            <CustomCookies
              visible={isCustomCookiesOpen}
              setIsOpen={setCustomCookiesOpen}
              setConsentedCookiesList={setConsentedCookiesList}
              consentedCookiesList={consentedCookiesList}
            />

            <div className="flex items-center space-x-4 justify-end w-full max-w-md mx-auto">
              <button
                onClick={openCustomMenu}
                className="dark:border-[#313131] border-[#a8a8a8] hover:bg-violet-900 hover:border-transparent hover:text-white border bg-transparent font-medium textColor py-2 sm:px-10 px-5 rounded-lg shadow-sm transition duration-300 text-sm"
              >
                Customize
              </button>

              <button
                onClick={onConfirm}
                className="bg-violet-900 font-medium text-white py-2 sm:px-10 px-5 rounded-lg shadow-sm hover:bg-opacity-85 transition duration-300 text-sm"
              >
                {allElementsSelected ? (
                  <span>Accept All</span>
                ) : (
                  <span>Confirm</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
