import React, { useState, useEffect } from "react";
import useDeviceType from "@/hooks/useDeviceType";

export default function BottomBar() {
  const { deviceType, isTouchScreen } = useDeviceType();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  if (deviceType !== "mobile" || !isTouchScreen) {
    return null;
  }

  return (
    <div
      className={`fixed flex flex-row justify-center items-center dark:text-white text-black bottom-0 p-2 w-full z-50 darkerBackgroundColor shadow-lg shadow-white px-4 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex flex-row mobile-s:gap-3 mobile-m:gap-6 mobile-l:gap-8 tablet:hidden justify-center items-center text-center">
        <button
          onClick={() => (window.location.href = "/")}
          aria-label="Home"
          className="flex flex-col justify-center items-center gap-1 p-1"
        >
          <span className="icon-[teenyicons--home-outline] w-4 h-4"></span>
          <span className="text-xs">Home</span>
        </button>
        <button
          onClick={() => (window.location.href = "/my/messages")}
          aria-label="Messages"
          className="flex flex-col justify-center items-center gap-1 p-1"
        >
          <span className="icon-[tabler--message] w-5 h-5"></span>
          <span className="text-xs">Messages</span>
        </button>
        <button
          onClick={() => (window.location.href = "/verse")}
          aria-label="Send"
          className="rounded-full bg-violet-700 p-3 flex justify-center items-center"
        >
          <span className="icon-[mingcute--send-line] text-white w-6 h-6"></span>
        </button>
        <button
          onClick={() => (window.location.href = "/starplus")}
          aria-label="StarPlus"
          className="flex flex-col justify-center items-center gap-1 p-1"
        >
          <span className="icon-[ph--star-bold] w-5 h-5"></span>
          <span className="text-xs">StarPlus</span>
        </button>
        <button
          onClick={() => (window.location.href = "/xenon")}
          aria-label="Profile"
          className="flex flex-col justify-center items-center gap-1 p-1"
        >
          <span className="icon-[gg--profile] w-5 h-5"></span>
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
}
