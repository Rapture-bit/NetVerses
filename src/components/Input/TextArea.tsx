import React, { useState, useEffect } from "react";
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

  const formatText = (text: string) => {
    text = text.replace(/__([^_]+?)__/g, "<u>$1</u>");
    text = text.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>");
    text = text.replace(/~~([^~]+?)~~/g, "<del>$1</del>");
    text = text.replace(/```(.*?)```/g, "<pre><code>$1</code></pre>");
    text = text.replace(/`(.*?)`/g, "<code>$1</code>");

    return text;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    const updatedText = replaceEmojiNames(inputValue);
    const formattedText = formatText(updatedText);
    setText(formattedText);

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
