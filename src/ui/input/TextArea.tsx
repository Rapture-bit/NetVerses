import React, { useState, useEffect, useRef } from "react";
import { emojiMap } from "@/constants/emojiMap";

interface Props {
  allowEmojis?: boolean;
  addText?: string;
  minHeight?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  [key: string]: any;
}

export default function TextArea({
  allowEmojis = true,
  addText,
  minHeight = 40,
  onChange,
  ...props
}: Props) {
  const [text, setText] = useState<string>("");
  const [maxChars, setMaxChars] = useState<number>(500);
  const textAreaRef = useRef(null);

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
    e.target.style.height = `${e.target.scrollHeight}px`;
    const updatedText = replaceEmojiNames(inputValue);
    setText(updatedText);

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <textarea
      style={{ height: `${minHeight}px` }}
      onChange={handleChange}
      value={text}
      dir="ltr"
      {...props}
    />
  );
}
