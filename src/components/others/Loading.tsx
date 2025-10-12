import React from "react";
import { useTranslation } from "react-i18next";

const Loading = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="fixed top-0 bg-violet-600 py-0.5 shadow-md shadow-violet-600 w-full loadingAnimation"></div>
      <div className="backgroundColor min-h-screen min-w-screen flex justify-center items-center textColor">
        <div className="text-center flex flex-col gap-3">
          <span className="text-5xl font-bold">
            Net<span className="text-violet-600">Verses</span>
          </span>
          <p className="mt-2 w-3/4 mx-auto text-lg">
            {t("loading.description")}
          </p>
        </div>
      </div>
    </>
  );
};

export default Loading;
