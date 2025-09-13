import React from "react";
import { Input, ConfigProvider } from "antd";

interface Props {
  errorMessage?;
  type?;
}

export default function PrimaryInput({
  ColorSettings,
  errorMessage = "",
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
        <div className="flex items-center space-x-2 text-red-500">
          <span className="roboto text-sm font-medium">{errorMessage}</span>
        </div>
      )}
    </ConfigProvider>
  );
}
