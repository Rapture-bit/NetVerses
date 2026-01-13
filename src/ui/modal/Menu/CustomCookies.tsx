import React, { useState, useContext } from "react";
import PrimaryModal from "@/ui/modal/Primary";
import { motion, AnimatePresence } from "framer-motion";
import { Button, ConfigProvider, Switch } from "antd";

import { ThemeContext } from "@/context/ThemeContext";

interface CustomCookiesProps {
  visible: boolean;
  setIsOpen: Function;
  setConsentedCookiesList: Function;
  consentedCookiesList: string[];
  [key: string]: any;
}

export default function CustomCookies({
  visible,
  setIsOpen,
  setConsentedCookiesList,
  consentedCookiesList,
}: CustomCookiesProps) {
  const findElement = (cookieName: string): boolean => {
    return consentedCookiesList.includes(cookieName);
  };

  const { colorProperties } = useContext(ThemeContext);
  const [checkedCookies, setCheckedCookies] = useState<{
    functional: boolean;
    necessary: boolean;
    advertising: boolean;
  }>({
    functional: findElement("functional"),
    necessary: findElement("necessary"),
    advertising: findElement("advertising"),
  });

  const [previousState, setPreviousState] =
    useState<string[]>(consentedCookiesList);

  const pageVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: { duration: 1.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.1 },
    },
  };

  function resetTab() {
    setCheckedCookies({
      functional: findElement("functional"),
      necessary: findElement("necessary"),
      advertising: findElement("advertising"),
    });
    setIsOpen(false);
  }

  function onSave() {
    setConsentedCookiesList(previousState);
    setIsOpen(false);
  }

  function onCookiesChange(cookiesName: string) {
    setCheckedCookies((prevState) => ({
      ...prevState,
      [cookiesName]: !prevState[cookiesName],
    }));

    if (checkedCookies[cookiesName]) {
      setPreviousState((prevState) =>
        prevState.filter((cookie) => cookie !== cookiesName),
      );
    } else {
      setPreviousState((prevState) => [...prevState, cookiesName]);
    }
  }

  return (
    <ConfigProvider
      theme={{
        colorPrimary: colorProperties.primaryColor || "#1677ff",
        colorBgElevated: colorProperties.backgroundColor || "#1677ff",
        colorTextBase: colorProperties.textColor || "#1677ff",
        colorBorder: colorProperties.textColor || "#1677ff",
      }}
    >
      <PrimaryModal
        width={512}
        confirmClose={true}
        onClosed={resetTab}
        title="Customize Cookies"
        noConfirmationDialog={true}
        open={visible}
        setIsOpen={setIsOpen}
        footer={
          <div className="flex flex-row gap-3">
            <Button
              aria-label="Save Preferences"
              onClick={onSave}
              type="primary"
              className="p-2 bg-transparent bg-violet-900 !border-violet-900 mt-2 hover:!bg-opacity-85 px-8 rounded-lg"
            >
              Save
            </Button>
          </div>
        }
        centered
      >
        <AnimatePresence>
          <motion.div
            key="tab1"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
          >
            <div className="space-y-4 flex flex-col">
              <div className="flex flex-row space-x-2">
                <div className="flex flex-col space-y-3">
                  <div className="flex flex-col space-y-1">
                    <div className="flex justify-between items-center pl-0 pb-0 p-3">
                      <span className="text-lg font-semibold">
                        Necessary Cookies
                      </span>
                      <span className="text-xs bg-red-600 text-white rounded-md py-1 px-2">
                        Required
                      </span>
                    </div>
                    <span>
                      These cookies are essential for the basic functionalities
                      of the platform.
                    </span>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <div className="flex justify-between items-center pl-0 pb-0 p-3">
                      <span className="text-lg font-semibold">
                        Functional Cookies
                      </span>
                      <div className="py-1 px-2">
                        <Switch
                          checked={checkedCookies["functional"]}
                          onChange={() => onCookiesChange("functional")}
                        />
                      </div>
                    </div>
                    <span>
                      These cookies enhance user experience and functionality on
                      the platform.
                    </span>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <div className="flex justify-between items-center pl-0 pb-0 p-3">
                      <span className="text-lg font-semibold">
                        Analytics & Advertising Cookies
                      </span>
                      <div className="py-1 px-2">
                        <Switch
                          checked={checkedCookies["advertising"]}
                          onChange={() => onCookiesChange("advertising")}
                        />
                      </div>
                    </div>
                    <span>
                      These cookies help us understand user behavior and provide
                      personalized ads.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </PrimaryModal>
    </ConfigProvider>
  );
}
