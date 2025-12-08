import React, { useState, useContext } from "react";
import PrimaryModal from "@/components/modal/Primary";
import PrimaryInput from "@/components/input/Primary";

import { motion, AnimatePresence } from "framer-motion";
import { Button, ConfigProvider } from "antd";
import { useTranslation } from "react-i18next";
import { MailOutlined } from "@ant-design/icons";
import { ThemeContext } from "@/context/ThemeContext";

export default function EmailChange({
  visible,
  errorState,
  emailStates,
  username,
  setRequestID,
  setVisible,
  countdownLabel,
  setCountdownLabel,
  timeSent,
  setTimeSent,
  attempt,
  setAttempt,
}) {
  const { t } = useTranslation();
  const { colorProperties } = useContext(ThemeContext);

  const [oldEmail] = useState<string>(emailStates.email);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.25 },
    },
  };

  async function sendCode() {
    const COOLDOWN_SECONDS = 30;

    if (timeSent) {
      const currentUnixTime = new Date().getTime();
      const elapsedTime = (currentUnixTime - timeSent.getTime()) / 1000; // in seconds

      if (elapsedTime < COOLDOWN_SECONDS) {
        setCountdownLabel(Math.ceil(COOLDOWN_SECONDS - elapsedTime));
        return false;
      }
    }

    const sendCodeFetch = await fetch(
      "https://api.netverses.com/v1/otp/request",
      {
        method: "POST",
        body: JSON.stringify({
          email: emailStates.email,
          username,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    const otpRequestResponse = await sendCodeFetch.json();

    if (!sendCodeFetch.ok) {
      setError(t("errors.SignUp.UnexpectedError"));
      return false;
    }

    if (sendCodeFetch.ok && !otpRequestResponse.success) {
      setError(
        otpRequestResponse.message || t("errors.SignUp.UnexpectedError"),
      );
      return false;
    }

    setRequestID(otpRequestResponse.requestId);
    setTimeSent(new Date());
    setCountdownLabel(COOLDOWN_SECONDS);

    const countdownInterval = setInterval(() => {
      setCountdownLabel((prevState) => {
        if (prevState === 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prevState - 1;
      });
    }, 1000);

    return true;
  }

  function resetTab() {
    if (!confirmed) {
      emailStates.setEmail(oldEmail);
      setConfirmed(false);
    }
  }

  const toggleEmail = (e) => emailStates.setEmail(e.target.value);

  const toggleConfirm = async () => {
    if (
      emailStates.email &&
      emailStates.email.trim() !== "" &&
      emailStates.email.length >= 3 &&
      !errorState.TabOne.Email["Invalid"]
    ) {
      const isSuccess = await sendCode();
      if (!isSuccess) {
        return;
      }
      setConfirmed(true);
      setAttempt(attempt + 1);
      setVisible(false);
    } else {
      setConfirmed(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <ConfigProvider
        theme={{
          colorPrimary: colorProperties.primaryColor ?? "#1677ff",
          colorBgElevated: colorProperties.backgroundColor ?? "#ffffff",
          colorTextBase: colorProperties.textColor ?? "#000000",
          colorBorder: colorProperties.textColor ?? "#333333",
        }}
      >
        <PrimaryModal
          width={512}
          confirmClose={true}
          onClosed={resetTab}
          title="Change Email"
          open={visible}
          noConfirmationDialog={true}
          setIsOpen={setVisible}
          centered
          footer={
            <div className="justify-center items-center text-center">
              <div className="justify-center items-center flex flex-row space-x-3">
                <Button
                  aria-label={`${t("general.Confirm")}`}
                  type="primary"
                  disabled={countdownLabel !== 0 ? true : false}
                  onClick={toggleConfirm}
                  className={`p-4 ${countdownLabel !== 0 ? "!bg-violet-900" : "!bg-violet-700"} !border-violet-900 mt-2 hover:!bg-opacity-85 px-16 rounded-full transition-all duration-300`}
                >
                  <span className="font-medium text-white">
                    {t("general.Confirm")}
                  </span>
                </Button>
              </div>
            </div>
          }
        >
          <motion.div
            key="emailModal"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
          >
            <div className="space-y-4 flex flex-col">
              <p>Please enter your new email address to proceed.</p>

              <div className="flex flex-col space-y-1">
                <ConfigProvider
                  theme={{
                    token: {
                      colorBgBase: colorProperties.backgroundColor ?? "#ffffff",
                      colorPrimary: "#535353",
                      colorTextPlaceholder: "#9ca3af",
                      colorBorder:
                        colorProperties.borderInputColor ?? "#cccccc",
                    },
                  }}
                >
                  <PrimaryInput
                    maxLength={64}
                    type="email"
                    placeholder="Email"
                    disabled={countdownLabel !== 0 ? true : false}
                    ColorSettings={{
                      BorderColor:
                        errorState.TabOne.Email["Invalid"] ||
                        (error && error.trim() != "" && error.length > 3)
                          ? "#EF4444"
                          : (colorProperties.borderInputColor ?? "#cccccc"),
                    }}
                    prefix={<MailOutlined className="!mr-1" />}
                    onChange={toggleEmail}
                    infoMessage={
                      countdownLabel !== 0
                        ? `You must wait ${countdownLabel} seconds before you can change your email.`
                        : null
                    }
                    errorMessage={
                      errorState.TabOne.Email["Invalid"]
                        ? errorState.TabOne.Email["msg"]
                        : error && error.trim() != "" && error.length > 3
                          ? error
                          : ""
                    }
                  />
                </ConfigProvider>
              </div>
            </div>
          </motion.div>
        </PrimaryModal>
      </ConfigProvider>
    </AnimatePresence>
  );
}
