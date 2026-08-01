import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

import { useTranslation } from "react-i18next";

import PrimaryModal from "./Primary";
import PrimaryInput from "@/ui/input/Primary";
import OTP from "@/ui/input/OTP";

import createQRCode from "./QRCodeGenerator";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Checkbox, ConfigProvider } from "antd";
import { motion, AnimatePresence } from "framer-motion";

interface SignInModalProps {
  visible: boolean;
  setIsOpen: Function;
}

interface ErrorState {
  TabOne: {
    Identifier: Object;
    Additional: Object;
  };
  TabTwo: {
    OneTimeCode: Object;
  };
}

const SignInModal: React.FC<SignInModalProps> = ({ visible, setIsOpen }) => {
  const { t } = useTranslation();

  const [currentTab, setTab] = useState<number>(1);
  const [isNextDisabled, setNextDisabled] = useState<boolean>(false);
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [qrCode, setQRCode] = useState<string>("");

  const { colorProperties } = useContext(ThemeContext);

  const [errorState, setErrorState] = useState<ErrorState>({
    TabOne: {
      Identifier: {
        Invalid: false,
        msg: "",
      },
      Additional: {
        Invalid: false,
        msg: "",
      },
    },
    TabTwo: {
      OneTimeCode: {
        Invalid: false,
        msg: "",
      },
    },
  });

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

  const toggleIdentifier = (e) => {
    setIdentifier(e.target.value);
  };

  const togglePassword = (e) => {
    setPassword(e.target.value);
  };

  async function toggleTab() {
    if (currentTab === 1) {
      const fetchLogin = await fetch(
        "https://api.netverses.com/v1/auth/login",
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (fetchLogin.status === 429) {
        return setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            Additional: {
              Invalid: true,
              msg: "Max rate limit reached. Please try again later.",
            },
          },
        }));
      }

      if (!fetchLogin.ok) {
        return setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            Additional: {
              Invalid: true,
              msg: "An error occurred.",
            },
          },
        }));
      }

      const data = await fetchLogin.json();

      if (!data.success) {
        return setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            Additional: {
              Invalid: true,
              msg: "Invalid credentials.",
            },
          },
        }));
      }

      setTab(2);
    }
  }

  const resetTab = () => {
    setIdentifier("");
    setPassword("");
    setTab(1);
  };

  const validateIdentifier = (identifier) => {};

  useEffect(() => {
    setNextDisabled(identifier === "" || password === "");
    validateIdentifier(identifier);
  }, [identifier, password]);

  useEffect(() => {
    if (!visible) return;

    const fetchQRCode = async () => {
      const qr = await createQRCode(
        `https://netverses.com/auth/connect?id=${Math.random().toString(32).substring(2)}`,
      );
      setQRCode(qr);
    };

    fetchQRCode();
  }, [visible, currentTab]);

  return (
    <PrimaryModal
      width={600}
      confirmClose={true}
      showCloseBtn={false}
      onClosed={resetTab}
      title=""
      open={visible}
      setIsOpen={setIsOpen}
      footer={
        <div className="justify-center items-center text-center">
          {/* 
          
                    {currentTab === 1 && (
            <div className="flex flex-row space-x-3 justify-center items-center">
              <Button
                aria-label="LinkConnect Option"
                type="primary"
                onClick={toggleTab}
                className={`p-4 !bg-violet-800 !border-violet-900 mt-2 hover:!bg-opacity-80 px-6 rounded-full transition-all duration-300`}
              >
                <span
                  className={`font-medium text-white transition-all duration-300`}
                >
                  LinkConnect
                </span>
              </Button>
              <span className="p-1 mt-2">or</span>
            </div>
          )}
          */}
        </div>
      }
      centered
    >
      <AnimatePresence>
        {currentTab === 1 && (
          <motion.div
            key="tab1"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
          >
            <div className="space-y-4 flex flex-col justify-center items-center">
              <div className="flex flex-row items-stretch gap-4 w-full min-h-[320px]">
                <div className="flex flex-col space-y-2 justify-center w-1/2">
                  <div className="flex flex-col items-center justify-center mb-8 space-y-1 text-center">
                    <h1 className="text-4xl font-bold tracking-tight rubik leading-none">
                      <span>Net</span>
                      <span className="text-purple-600">Verses</span>
                    </h1>

                    <p className="text-sm text-white/70 max-w-md inter leading-relaxed">
                      {t("SignIn.welcomeBack")}
                    </p>
                  </div>

                  <ConfigProvider
                    theme={{
                      token: {
                        colorBgBase: colorProperties.backgroundColor
                          ? colorProperties.backgroundColor
                          : "#1677ff",
                        colorPrimary: "#535353",
                        colorTextPlaceholder: "#9ca3af",
                        colorBorder: colorProperties.borderInputColor
                          ? colorProperties.borderInputColor
                          : "#1677ff",
                      },
                    }}
                  >
                    <div className="flex flex-col">
                      <PrimaryInput
                        maxLength={100}
                        type="text"
                        placeholder={t("SignIn.identifiersField")}
                        ColorSettings={{
                          BorderColor: errorState.TabOne.Identifier["Invalid"]
                            ? "#EF4444"
                            : colorProperties.borderInputColor,
                        }}
                        prefix={<UserOutlined className="!mr-1" />}
                        onChange={toggleIdentifier}
                        errorMessage={
                          errorState.TabOne.Identifier["Invalid"]
                            ? errorState.TabOne.Identifier["msg"]
                            : ""
                        }
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <PrimaryInput
                        maxLength={128}
                        ColorSettings={{
                          BorderColor: colorProperties.borderInputColor
                            ? colorProperties.borderInputColor
                            : "#1677ff",
                        }}
                        placeholder={t("SignIn.passwordField")}
                        type="password"
                        prefix={<LockOutlined className="!mr-1" />}
                        onChange={togglePassword}
                      />

                      <div>
                        <a
                          href="/recover-password"
                          className="text-violet-600! underline hover:text-violet-700! hover:underline! transition-all duration-300"
                        >
                          {t("SignIn.forgotPassword")}
                        </a>
                      </div>

                      <Button
                        aria-label="Continue"
                        onClick={toggleTab}
                        disabled={isNextDisabled}
                        className={`
    mt-2 px-10 py-4 rounded-full transition-all duration-300
    ${
      isNextDisabled
        ? "bg-gray-600 cursor-not-allowed border-none"
        : "!bg-violet-700 hover:!bg-violet-600 border-none"
    }
    shadow-md
  `}
                      >
                        <span className={`font-medium text-white`}>
                          {t("SignIn.continueLabel")}
                        </span>
                      </Button>
                    </div>
                  </ConfigProvider>
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="w-[1px] h-full bg-white/10"></div>

                  <span className="absolute bg-[#0f172a] px-2 py-1.5 text-xs text-gray-400">
                    {t("SignIn.orLabel")}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center w-1/2 space-y-5 p-6 rounded-lg dark:bg-[#141e32] shadow-xl backdrop-blur-md">
                  <span className="text-xs text-[#c3d3ff] text-center leading-relaxed max-w-xs">
                    {t("SignIn.qrLogin")}
                  </span>

                  {/* QR container */}
                  <div>
                    <img
                      src={qrCode || null}
                      width={256}
                      height={256}
                      alt="QR code login option"
                      className="rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PrimaryModal>
  );
};

export default SignInModal;
