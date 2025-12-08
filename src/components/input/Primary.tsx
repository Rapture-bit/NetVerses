import React from "react";
import { Input, ConfigProvider } from "antd";

interface Props {
  errorMessage?;
  type?;
}

export default function PrimaryInput({
  ColorSettings,
  errorMessage = "",
  infoMessage = "",
  type = "text",
  ...props
}) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBorder: ColorSettings.BorderColor,
          colorPrimary: ColorSettings.BorderColor,
          controlOutline: ColorSettings.BorderColor,
        },
      }}
    >
      {type === "password" && <Input.Password type={type} {...props} />}
      {type !== "password" && <Input type={type} {...props} />}
      {errorMessage && (
        <div className="flex items-center space-x-2 text-red-500 text-sm">
          <span className="roboto font-medium">{errorMessage}</span>
        </div>
      )}

      {infoMessage && (
        <div className="flex items-center space-x-2 text-orange-500">
          <span className="roboto text-sm font-medium">{infoMessage}</span>
        </div>
      )}
    </ConfigProvider>
  );
}
