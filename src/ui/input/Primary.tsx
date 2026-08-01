import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { Input, ConfigProvider } from "antd";
import SelectMenu from "@/ui/input/selectMenu";

interface PrimaryInputProps {
  ColorSettings: any;
  errorMessage?: string;
  infoMessage?: string;
  type?: string;
  disabled?: boolean;
  data?: any[];
  toggleInputComplete?: (isComplete: boolean, selectedOption: string) => void;
}

export default function PrimaryInput({
  ColorSettings,
  errorMessage = "",
  infoMessage = "",
  type = "text",
  disabled = false,
  data,
  toggleInputComplete,
  ...props
}: PrimaryInputProps) {
  const inputRef = useRef(null);

  const [value, setValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const [selectedOption, setSelected] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [showSelectMenu, setShowSelectMenu] = useState<boolean>(false);

  const [valid, setValid] = useState<boolean>(false);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.currentTarget.value);
      setInputText(e.currentTarget.value);
      setSelected("");
    },
    [],
  );

  useEffect(() => {
    toggleInputComplete && toggleInputComplete(valid, selectedOption);
  }, [valid]);

  useEffect(() => {
    if (selectedOption) {
      setInputText(selectedOption);
    } else {
      setInputText(value);
    }
  }, [selectedOption, value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  const relevantSearches = useMemo(() => {
    if (!data || !debouncedValue.trim()) return [];

    const keywords = debouncedValue.toLowerCase().trim().split(/\s+/);

    return data.filter((element: string) => {
      const words = element.toLowerCase().split(/\W+/);

      return keywords.every((keyword) =>
        words.some((word) => word.startsWith(keyword)),
      );
    });
  }, [data, debouncedValue]);

  useEffect(() => {
    if (relevantSearches.length > 0) {
      setShowSelectMenu(true);
    }
  }, [relevantSearches]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBorder: ColorSettings.BorderColor,
          colorText: ColorSettings.textColor,
          colorPrimary: ColorSettings.BorderColor,
          controlOutline: ColorSettings.BorderColor,
        },
      }}
    >
      {type === "selection" && (
        <>
          <Input
            ref={inputRef}
            onInput={onInputChange}
            value={inputText}
            type="text"
            className={`!bg-transparent ${disabled ? "cursor-not-allowed! hover:border-transparent" : ""}`}
            {...props}
          />

          {showSelectMenu && (
            <SelectMenu
              inputText={inputText}
              selectedOption={selectedOption}
              setSelected={setSelected}
              setValid={setValid}
              data={relevantSearches}
            />
          )}
        </>
      )}
      {type === "password" && (
        <Input.Password className="!bg-transparent" type={type} {...props} />
      )}
      {type !== "password" && type !== "selection" && (
        <Input
          type={type}
          className={`!bg-transparent ${disabled ? "cursor-not-allowed! hover:border-transparent" : ""}`}
          {...props}
        />
      )}
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
