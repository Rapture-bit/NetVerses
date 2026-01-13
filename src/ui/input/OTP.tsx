import React, { useEffect, useRef, useState } from "react";
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
  const [currentX, setX] = useState<number>(0);
  const [errorStyle, setErrorStyle] = useState("border-gray-600");

  const inputsRef = useRef<HTMLInputElement[]>([]);

  const isValidInput = (value: string) =>
    inputType === "numeric"
      ? /^\d*$/.test(value)
      : /^[a-zA-Z0-9]*$/.test(value);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (!isValidInput(value)) return;

    const char = value.slice(-1);
    const newOTP = [...otpArray];
    newOTP[index] = char;

    setOTPArray(newOTP);

    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (!otpArray[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData.getData("text").trim();
    if (!isValidInput(pasted)) return;

    const chars = pasted.slice(0, length).split("");
    const newOTP = Array(length).fill("");

    chars.forEach((char, i) => (newOTP[i] = char));
    setOTPArray(newOTP);

    inputsRef.current[Math.min(chars.length, length) - 1]?.focus();
  };

  useEffect(() => {
    const otp = otpArray.join("");
    onOTPChange(otp, otp.length < length);
  }, [otpArray, length, onOTPChange]);

  useEffect(() => {
    if (!isError) return;

    setErrorStyle(
      "border-red-500 text-red-500 focus:border-red-500 focus:text-white",
    );

    setX(-10);
    const t1 = setTimeout(() => setX(10), 50);
    const t2 = setTimeout(() => setX(0), 100);
    const t3 = setTimeout(() => setErrorStyle("border-gray-600"), 250);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isError]);

  if (length <= 0 || length > 8) return null;

  return (
    <div className="flex justify-center items-center p-3">
      <motion.div animate={{ x: currentX }}>
        <div className="flex space-x-2">
          {Array.from({ length }).map((_, i) => (
            <input
              key={i}
              ref={(el) => el && (inputsRef.current[i] = el)}
              id={`otp-input-${i}`}
              type={inputType === "numeric" ? "tel" : "text"}
              inputMode={inputType === "numeric" ? "numeric" : "text"}
              pattern={inputType === "numeric" ? "[0-9]*" : undefined}
              autoComplete="one-time-code"
              maxLength={1}
              value={otpArray[i]}
              aria-label={`OTP digit ${i + 1}`}
              className={`!w-10 !h-10 bg-transparent border ${errorStyle} !rounded-md !text-center !outline-none transition-all`}
              onChange={(e) => handleInputChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default OTP;
