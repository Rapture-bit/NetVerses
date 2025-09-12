import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface OTPTypes {
  onOTPChange: (otp: string, isEmpty: boolean) => void;
  length: number;
  isError: boolean;
  inputType: "numeric" | "alphanumeric";
}

const OTP: React.FC<OTPTypes> = ({
  length,
  onOTPChange,
  isError,
  inputType,
}) => {
  const [otpArray, setOTPArray] = useState<string[]>(Array(length).fill(""));
  const [currentX, setX] = useState<number>();
  const [errorStyle, setErrorStyle] = useState<string>("border-gray-600");

  const isValidInput = (value: string) => {
    if (inputType === "numeric") {
      return /^\d*$/.test(value);
    }
    return /^[a-zA-Z0-9]*$/.test(value);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = event.target.value;

    if (value.length > 1 || !isValidInput(value)) return;

    const newOTPArray = [...otpArray];
    newOTPArray[index] = value;

    setOTPArray(newOTPArray);

    if (value && index < length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  useEffect(() => {
    const otpString = otpArray.join("");
    const isNotFull = otpString.length < length;

    onOTPChange(otpString, isNotFull);
  }, [otpArray, length, onOTPChange]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !otpArray[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  if (length <= 0 || length > 8) {
    return null;
  }

  useEffect(() => {
    if (!isError) {
      return;
    }

    setX(-10);
    setErrorStyle(
      "border-red-500 text-red-500 focus:border-red-500 focus:text-white",
    );

    const timeout = setTimeout(() => {
      setX(10);

      const resetTimeout = setTimeout(() => {
        setX(0);
      }, 50);

      const finalTimeout = setTimeout(() => {
        setErrorStyle("border-gray-600");
      }, 200);

      return () => (clearTimeout(resetTimeout), clearTimeout(finalTimeout));
    }, 50);
    return () => clearTimeout(timeout);
  }, [isError]);

  return (
    <div className="flex flex-col justify-center items-center space-y-3 p-3 roboto">
      <motion.div
        animate={{
          x: currentX,
        }}
      >
        <div className="flex flex-row space-x-2 justify-center items-center roboto">
          {Array.from({ length }).map((_, i) => (
            <input
              key={i}
              id={`otp-input-${i}`}
              type="text"
              className={`w-10 h-10 bg-transparent border ${errorStyle} focus:border-gray-500 transition-all duration-300 text-center rounded-md outline-none`}
              maxLength={1}
              value={otpArray[i]}
              autoComplete="off"
              onChange={(e) => handleInputChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default OTP;
