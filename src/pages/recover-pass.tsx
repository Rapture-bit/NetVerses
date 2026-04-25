import { useState, useContext } from "react";

import { useTranslation } from "react-i18next";

import { ThemeContext } from "@/context/ThemeContext";
import PageTitle from "@/ui/others/PageTitle";
import { Tooltip, ConfigProvider } from "antd";

import PrimaryInput from "@/ui/input/Primary";
import { UserOutlined } from "@ant-design/icons";

interface ErrorState {
  Username: {
    Invalid: boolean;
    msg: string;
  };
}

export default function RecoverPassword() {
  const { t } = useTranslation();

  const toggleBack = () => {};

  const { colorProperties } = useContext(ThemeContext);
  const [errorState, setErrorState] = useState<ErrorState>({
    Username: {
      Invalid: false,
      msg: "",
    },
  });

  const [email, setEmail] = useState<string>("");

  const toggleEmail = (e) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <PageTitle title="NetVerses ~ Password Recovery" />
      <div className="flex space-y-3 flex-col overflow-x-hidden justify-start items-center w-full h-full pt-24 bg-fixed bg-cover bg-center">
        <div className="flex flex-col overflow-x-hidden space-y-5 items-center w-full roboto">
          <div className="flex flex-row border borderColor justify-between gap-5 p-4 sm:pl-5 sm:py-4 rounded-md mx-auto sm:mx-0 w-1/2 darkerBackgroundColor">
            <Tooltip mouseLeaveDelay={0} title={"Back"} placement={"bottom"}>
              <button
                aria-label="Go Back"
                onClick={toggleBack}
                className="w-5 h-5"
              >
                <span className="icon-[eva--arrow-back-outline] w-5 h-5"></span>
              </button>
            </Tooltip>
            <span className="font-medium">Recovery</span>
          </div>
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
          <div className="flex flex-col border borderColor space-y-3 justify-between gap-5 p-4 sm:pl-5 sm:py-4 rounded-md mx-auto sm:mx-0 w-1/2 darkerBackgroundColor">
            <div className="flex flex-row gap-5 justify-between">
              <span>
                Please verify your email, username, or phone number to continue.
              </span>
              <PrimaryInput
                maxLength={128}
                type="text"
                placeholder={"Account Identifier"}
                ColorSettings={{
                  BorderColor: errorState.Username["Invalid"]
                    ? "#EF4444"
                    : colorProperties.borderInputColor
                      ? colorProperties.borderInputColor
                      : "#1677ff",
                }}
                prefix={<UserOutlined className="mr-1!" />}
                onChange={toggleEmail}
                errorMessage={
                  errorState.Username["Invalid"]
                    ? errorState.Username["msg"]
                    : ""
                }
              />
            </div>
            <div className="flex justify-center">
              <span className="font-bold text-gray-500 dark:text-gray-400">
                Or
              </span>
            </div>
            <div className="flex flex-row gap-5 justify-between">
              <span>
                Use your{" "}
                <a
                  href="#"
                  className="underline text-purple-600 hover:text-purple-500 duration-300 transition-all"
                >
                  e-ID
                </a>{" "}
                to verify and continue
              </span>
              <PrimaryInput
                maxLength={128}
                type="text"
                placeholder={"Account Identifier"}
                ColorSettings={{
                  BorderColor: errorState.Username["Invalid"]
                    ? "#EF4444"
                    : colorProperties.borderInputColor
                      ? colorProperties.borderInputColor
                      : "#1677ff",
                }}
                prefix={<UserOutlined className="mr-1!" />}
                onChange={toggleEmail}
                errorMessage={
                  errorState.Username["Invalid"]
                    ? errorState.Username["msg"]
                    : ""
                }
              />
            </div>
          </div>
        </ConfigProvider>
      </div>
    </>
  );
}
