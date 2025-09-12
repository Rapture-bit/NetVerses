import { useState, useEffect } from "react";

const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState("desktop");
  const [isTouchScreen, setIsTouchScreen] = useState(false);
  const [hasMouseOrKeyboard, setHasMouseOrKeyboard] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setDeviceType("mobile");
      } else if (width >= 768 && width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }

      detectTouchScreen();
      detectMouseOrKeyboard();
    };

    const detectTouchScreen = () => {
      const touchScreen =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsTouchScreen(touchScreen);
    };

    const detectMouseOrKeyboard = () => {
      const hasMouse = window.matchMedia("(pointer: fine)").matches;
      const hasKeyboard = "getGamepads" in navigator;

      setHasMouseOrKeyboard(hasMouse || hasKeyboard);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobileTouchOnly =
    deviceType === "mobile" && isTouchScreen && !hasMouseOrKeyboard;

  return { deviceType, isTouchScreen, hasMouseOrKeyboard, isMobileTouchOnly };
};

export default useDeviceType;
