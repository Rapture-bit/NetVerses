import React, { useState, useEffect, useLayoutEffect } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

interface DropdownProps {
  contentArray: any[];
  openSide: string;
  size: string;
  TWStyling?: string;
  primaryOption: string;
}

export default function Dropdown({
  contentArray,
  primaryOption,
  openSide,
  size,
  TWStyling,
}: DropdownProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    primaryOption,
  );
  const [textSize, setTextSize] = useState<string>(size);

  return (
    <button className={`text-${textSize} space-x-1`}>
      <span className={`text-${textSize}`}>{selectedOption}</span>
      {openSide == "up" && <UpOutlined />}
      {openSide == "down" && <DownOutlined />}
    </button>
  );
}
