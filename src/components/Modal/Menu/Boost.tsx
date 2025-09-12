import React, { useState, useLayoutEffect } from "react";
import PrimaryModal from "@/components/Modal/Primary";
import { motion, AnimatePresence } from "framer-motion";
import { Button, notification, ConfigProvider } from "antd";
import type { NotificationArgsProps } from "antd";

type NotificationPlacement = NotificationArgsProps["placement"];

export default function Boost({ visible, setIsOpen }) {
  const [api, contextHolder] = notification.useNotification();
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("");

  const getCssVariable = (variable) => {
    const root = document.documentElement;
    return getComputedStyle(root).getPropertyValue(variable).trim();
  };

  useLayoutEffect(() => {
    const updateColors = () => {
      setBackgroundColor(getCssVariable("--background-color"));
      setTextColor(getCssVariable("--text-color"));
      setPrimaryColor(getCssVariable("--primary-color"));
    };

    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

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

  function resetTab() {}

  const DeclareInsuficientBoosts = (placement: NotificationPlacement) => {
    api.error({
      message: `Insufficient Boosts`,
      showProgress: true,
      pauseOnHover: false,
      description: "You don't have enough boosts to perform this action!", // i18n
      placement,
    });
  };

  return (
    <>
      {contextHolder}
      <ConfigProvider
        theme={{
          colorPrimary: primaryColor,
          colorBgElevated: backgroundColor,
          colorTextBase: textColor,
          colorBorder: textColor,
        }}
      >
        <PrimaryModal
          width={512}
          confirmClose={true}
          onClosed={resetTab}
          title="Boost"
          open={visible}
          setIsOpen={setIsOpen}
          footer={
            <div className="flex flex-row gap-3">
              <Button
                aria-label="Boost"
                type="primary"
                onClick={() => DeclareInsuficientBoosts("bottomRight")}
                className="p-2 bg-transparent bg-violet-900 !border-violet-900 mt-2 hover:!bg-opacity-85 px-8 rounded-full"
              >
                Boost
              </Button>
              <Button
                type="primary"
                aria-label="Dismiss"
                onClick={() => setIsOpen(false)}
                className="p-2 bg-transparent hover:bg-violet-900 !border-violet-900 mt-2 hover:!bg-opacity-85 px-8 rounded-full"
              >
                Dismiss
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
                <p>
                  Boosting a post increases its visibility by ensuring it
                  appears more frequently in the audience's feed. You can boost
                  any post without restrictions.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </PrimaryModal>
      </ConfigProvider>
    </>
  );
}
