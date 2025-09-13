import React, { useState, useContext } from "react";
import { ThemeContext } from "@/context/themeContext";

export default function CookiesNotification({ visible, setIsOpen }) {
  const { colorProperties } = useContext(ThemeContext);

  return (
    <>
      <div></div>
    </>
  );
}
