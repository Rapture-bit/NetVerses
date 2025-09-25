import React, { useState, useCallback, useEffect, useContext } from "react";
import PrimaryModal from "./Primary";
import PrimaryInput from "@/components/input/Primary";
import OTP from "@/components/input/OTP";
import { ThemeContext } from "@/context/ThemeContext";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, ConfigProvider } from "antd";
import debounce from "lodash.debounce";
import { motion, AnimatePresence } from "framer-motion";

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
  const [Empty, setEmpty] = useState<boolean>();
  const [OTPValue, setOTPValue] = useState<string>("");
  const [OTPMaxLength, setOTPMaxLength] = useState<number>(5);
  const [requestID, setRequestID] = useState<string>("");
  const [resendStatus, setResendStatus] = useState<object>({
    onHold: false,
    label: "Resend",
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
              msg: "Provided email is invalid.",
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
              msg: "Username must be at least 4 characters long and contain only letters, numbers, underscores, or dashes.",
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
              msg: "The username must not exceed 20 characters.",
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
              msg: "Password must be at least 8 characters long, include two lowercase letters, and one special character.",
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
              msg: "Passwords must be identical.",
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
              msg: "Max rate limit reached. Please try again later.",
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
              msg: "An error occurred while verifying the availability of the provided email address.",
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
          msg: data.isTaken ? "Username is already taken." : "",
        },
      }));

      setErrorState((prevState) => ({
        ...prevState,
        TabOne: {
          ...prevState.TabOne,
          Username: {
            Invalid: !isAvailable,
            msg: data.isTaken ? "Username is already taken." : "",
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
            msg: "We have encountered issues while checking username availability.",
          },
        },
      }));
    }
  }, [username, usernameCache]);

  const refreshPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 10 * 1000);
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
              msg: "Max rate limit reached. Please try again later.",
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
              msg: "An error occurred while verifying the availability of the provided email address.",
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
          msg: data.isTaken ? "Email is already used." : "",
        },
      }));

      setErrorState((prevState) => ({
        ...prevState,
        TabOne: {
          ...prevState.TabOne,
          Email: {
            Invalid: !isAvailable,
            msg: data.isTaken ? "Email is already used." : "",
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
            msg: "We have encountered issues while checking the email.",
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
        const response = await fetch(
          "https://api.netverses.com/v1/check-country",
          {
            method: "GET",
          },
        );

        if (response.status === 429) {
          return setError("Max rate limit reached. Please try again later.", 1);
        }

        const isBlacklistedResponse = await response.json();

        if (!response.ok) {
          return setError("An error occurred while checking your region.", 1);
        }

        if (!isBlacklistedResponse.success) {
          return setError(
            "Sorry, sign-ups from your region are currently restricted.",
            1,
          );
        }

        const authenticationFetch = await fetch(
          "https://api.netverses.com/v1/auth/status",
          {
            method: "POST",
          },
        );

        if (authenticationFetch.status === 429) {
          return setError("Max rate limit reached. Please try again later.", 1);
        }

        if (!authenticationFetch.ok) {
          return setError(
            "An error occured while verifying authentication.",
            1,
          );
        }

        const isAuthenticatedResponse = await authenticationFetch.json();
        const isAuthenticated = isAuthenticatedResponse.isAuthenticated;

        if (isAuthenticated) {
          return setError(
            "Sorry, account registration is not permitted while a user is logged in.",
            1,
          );
        }

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
          },
        );

        const otpRequestResponse = await otpRequestFetch.json();

        if (!otpRequestFetch.ok) {
          return setError("An error occurred during registration.", 1);
        }

        if (otpRequestFetch.ok && !otpRequestResponse.success) {
          return setError(
            otpRequestResponse.message ||
              "An error occurred during registration.",
            1,
          );
        }

        setRequestID(otpRequestResponse.requestId);
        setTab(2);
      } catch (error) {
        setError("An error occurred while processing your request.", 1);
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
          return setError("An error occurred during registration.", 2);
        }

        if (confirmOTPFetch.ok && !confirmOTPResponse.success) {
          setError(
            confirmOTPResponse.message ||
              "An error occured while verifying the provided code.",
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
        setError("An error occurred while verifying the provided code.", 3);
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
          return { label: "Resend", onHold: false };
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
            msg: "An error occurred while checking your region.",
          },
        },
      }));
    }

    if (responseResend.max) {
      setResendStatus({
        label: "Max Attempts",
        onHold: true,
      });
    }

    if (responseResend.success && responseResend.sent) {
      setResendStatus((prevStatus) => ({
        ...prevStatus,
        label: 30,
        onHold: true,
      }));
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
      title="Registration"
      open={visible}
      setIsOpen={setIsOpen}
      footer={
        <div className="justify-center items-center text-center">
          {currentTab === 1 && (
            <Button
              aria-label="Next"
              type="primary"
              onClick={toggleTab}
              className={`p-4 ${isNextDisabled ? "!bg-violet-900" : "!bg-violet-700"} !border-violet-900 mt-2 hover:!bg-opacity-85 px-16 rounded-full transition-all duration-300`}
              disabled={isNextDisabled}
            >
              <span
                className={`font-medium ${isNextDisabled ? "textColor" : "!text-white"} transition-all duration-300`}
              >
                Next
              </span>
            </Button>
          )}
          {currentTab === 2 && (
            <div className="justify-center items-center flex flex-row space-x-3">
              <Button
                aria-label={resendStatus["label"]}
                type="primary"
                onClick={handleResend}
                className="p-4 bg-transparent hover:bg-violet-900 !border-violet-900 mt-2 hover:!bg-opacity-85 px-16 rounded-full"
                disabled={resendStatus["onHold"]}
              >
                <span className="font-medium">{resendStatus["label"]}</span>
              </Button>

              <Button
                aria-label="Confirm"
                type="primary"
                onClick={toggleTab}
                className={`p-4 ${isNextDisabled ? "!bg-violet-900" : "!bg-violet-700"} !border-violet-900 mt-2 hover:!bg-opacity-85 px-16 rounded-full`}
              >
                <span
                  className={`font-medium ${isNextDisabled ? "textColor" : "text-white"}`}
                >
                  Confirm
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
              <span className="text-sm inter">
                Create an account with NetVerse and begin your journey with us
                today.
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
                      maxLength={20}
                      type="text"
                      placeholder="Username"
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
                      placeholder="Email"
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
                      placeholder="Password"
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
                      placeholder="Confirm Password"
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
                          I agree and consent to the{" "}
                          <a
                            href="/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="!underline hover:text-violet-600"
                          >
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a
                            href="/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="!underline hover:text-violet-600"
                          >
                            Privacy Policy
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

        {currentTab === 2 && (
          <motion.div
            key="tab2"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
          >
            <div className="flex flex-col justify-center items-center space-x-3 space-y-4 p-0.5">
              <span>
                To confirm your account, we have sent a One-Time Code to the
                email address you provided:{" "}
                <b>{email ? email : "name@example.com"}</b>.
              </span>

              <div className="w-full max-w-sm text-center">
                <label className="block text-sm">
                  Enter your one-time code{" "}
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
                Account Successfully Created!
              </h2>
              <p className="text-base dark:text-gray-300 lato text-center">
                Your account has been successfully created with the chosen
                username and email address. You will be redirected shortly.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PrimaryModal>
  );
};

export default SignUpModal;
