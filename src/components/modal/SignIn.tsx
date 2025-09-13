import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

import PrimaryModal from "./Primary";
import PrimaryInput from "@/components/input/Primary";
import OTP from "@/components/input/OTP";

import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Checkbox, ConfigProvider } from "antd";
import { motion, AnimatePresence } from "framer-motion";

interface SignInModalProps {
  visible: boolean;
  setIsOpen: Function;
}

interface ErrorState {
  TabOne: {
    Email: Object;
    Additional: Object;
  };
  TabTwo: {
    OneTimeCode: Object;
  };
}

const SignInModal: React.FC<SignInModalProps> = ({ visible, setIsOpen }) => {
  const [currentTab, setTab] = useState<number>(1);
  const [isNextDisabled, setNextDisabled] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { colorProperties } = useContext(ThemeContext);

  const [errorState, setErrorState] = useState<ErrorState>({
    TabOne: {
      Email: {
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

  const toggleEmail = (e) => {
    setEmail(e.target.value);
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
    setEmail("");
    setPassword("");
    setTab(1);
  };

  const validateEmail = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (email) {
      if (!emailRegex.test(email)) {
        setNextDisabled(true);
        setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            Email: {
              Invalid: true,
              msg: "Provide a valid email.",
            },
          },
        }));
      } else {
        setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            Email: {
              Invalid: false,
              msg: "",
            },
          },
        }));
      }
    } else {
      setErrorState((prevState) => ({
        ...prevState,
        TabOne: {
          ...prevState.TabOne,
          Email: {
            Invalid: false,
            msg: "",
          },
        },
      }));
    }
  };

  useEffect(() => {
    setNextDisabled(email === "" || password === "");
    validateEmail(email);
  }, [email, password]);

  return (
    <PrimaryModal
      width={512}
      confirmClose={true}
      onClosed={resetTab}
      title="Sign In"
      open={visible}
      setIsOpen={setIsOpen}
      footer={
        <div className="justify-center items-center text-center">
          {currentTab === 1 && (
            <Button
              aria-label="Submit"
              type="primary"
              onClick={toggleTab}
              className={`p-4 ${isNextDisabled ? "!bg-violet-900" : "!bg-violet-700"} !border-violet-900 mt-2 hover:!bg-opacity-85 px-16 rounded-full transition-all duration-300`}
              disabled={isNextDisabled}
            >
              <span
                className={`font-medium ${isNextDisabled ? "textColor" : "text-white"} transition-all duration-300`}
              >
                Submit
              </span>
            </Button>
          )}
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
            <div className="space-y-4 flex flex-col">
              <span className="text-sm inter">
                Welcome back to NetVerse! Please sign in to your account and
                resume your journey with us.
              </span>

              <form className="space-y-3 flex flex-col">
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
                  <div className="flex flex-col space-y-1">
                    <PrimaryInput
                      maxLength={64}
                      type={"email"}
                      placeholder="Email"
                      ColorSettings={{
                        BorderColor: errorState.TabOne.Email["Invalid"]
                          ? "#EF4444"
                          : colorProperties.borderInputColor,
                      }}
                      prefix={<MailOutlined className="!mr-1" />}
                      onChange={toggleEmail}
                      errorMessage={
                        errorState.TabOne.Email["Invalid"]
                          ? errorState.TabOne.Email["msg"]
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
                      placeholder="Password"
                      type="password"
                      prefix={<LockOutlined className="!mr-1" />}
                      onChange={togglePassword}
                    />

                    <div>
                      <a
                        href="/recover-password"
                        className="text-violet-400 underline hover:text-violet-400 transition-all duration-300"
                      >
                        Recover Password
                      </a>
                    </div>
                  </div>
                </ConfigProvider>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PrimaryModal>
  );
};

export default SignInModal;
