import React, { useState, useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

interface CookiesNotifProps {
  visible: boolean;
  setIsOpen: Function;
  [key: string]: any;
}

export default function CookiesNotification({
  visible,
  setIsOpen,
}: CookiesNotifProps) {
  const { colorProperties } = useContext(ThemeContext);

  return (
    <>
      <div></div>
    </>
  );
}
