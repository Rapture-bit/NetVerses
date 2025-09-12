import React, { Children, cloneElement } from "react";

interface Props {
  children: React.ReactNode;
  selected: string;
  onSelect: (categoryId: string) => void;
}

const CategoriesContainer = ({ children, selected, onSelect }: Props) => {
  return (
    <div className="relative flex flex-col sm:pl-5 sm:py-4 rounded-md mx-4 sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2">
      <div className="absolute -top-1 left-0 flex flex-row overflow-x-auto space-x-4 scrollbar-hide">
        {Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return cloneElement(child, {
              selected: selected === child.props.categoryId,
              onSelect: onSelect,
            });
          }
          return child;
        })}
      </div>
    </div>
  );
};

export default CategoriesContainer;
