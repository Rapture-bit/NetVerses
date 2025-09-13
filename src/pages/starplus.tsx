import React, { useState } from "react";

import { Tooltip } from "antd";
import { Checkbox } from "antd";
import type { CheckboxProps } from "antd";

import Footer from "@/components/navigation/Footer";
import PageTitle from "@/components/others/PageTitle";

export default function StarPlus() {
  const [selected, setSelected] = useState("monthly");

  return (
    <div className="flex flex-col min-h-screen">
      <PageTitle title="NetVerse ~ StarPlus" />
      <div className="relative flex-grow pt-20 md:pt-24 pb-20 md:pb-24 flex flex-col items-center justify-center text-center space-y-4 md:space-y-5 px-4 md:px-10">
        <div className="flex flex-col gap-2 justify-center items-center text-center">
          <span className="font-semibold break-words text-inherit text-6xl dark:text-white rubik">
            Subscribe
          </span>
          <p className="w-1/2 rubik">
            By subscribing, you'll enjoy a better experience full of joy and
            perks. Start posting and receiving the most recent and modern news.
          </p>
        </div>
        <span className="w-1/2 text-3xl font-semibold break-words text-inherit dark:text-white rubik">
          Choose Your Plan
        </span>
        <div className="flex flex-row items-center gap-6 rounded-md p-1 bg-transparent">
          <button
            aria-label="Monthly Plan"
            onClick={() => setSelected("monthly")}
            className={`flex-1 px-5 py-2 text-center font-semibold transition-all rounded-md ${
              selected === "monthly"
                ? "bg-violet-700 text-white"
                : "bg-transparent text-violet-700 hover:bg-violet-700 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            aria-label="Yearly Plan"
            onClick={() => setSelected("yearly")}
            className={`flex-1 px-6 py-2 text-center font-semibold transition-all rounded-md ${
              selected === "yearly"
                ? "bg-violet-700 text-white"
                : "bg-transparent text-violet-700 hover:bg-violet-700 hover:text-white"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
