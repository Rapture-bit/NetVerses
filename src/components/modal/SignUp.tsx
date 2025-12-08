import React, { useState, useCallback, useEffect, useContext } from "react";
import PrimaryModal from "./Primary";
import PrimaryInput from "@/components/input/Primary";
import OTP from "@/components/input/OTP";
import { ThemeContext } from "@/context/ThemeContext";
import { UserContext } from "@/context/UserContext";
import { useTranslation } from "react-i18next";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, ConfigProvider } from "antd";
import debounce from "lodash.debounce";
import { motion, AnimatePresence } from "framer-motion";
import { text } from "stream/consumers";
import EmailChange from "./EmailChange";

interface SignUpModalProps {
  visible: boolean;
  setIsOpen: Function;
}

interface ErrorState {
  TabOne: {
    Username: Object;
    Email: Object;
    Password: Object;
    ConfirmPassword: Object;
    Additional: Object;
  };
  TabTwo: {
    OneTimeCode: Object;
  };
}

const SignUpModal: React.FC<SignUpModalProps> = ({ visible, setIsOpen }) => {
  const { t } = useTranslation();
  const { userCache, updateCache } = useContext(UserContext);
  const { colorProperties } = useContext(ThemeContext);
  const [isNextDisabled, setNextDisabled] = useState<boolean>(true);
  const [currentTab, setTab] = useState<number>(1);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(true);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [AgreementChecked, setAgreementChecked] = useState<string>("");
  const [emailCache, setEmailCache] = useState<Object>({});
  const [usernameCache, setUsernameCache] = useState<Object>({});
  const [emailChangeMenuVisibility, setEmailChangeMenuVisibility] =
    useState<boolean>(false);
  const [Empty, setEmpty] = useState<boolean>();
  const [OTPValue, setOTPValue] = useState<string>("");
  const [OTPMaxLength, _] = useState<number>(5);
  const [timeSent, setTimeSent] = useState<Date>();
  const [emailChangeAttempt, setEmailChangeAttempt] = useState<number>(0);
  const [countdownLabel, setCountdownLabel] = useState<number>(0);
  const [isNoConfirmationDialog, setNoConfirmationDialog] =
    useState<boolean>(false);
  const [requestID, setRequestID] = useState<string>("");
  const [resendStatus, setResendStatus] = useState<object>({
    onHold: false,
    label: t("SignUp.resendCode"),
  });
  const [errorState, setErrorState] = useState<ErrorState>({
    TabOne: {
      Username: {
        Invalid: false,
        msg: "",
      },
      Email: {
        Invalid: false,
        msg: "",
      },
      Password: {
        Invalid: false,
        msg: "",
      },
      ConfirmPassword: {
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

  const verifyIsBlacklisted = async (setError) => {
    const response = await fetch("https://api.netverses.com/v1/check-country", {
      method: "GET",
    });

    if (response.status === 429) {
      return setError(t("errors.maxRateLimited"), 1);
    }

    const isBlacklistedResponse = await response.json();

    if (!response.ok) {
      return setError(t("errors.SignUp.UnexpectedError"), 1);
    }

    if (!isBlacklistedResponse.success) {
      return setError(t("errors.SignUp.restrictedRegion"), 1);
    }
  };

  const checkUserAuthentication = async (setError) => {
    try {
      if (userCache !== null) {
        return setError(t("errors.SignUp.UserLoggedIn"), 1);
      }
    } catch (e) {
      return setError(t("errors.SignUp.authenticationError"), 1);
    }
  };

  const validateEmail = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (email) {
      if (!emailRegex.test(email)) {
        setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            Email: {
              Invalid: true,
              msg: t("errors.invalidEmail"),
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

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;

    if (username) {
      if (username.length < 4 || !usernameRegex.test(username)) {
        setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            Username: {
              Invalid: true,
              msg: t("errors.SignUp.shortInvalidUsername"),
            },
          },
        }));
      } else if (username.length > 20) {
        setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            Username: {
              Invalid: true,
              msg: t("errors.SignUp.longInvalidUsername"),
            },
          },
        }));
      } else {
        setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            Username: {
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
          Username: {
            Invalid: false,
            msg: "",
          },
        },
      }));
    }
  };

  const validatePassword = (password) => {
    const lowercaseRegex = /[a-z]/g;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;

    if (password) {
      if (
        password.length < 8 ||
        (password.match(lowercaseRegex) || []).length < 2 ||
        !specialCharRegex.test(password)
      ) {
        setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            Password: {
              Invalid: true,
              msg: t("errors.SignUp.invalidPassword"),
            },
          },
        }));
      } else {
        setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            Password: {
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
          Password: {
            Invalid: false,
            msg: "",
          },
        },
      }));
    }
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (trimmedPassword && trimmedConfirmPassword) {
      if (trimmedConfirmPassword !== trimmedPassword) {
        setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            ConfirmPassword: {
              Invalid: true,
              msg: t("errors.SignUp.unmatchingPasswords"),
            },
          },
        }));
      } else {
        setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            ConfirmPassword: {
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
          ConfirmPassword: {
            Invalid: false,
            msg: "",
          },
        },
      }));
    }
  };

  const checkUsernameAvailability = useCallback(async () => {
    if (!username) return;
    if (errorState.TabOne.Username["Invalid"]) return;

    if (usernameCache[username] !== undefined) {
      setIsUsernameAvailable(usernameCache[username].isAvailable);
      return setErrorState((prevState) => ({
        ...prevState,
        TabOne: {
          ...prevState.TabOne,
          Username: {
            Invalid: !usernameCache[username].isAvailable,
            msg: usernameCache[username].msg,
          },
        },
      }));
    }

    try {
      const response = await fetch(
        `https://api.netverses.com/v1/users/check-username?username=${encodeURIComponent(username)}`,
        {
          method: "GET",
        },
      );

      if (response.status === 429) {
        return setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            Additional: {
              Invalid: true,
              msg: t("errors.maxRateLimited"),
            },
          },
        }));
      }

      if (!response.ok) {
        return setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            Additional: {
              Invalid: true,
              msg: t("errors.SignUp.emailAvailability"),
            },
          },
        }));
      }

      const data = await response.json();
      const isAvailable = data.success;

      setIsUsernameAvailable(isAvailable);
      setUsernameCache((prevCache) => ({
        ...prevCache,
        [username]: {
          isAvailable,
          msg: data.isTaken ? t("errors.SignUp.takenUsername") : "",
        },
      }));

      setErrorState((prevState) => ({
        ...prevState,
        TabOne: {
          ...prevState.TabOne,
          Username: {
            Invalid: !isAvailable,
            msg: data.isTaken ? t("errors.SignUp.takenUsername") : "",
          },
        },
      }));
    } catch (error) {
      setIsEmailAvailable(false);
      setErrorState((prevState) => ({
        ...prevState,
        TabOne: {
          ...prevState.TabOne,
          Additional: {
            Invalid: true,
            msg: t("errors.SignUp.usernameAvailability"),
          },
        },
      }));
    }
  }, [username, usernameCache]);

  const refreshPage = () => {
    window.onbeforeunload = null;

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const checkEmailAvailability = useCallback(async () => {
    if (!email) return;
    if (errorState.TabOne.Email["Invalid"]) return;

    if (emailCache[email] !== undefined) {
      setIsEmailAvailable(emailCache[email].isAvailable);
      return setErrorState((prevState) => ({
        ...prevState,
        TabOne: {
          ...prevState.TabOne,
          Email: {
            Invalid: !emailCache[email].isAvailable,
            msg: emailCache[email].msg,
          },
        },
      }));
    }

    try {
      const response = await fetch(
        `https://api.netverses.com/v1/users/check-email?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
        },
      );

      if (response.status === 429) {
        return setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            Additional: {
              Invalid: true,
              msg: t("errors.maxRateLimited"),
            },
          },
        }));
      }

      if (!response.ok) {
        return setErrorState((prevState) => ({
          ...prevState,
          TabOne: {
            ...prevState.TabOne,
            Additional: {
              Invalid: true,
              msg: t("errors.SignUp.emailAvailability"),
            },
          },
        }));
      }

      const data = await response.json();
      const isAvailable = data.success;

      setIsEmailAvailable(isAvailable);

      setEmailCache((prevCache) => ({
        ...prevCache,
        [email]: {
          isAvailable,
          msg: data.isTaken ? t("errors.SignUp.takenEmail") : "",
        },
      }));

      setErrorState((prevState) => ({
        ...prevState,
        TabOne: {
          ...prevState.TabOne,
          Email: {
            Invalid: !isAvailable,
            msg: data.isTaken ? t("errors.SignUp.takenEmail") : "",
          },
        },
      }));
    } catch (error) {
      setIsEmailAvailable(false);
      setErrorState((prevState) => ({
        ...prevState,
        TabOne: {
          ...prevState.TabOne,
          Additional: {
            Invalid: true,
            msg: t("errors.SignUp.emailVerificationIssue"),
          },
        },
      }));
    }
  }, [email, emailCache]);

  const debouncedCheckEmailAvailability = useCallback(
    debounce(checkEmailAvailability, 500),
    [checkEmailAvailability],
  );

  useEffect(() => {
    debouncedCheckEmailAvailability();

    return () => {
      debouncedCheckEmailAvailability.cancel();
    };
  }, [email, debouncedCheckEmailAvailability]);

  const debouncedCheckUsernameAvailability = useCallback(
    debounce(checkUsernameAvailability, 500),
    [checkUsernameAvailability],
  );

  useEffect(() => {
    debouncedCheckUsernameAvailability();

    return () => {
      debouncedCheckUsernameAvailability.cancel();
    };
  }, [username, debouncedCheckUsernameAvailability]);

  useEffect(() => {
    validateUsername(username);
  }, [username]);

  useEffect(() => {
    validateEmail(email);
  }, [email]);

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  useEffect(() => {
    validateConfirmPassword(password, confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    const isFormValid = () => {
      return (
        AgreementChecked &&
        username &&
        email &&
        password &&
        confirmPassword &&
        !errorState.TabOne.Email["Invalid"] &&
        !errorState.TabOne.Password["Invalid"] &&
        !errorState.TabOne.ConfirmPassword["Invalid"] &&
        !errorState.TabOne.Username["Invalid"] &&
        isEmailAvailable &&
        isUsernameAvailable
      );
    };

    setNextDisabled(!isFormValid());
  }, [
    AgreementChecked,
    email,
    username,
    password,
    confirmPassword,
    errorState,
    isEmailAvailable,
    isUsernameAvailable,
  ]);

  async function toggleTab() {
    const setError = (msg, tab) => {
      setErrorState((prevState) => ({
        ...prevState,
        [tab === 1 ? "TabOne" : "TabTwo"]: {
          ...prevState[tab === 1 ? "TabOne" : "TabTwo"],
          [tab === 1 ? "Additional" : "OneTimeCode"]: {
            Invalid: true,
            msg,
          },
        },
      }));
    };

    if (currentTab === 1) {
      try {
        verifyIsBlacklisted(setError);
        checkUserAuthentication(setError);

        const otpRequestFetch = await fetch(
          "https://api.netverses.com/v1/otp/request",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              username,
            }),
            credentials: "include",
          },
        );

        const otpRequestResponse = await otpRequestFetch.json();

        if (!otpRequestFetch.ok) {
          return setError(t("errors.SignUp.UnexpectedError"), 1);
        }

        if (otpRequestFetch.ok && !otpRequestResponse.success) {
          return setError(
            otpRequestResponse.message || t("errors.SignUp.UnexpectedError"),
            1,
          );
        }

        setRequestID(otpRequestResponse.requestId);
        setResendStatus((prevStatus) => ({
          ...prevStatus,
          label: 20,
          onHold: true,
        }));

        const countdownInterval = setInterval(() => {
          setResendStatus((prevStatus) => {
            if (prevStatus["label"] === 1) {
              clearInterval(countdownInterval);
              return { label: t("SignUp.resendCode"), onHold: false };
            }
            return { ...prevStatus, label: prevStatus["label"] - 1 };
          });
        }, 1000);
        setTab(2);
      } catch (error) {
        setError(t("errors.SignUp.processingError"), 1);
      }
    } else if (currentTab === 2) {
      try {
        const confirmOTPFetch = await fetch(
          "https://api.netverses.com/v1/otp/confirm",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
              username,
              code: OTPValue,
              requestId: requestID,
            }),
            credentials: "include",
          },
        );

        const confirmOTPResponse = await confirmOTPFetch.json();

        if (!confirmOTPFetch.ok) {
          return setError(t("errors.SignUp.UnexpectedError"), 2);
        }

        if (confirmOTPFetch.ok && !confirmOTPResponse.success) {
          setError(
            confirmOTPResponse.message ||
              t("errors.SignUp.codeVerificationError"),
            2,
          );
          setInterval(() => {
            setErrorState((prevState) => ({
              ...prevState,
              TabTwo: {
                OneTimeCode: {
                  Invalid: false,
                  msg: "",
                },
              },
            }));
          }, 15 * 1000);
          return;
        }

        refreshPage();

        setTab(3);
      } catch (error) {
        setError(t("errors.SignUp.codeVerificationError"), 3);
      }
    }
  }

  async function handleResend() {
    if (resendStatus["onHold"]) return;

    setResendStatus((prevStatus) => ({
      ...prevStatus,
      label: 30,
      onHold: true,
    }));

    const countdownInterval = setInterval(() => {
      setResendStatus((prevStatus) => {
        if (prevStatus["label"] === 1) {
          clearInterval(countdownInterval);
          return { label: t("SignUp.resendCode"), onHold: false };
        }
        return { ...prevStatus, label: prevStatus["label"] - 1 };
      });
    }, 1000);

    const resendFetch = await fetch(
      "https://api.netverses.com/v1/otp/request",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          username,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    const responseResend = await resendFetch.json();

    if (!resendFetch.ok) {
      return setErrorState((prevState) => ({
        ...prevState,
        TabOne: {
          ...prevState.TabOne,
          Additional: {
            Invalid: true,
            msg: t("errors.SignUp.processingError"),
          },
        },
      }));
    }

    if (responseResend.max) {
      setResendStatus({
        label: t("SignUp.maxAttempts"),
        onHold: true,
      });
    }
  }

  const resetTab = () => {
    setTab(1);
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setAgreementChecked("");
    setEmailCache({});
    setUsernameCache({});
    setNextDisabled(true);
    setErrorState({
      TabOne: {
        Username: {
          Invalid: false,
          msg: "",
        },
        Email: {
          Invalid: false,
          msg: "",
        },
        Password: {
          Invalid: false,
          msg: "",
        },
        ConfirmPassword: {
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
  };

  const toggleEmail = (e) => {
    setEmail(e.target.value);
  };

  const toggleUsername = (e) => {
    setUsername(e.target.value);
  };

  const togglePassword = (e) => {
    setPassword(e.target.value);
  };

  const toggleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const toggleAgreementChecked = (e) => {
    setAgreementChecked(e.target.checked);
  };

  const checkOTP = (otp: string, isEmpty: boolean) => {
    setEmpty(isEmpty);
    setOTPValue(otp);
    if (!Empty) {
      if (OTPValue.length === OTPMaxLength) {
        setNextDisabled(false);
      } else {
        setNextDisabled(true);
      }
    } else {
      setNextDisabled(true);
    }
  };

  useEffect(() => {
    const checkOTPValidity = async () => {
      if (!Empty && OTPValue) {
        setNextDisabled(false);
      } else {
        setNextDisabled(true);
      }
    };

    checkOTPValidity();
  }, [Empty, OTPValue]);

  return (
    <PrimaryModal
      width={512}
      confirmClose={true}
      onClosed={resetTab}
      title={t("SignUp.modalTitle")}
      noConfirmationDialog={isNoConfirmationDialog}
      open={visible}
      setIsOpen={setIsOpen}
      footer={
        <div className="justify-center items-center text-center">
          {currentTab === 1 && (
            <Button
              aria-label={`${t("general.Next")}`}
              type="primary"
              onClick={toggleTab}
              className={`p-4 ${isNextDisabled ? "!bg-violet-900" : "!bg-violet-700"} !border-violet-900 mt-2 hover:!bg-opacity-85 px-16 rounded-full transition-all duration-300`}
              disabled={isNextDisabled}
            >
              <span
                className={`font-medium text-white transition-all duration-300`}
              >
                {t("general.Next")}
              </span>
            </Button>
          )}
          {currentTab === 2 && (
            <div className="justify-center items-center flex flex-row space-x-3">
              <Button
                aria-label={resendStatus["label"]}
                type="primary"
                onClick={handleResend}
                className={
                  "textColor hover:text-white p-4 bg-transparent hover:bg-violet-900 !border-violet-900 mt-2 hover:!bg-opacity-85 px-16 rounded-full"
                }
                disabled={resendStatus["onHold"]}
              >
                <span className="font-medium">{resendStatus["label"]}</span>
              </Button>

              <Button
                aria-label={`${t("general.Confirm")}`}
                type="primary"
                onClick={toggleTab}
                className={`p-4 ${isNextDisabled ? "!bg-violet-900" : "!bg-violet-700"} !border-violet-900 mt-2 hover:!bg-opacity-85 px-16 rounded-full`}
              >
                <span className={`font-medium text-white`}>
                  {t("general.Confirm")}
                </span>
              </Button>
            </div>
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
              <span className="text-sm inter">{t("SignUp.SignUpIntro")}</span>

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
                      maxLength={20}
                      type="text"
                      placeholder={t("general.Username")}
                      ColorSettings={{
                        BorderColor: errorState.TabOne.Username["Invalid"]
                          ? "#EF4444"
                          : colorProperties.borderInputColor
                            ? colorProperties.borderInputColor
                            : "#1677ff",
                      }}
                      prefix={<UserOutlined className="!mr-1" />}
                      onChange={toggleUsername}
                      errorMessage={
                        errorState.TabOne.Username["Invalid"]
                          ? errorState.TabOne.Username["msg"]
                          : ""
                      }
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <PrimaryInput
                      maxLength={64}
                      type="email"
                      placeholder={t("general.Email")}
                      ColorSettings={{
                        BorderColor: errorState.TabOne.Email["Invalid"]
                          ? "#EF4444"
                          : colorProperties.borderInputColor
                            ? colorProperties.borderInputColor
                            : "#1677ff",
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
                        BorderColor: errorState.TabOne.Password["Invalid"]
                          ? "#EF4444"
                          : colorProperties.borderInputColor
                            ? colorProperties.borderInputColor
                            : "#1677ff",
                      }}
                      placeholder={t("general.Password")}
                      type="password"
                      prefix={<LockOutlined className="!mr-1" />}
                      onChange={togglePassword}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      errorMessage={
                        errorState.TabOne.Password["Invalid"]
                          ? errorState.TabOne.Password["msg"]
                          : ""
                      }
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <PrimaryInput
                      maxLength={128}
                      ColorSettings={{
                        BorderColor: errorState.TabOne.ConfirmPassword[
                          "Invalid"
                        ]
                          ? "#EF4444"
                          : colorProperties.borderInputColor
                            ? colorProperties.borderInputColor
                            : "#1677ff",
                      }}
                      placeholder={t("general.confirmPassword")}
                      type="password"
                      prefix={<CheckOutlined className="!mr-1" />}
                      onChange={toggleConfirmPassword}
                      errorMessage={
                        errorState.TabOne.ConfirmPassword["Invalid"]
                          ? errorState.TabOne.ConfirmPassword["msg"]
                          : ""
                      }
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                    />
                  </div>

                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: colorProperties.primaryColor
                          ? colorProperties.primaryColor
                          : "#1677ff",
                      },
                    }}
                  >
                    <div className="flex flex-col space-y-2">
                      <Checkbox
                        id="agreementCheckbox"
                        className="flex"
                        onChange={toggleAgreementChecked}
                      >
                        <span className="text-sm">
                          {t("SignUp.consentConfirmation")}{" "}
                          <a
                            href="/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="!underline hover:text-violet-600"
                          >
                            {t("general.tosLabel")}
                          </a>{" "}
                          {t("general.andLabel")}{" "}
                          <a
                            href="/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="!underline hover:text-violet-600"
                          >
                            {t("general.privacyLabel")}
                          </a>
                          .
                        </span>
                      </Checkbox>
                      {errorState.TabOne.Additional["Invalid"] && (
                        <span className="text-sm text-red-500">
                          {errorState.TabOne.Additional["msg"]}
                        </span>
                      )}
                    </div>
                  </ConfigProvider>
                </ConfigProvider>
              </form>
            </div>
          </motion.div>
        )}

        {emailChangeMenuVisibility && emailChangeAttempt !== 2 && (
          <EmailChange
            visible={emailChangeMenuVisibility}
            countdownLabel={countdownLabel}
            setCountdownLabel={setCountdownLabel}
            attempt={emailChangeAttempt}
            setAttempt={setEmailChangeAttempt}
            emailStates={{ email, setEmail, emailCache }}
            username={username}
            setRequestID={setRequestID}
            errorState={errorState}
            timeSent={timeSent}
            setTimeSent={setTimeSent}
            setVisible={setEmailChangeMenuVisibility}
          />
        )}

        {currentTab === 2 && (
          <motion.div
            key="tab2"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
          >
            <div className="flex flex-col justify-center items-center space-x-3 space-y-4 p-0.5">
              <div className="flex flex-col">
                <span>
                  {t("SignUp.codeConfirmation") + ":"}{" "}
                  <b>{email ? email : "name@example.com"}</b>
                </span>

                {emailChangeAttempt !== 2 && (
                  <a
                    onClick={() => {
                      setEmailChangeMenuVisibility(true);
                    }}
                    className="!text-violet-700 hover:underline w-fit"
                  >
                    Change email
                  </a>
                )}
              </div>

              <div className="w-full max-w-sm text-center">
                <label className="block text-sm">
                  {t("SignUp.enterCode")}{" "}
                </label>
                <OTP
                  onOTPChange={checkOTP}
                  isError={errorState.TabTwo.OneTimeCode["Invalid"]}
                  length={5}
                  inputType="numeric"
                />
                {errorState.TabTwo.OneTimeCode["Invalid"] && (
                  <span className="text-sm text-red-500">
                    {errorState.TabTwo.OneTimeCode["msg"]}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {currentTab === 3 && (
          <motion.div
            key="tab3"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
          >
            <div className="flex flex-col justify-center items-center space-y-4 p-6">
              <span className="icon-[zondicons--checkmark-outline] w-16 h-16 text-green-600" />
              <h2 className="text-xl font-semibold textColor">
                {t("SignUp.accountCreationSuccessful.title")}
              </h2>
              <p className="text-base dark:text-gray-300 lato text-center">
                {t("SignUp.accountCreationSuccessful.description")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PrimaryModal>
  );
};

export default SignUpModal;
