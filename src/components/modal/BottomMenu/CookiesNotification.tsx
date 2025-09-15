import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect } from "react";

interface CookiesNotificationProps {
  showNotif: boolean;
  setNotifVisibility: Function;
  agreedWithCookies: boolean;
  setAgreedWithCookies: Function;
}

export default function CookiesNotification({
  showNotif,
  setNotifVisibility,
  agreedWithCookies,
  setAgreedWithCookies,
}: CookiesNotificationProps) {
  const [expand, SetExpand] = useState<boolean | null>(null);

  return (
    <AnimatePresence>
      {showNotif && (
        <motion.div
          key="cookie-notif"
          className="fixed bottom-0 w-full flex justify-center items-center p-4 z-[9999]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="darkerBackgroundColor w-full max-w-md p-4 rounded-xl shadow-lg flex flex-col space-y-1">
            <div className="flex items-center justify-between w-full max-w-md mx-auto px-2">
              <span className="flex-1 text-center text-base md:text-lg font-medium select-text">
                <span className="text-black dark:text-gray-200">Net</span>
                <span className="text-purple-600">Verse</span> uses cookies.
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Our website uses cookies and similar tracking technologies to
              enhance your browsing experience, ensure the functionality of our
              services, and provide personalized content and recommendations.{" "}
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
                  behavior, and improve our products and services. To learn more
                  about how we handle your data and your rights, please visit
                  our{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="!underline hover:text-violet-600 transition-all duration-300"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              )}
            </p>

            <div className="flex items-center justify-end w-full max-w-md mx-auto">
              <button
                onClick={() => {
                  setNotifVisibility(false);
                  setAgreedWithCookies(true);
                }}
                className="bg-violet-900 font-medium text-white py-2 sm:px-10 px-5 rounded-full shadow-sm hover:bg-opacity-85 transition duration-300 text-sm"
              >
                Got it
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
