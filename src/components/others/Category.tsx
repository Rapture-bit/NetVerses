import React from "react";

interface Props {
  categoryName: string;
  categoryId: string;
  selected: boolean;
  onSelect: (id: string) => void;
}

const Category: React.FC<Props> = ({
  categoryName,
  categoryId,
  selected,
  onSelect,
}) => {
  return (
    <button
      id={categoryId}
      className={`rounded-full hover:brightness-125 duration-300 transition-all select-none text-sm py-1.5 px-3 whitespace-nowrap ${
        selected ? "bg-violet-600 text-white" : "darkerBackgroundColor"
      }`}
      onClick={() => onSelect(categoryId)}
      aria-selected={selected}
      role="option"
    >
      {categoryName}
    </button>
  );
};

export default Category;
