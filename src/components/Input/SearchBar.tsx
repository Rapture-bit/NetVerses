import React from "react";

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
        placeholder={placeholder || "Search"}
        className={`w-full ${height ? height : "py-1.5"} pl-10 pr-4 rounded-lg border border-gray-500 placeholder-gray-500 focus:outline-none darkerBackgroundColor`}
        onChange={handleSearchChange}
      />
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-[ic--sharp-search] w-5 h-5 text-gray-500"></span>
    </div>
  );
};

export default SearchBar;
