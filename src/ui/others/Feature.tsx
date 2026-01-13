import React from "react";

interface FeatureProps {
  IconClass: string;
  title: string;
  description: string;
}

export default function Feature({
  IconClass,
  title,
  description,
}: FeatureProps) {
  return (
    <div
      className={`w-56 flex flex-col space-y-1.5 p-3 justify-start items-start rounded-md transition-transform duration-300 ease-in-out bg-violet-800 text-white hover:scale-105 hover:bg-violet-700`}
      style={{
        boxShadow: "0 6px 12px rgba(76, 29, 149, 0.4)",
      }}
      aria-labelledby={`feature-${title.replace(/\s+/g, "-").toLowerCase()}`}
      role="article"
    >
      <div className="flex items-center space-x-2">
        <span
          className={`${IconClass} shrink-0 w-5 h-5`}
          aria-hidden="true"
        ></span>
        <h3
          id={`feature-${title.replace(/\s+/g, "-").toLowerCase()}`}
          className="font-medium text-base"
        >
          {title}
        </h3>
      </div>
      <p className="mt-1 text-base text-gray-200">{description}</p>
    </div>
  );
}
