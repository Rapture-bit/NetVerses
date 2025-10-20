import React from "react";
import { t } from "i18next";

interface Props {
  placeholder?: string;
  height?: string;
  onSearchChange?: (value: string) => void;
}

const SearchBar = ({ placeholder, height, onSearchChange }: Props) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <div className="relative flex-1">
      <input
        type="text"
        placeholder={placeholder || t("input.search")}
        className={`w-full ${
          height ? height : "py-2"
        } pl-10 pr-4 rounded-lg border border-gray-500 placeholder-gray-500 
    bg-transparent focus:border-violet-600 focus:outline-none darkerBackgroundColor transition-colors duration-200`}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchBar;
