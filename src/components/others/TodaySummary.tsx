import React, { useState } from "react";
import { Tooltip } from "antd";

type Props = {};

const TodaySummary = (props: Props) => {
  const [AreSummariesToggled, ToggleSummaries] = useState<boolean>(false);

  const toggleSummaries = () => {
    ToggleSummaries(!AreSummariesToggled);
  };

  return (
    <>
      <div className="flex flex-col bg-violet-800 p-4 rounded-lg mx-auto sm:mx-0 w-full sm:w-3/4 lg:w-2/3 xl:w-1/2">
        <div className="flex items-center justify-between gap-3 text-white">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="icon-[ooui--text-summary-ltr] text-xl"></span>
              <h2 className="text-lg font-medium">News Summaries</h2>
            </div>
            <h3 className="text-sm ml-5">12th February 2025</h3>
          </div>
          <Tooltip
            placement="bottom"
            title={AreSummariesToggled ? "Hide Summaries" : "Show Summaries"}
          >
            <button
              onClick={toggleSummaries}
              className="items-center justify-center transition-all duration-300"
            >
              <span
                className={
                  !AreSummariesToggled
                    ? "icon-[bytesize--chevron-bottom]"
                    : "icon-[bytesize--chevron-top]"
                }
              ></span>
            </button>
          </Tooltip>
        </div>
      </div>

      {AreSummariesToggled && (
        <div className="flex flex-col transition-all duration-300 bg-violet-800 p-6 rounded-lg mx-auto sm:mx-0 w-full sm:w-3/4 lg:w-2/3 xl:w-1/2 mt-5">
          <h3 className="text-white font-semibold text-lg mb-3">Key Issues:</h3>
          <ul className="space-y-2 text-white list-disc pl-6">
            <li className="underline underline-offset-4">
              Misinformation spread
            </li>
            <li className="underline underline-offset-4">Leadership Issues</li>
            <li className="underline underline-offset-4">
              AI taking over 30% of jobs
            </li>
            <li className="underline underline-offset-4">
              AI taking over 30% of jobs
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default TodaySummary;
