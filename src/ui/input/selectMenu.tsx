import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  inputText: string;
  data: any;
  selectedOption: any;
  setSelected: any;
  setValid: any;
}

export default function SelectMenu({
  inputText,
  selectedOption,
  setSelected,
  setValid,
  data,
}: Props) {
  const [visibility, setVisibility] = useState<boolean>(true);

  const toggleSelect = (data: any) => {
    setSelected(data);
    setVisibility(false);
    setValid(true);
  };

  useEffect(() => {
    if (inputText.trim() === "") {
      setValid(false);
    }

    let isValid = false;
    data.filter((dataElement: any) => {
      if (
        inputText.trim() !== "" &&
        inputText.toLowerCase() === dataElement.toLowerCase()
      ) {
        isValid = true;
      }
    });

    setValid(isValid);
  }, [inputText, data]);

  useEffect(() => {
    if (inputText.trim() === "") {
      setVisibility(false);
    }

    if (inputText.trim() !== "" && data.length > 0) {
      setVisibility(true);
    }
  }, [inputText, data]);

  return (
    <AnimatePresence>
      {!selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 40 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute z-99 darkerBackgroundColor w-3/4 select-none rounded-lg borderColor border p-2"
        >
          <div className="flex flex-col gap-3 text-sm max-h-60 overflow-y-auto">
            {data.map((dataElement: any, index: any) => {
              return (
                <div className="flex flex-row justify-between pr-2">
                  <span
                    onClick={() => toggleSelect(dataElement)}
                    className="hover:underline cursor-pointer lato"
                    key={index}
                  >
                    {dataElement}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
