import React, { useState, useLayoutEffect } from "react";
import { Tooltip } from "antd";

interface Props {
  setVisible: (visible: boolean) => void;
  isVisible: boolean;
}

const Options = ({ setVisible, isVisible }: Props) => {
  const [textColor, setTextColor] = useState<string>("");
  const [deviceResolution, setDeviceResolution] = useState<string>("");

  const getCssVariable = (variable: string): string => {
    const root = document.documentElement;
    return getComputedStyle(root).getPropertyValue(variable).trim();
  };

  useLayoutEffect(() => {
    const updateColors = () => {
      setTextColor(getCssVariable("--text-color"));
    };

    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed right-0 mt-44 h-1/2 ${isVisible ? "-translate-x-10" : "translate-x-24"} border border-neutral-600 bg-neutral-800 rounded-lg transition-transform duration-300`}
    >
      <div className="flex flex-col gap-3 p-3">
        <Tooltip placement="left" title="Hide">
          <button onClick={() => setVisible(false)} className="p-2">
            <span className="icon-[mdi--remove] text-xl p-2" />{" "}
          </button>
        </Tooltip>
        <Tooltip placement="left" title="Disable Notifications">
          <button className="p-2">
            <span className="icon-[mingcute--notification-line] text-xl p-2 hover:icon-[mingcute--notification-off-line]" />
          </button>
        </Tooltip>
        <Tooltip
          placement="left"
          title="Disable End-to-End Encryption (Caution)"
        >
          <button className="p-2">
            <span className="icon-[mdi--protected-outline] hover:icon-[mdi--not-protected-outline] text-xl p-2" />{" "}
          </button>
        </Tooltip>
        <Tooltip placement="left" title="Auto-Delete Messages Period">
          <button className="p-2">
            <span className="icon-[mingcute--time-line] text-xl p-2" />{" "}
          </button>
        </Tooltip>
        <Tooltip placement="left" title="Filter Messages">
          <button className="p-2">
            <span className="icon-[mdi--filter-outline] text-xl p-2" />{" "}
          </button>
        </Tooltip>
        <Tooltip placement="left" title="Set Auto-Messages">
          <button className="p-2">
            <span className="icon-[mage--robot] text-xl p-2" />{" "}
          </button>
        </Tooltip>
        <Tooltip placement="left" title="Show Pinned Messages">
          <button className="p-2">
            <span className="icon-[mynaui--pin] text-xl p-2" />{" "}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Options;
