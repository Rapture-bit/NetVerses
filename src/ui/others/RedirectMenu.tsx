import React, { useContext, useEffect, useState } from "react";

import { ThemeContext } from "@/context/ThemeContext";
import PrimaryModal from "@/ui/modal/Primary";

import { Button, Checkbox, ConfigProvider } from "antd";

import { motion, AnimatePresence } from "framer-motion";

export default function RedirectMenu({ url, label, ...props }) {
  const { colorProperties } = useContext(ThemeContext);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isTrusted, setTrusted] = useState<boolean>(false);

  const toggleModal = () => {
    setModalOpen(true);
  };

  const resetTab = () => {};
  const toggleTrustedChecked = () => {
    setTrusted(!isTrusted);
  };

  useEffect(() => {
    if (isTrusted) {
      console.log("Trusted the following link: ", url);
    }
  }, [isTrusted]);

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

  const redirectToExternalLink = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
    setModalOpen(false);
  };

  useEffect(() => {}, [url]);

  return (
    <>
      <a
        onClick={toggleModal}
        target="_blank"
        className="hover:underline cursor-pointer"
        rel="noopener noreferrer"
        {...props}
      >
        {label}
      </a>

      <ConfigProvider
        theme={{
          colorPrimary: colorProperties.primaryColor
            ? colorProperties.primaryColor
            : "#1677ff",
          colorBgElevated: colorProperties.backgroundColor
            ? colorProperties.backgroundColor
            : "#1677ff",
          colorTextBase: colorProperties.textColor
            ? colorProperties.textColor
            : "#1677ff",
          colorBorder: colorProperties.textColor
            ? colorProperties.textColor
            : "#1677ff",
        }}
      >
        <PrimaryModal
          width={800}
          confirmClose={true}
          onClosed={resetTab}
          title="Redirect"
          open={isModalOpen}
          noConfirmationDialog={true}
          setIsOpen={setModalOpen}
          footer={
            <div className="flex flex-row gap-3">
              <Button
                aria-label="Confirm Redirect"
                type="primary"
                onClick={() => redirectToExternalLink(url)}
                className="!p-2 !bg-violet-900 !border-violet-900 !mt-2 hover:!bg-opacity-85 !px-8 !rounded-full"
              >
                Confirm
              </Button>
              <Button
                type="primary"
                aria-label="Dismiss"
                onClick={() => setModalOpen(false)}
                className="textColor hover:!text-white !p-2 !bg-transparent hover:!bg-violet-900 !border-violet-900 !mt-2 hover:!bg-opacity-85 !px-8 !rounded-full"
              >
                Cancel
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
              <div className="flex flex-col space-y-2">
                <p className="flex items-start gap-1 text-xs italic text-yellow-600 font-semibold select-none">
                  <span className="icon-[cuida--alert-outline] w-4 h-4 shrink-0"></span>
                  <span>
                    {isTrusted
                      ? "This link is marked as trusted."
                      : "This link is not marked as trusted. Please proceed with caution."}
                  </span>
                </p>

                <p className="text-sm">
                  You will be redirected to an external link. Are you sure you
                  want to proceed?
                </p>

                <span className="self-start font-semibold text-purple-500 hover:underline cursor-pointer select-none break-all">
                  {url}
                </span>

                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: colorProperties.primaryColor
                        ? colorProperties.primaryColor
                        : "#1677ff",
                      colorBgContainer: colorProperties.backgroundColor
                        ? colorProperties.backgroundColor
                        : "#ffffff",
                    },
                  }}
                >
                  <Checkbox
                    id="trustedLinkCheckbox"
                    className="text-xs select-none"
                    onChange={toggleTrustedChecked}
                  >
                    Mark as trusted (This will prevent this warning from showing
                    up for this link in the future)
                  </Checkbox>
                </ConfigProvider>
              </div>
            </motion.div>
          </AnimatePresence>
        </PrimaryModal>
      </ConfigProvider>
    </>
  );
}
