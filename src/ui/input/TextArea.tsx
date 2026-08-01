import React, { useState, useEffect, useRef } from "react";
import { emojiMap } from "@/constants/emojiMap";

interface Props {
  allowEmojis?: boolean;
  addText?: string;
  minHeight?: number;
  maxHeight?: number;
  noTextAdded?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  [key: string]: any;
}

export default function TextArea({
  allowEmojis = true,
  addText,
  minHeight = 40,
  maxHeight = 300,
  noTextAdded = false,
  onChange,
  ...props
}: Props) {
  const [text, setText] = useState<string>("");
  const [maxChars, setMaxChars] = useState<number>(500);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (addText) {
      setText((prev) => prev + addText);
    }
  }, [addText]);

  const replaceEmojiNames = (text: string) => {
    return text.replace(/:([^:\s]+):/g, (match, p1) => {
      return emojiMap[p1] || match;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;

    e.target.style.height = "auto";

    const newHeight = Math.min(e.target.scrollHeight, maxHeight);
    e.target.style.height = `${newHeight}px`;

    e.target.style.overflowY =
      e.target.scrollHeight > maxHeight ? "auto" : "hidden";

    const updatedText = replaceEmojiNames(inputValue);
    setText(updatedText);

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <textarea
      ref={textAreaRef}
      style={{
        height: `${minHeight}px`,
        maxHeight: `${maxHeight}px`,
        overflowY: "hidden",
        resize: "none",
      }}
      onChange={handleChange}
      {...(!noTextAdded && { value: text })}
      dir="ltr"
      {...props}
    />
  );
}
