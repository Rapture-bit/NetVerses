import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import useDeviceType from "@/hooks/useDeviceType";

export default function BottomBar() {
  const { deviceType, isTouchScreen } = useDeviceType();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) < 8) return;

      if (delta > 0 && currentScrollY > 120) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (deviceType !== "mobile" || !isTouchScreen) return null;

  const NavButton = ({ label, path, icon, center }) => (
    <button
      onClick={() => navigate(path)}
      aria-label={label}
      className={`relative flex flex-col items-center gap-1 transition-colors p-1 ${
        isActive(path)
          ? "text-violet-500"
          : "text-neutral-500 dark:text-neutral-400"
      }`}
    >
      <span className="flex items-center justify-center w-6 h-6">{icon}</span>

      <span className="text-xs leading-none">{label}</span>

      {isActive(path) && !center && (
        <span className="absolute -top-2 w-full h-0.5 bg-violet-500 rounded-full" />
      )}
    </button>
  );

  return (
    <div
      className={`fixed bottom-0 left-0 w-full z-50 transition-transform duration-300 ease-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex justify-center items-center darkerBackgroundColor shadow-lg px-4 py-2">
        <div className="flex gap-6 justify-center items-center tablet:hidden">
          <NavButton
            label="Home"
            path="/"
            icon={<span className="icon-[teenyicons--home-outline] w-4 h-4" />}
          />

          <NavButton
            label="Messages"
            path="/my/messages"
            icon={<span className="icon-[tabler--message] w-5 h-5" />}
          />

          <button
            onClick={() => navigate("/verse")}
            aria-label="Send"
            className="rounded-full bg-violet-700 p-3 flex items-center justify-center"
          >
            <span className="icon-[mingcute--send-line] text-white w-6 h-6" />
          </button>

          <NavButton
            label="StarPlus"
            path="/starplus"
            icon={<span className="icon-[ph--star-bold] w-5 h-5" />}
          />

          <NavButton
            label="Profile"
            path="/xenon"
            icon={<span className="icon-[gg--profile] w-5 h-5" />}
          />
        </div>
      </div>
    </div>
  );
}
