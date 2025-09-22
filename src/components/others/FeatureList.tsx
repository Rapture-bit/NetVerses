import React from "react";
import Feature from "./Feature";
import { useTranslation } from "react-i18next";

export default function FeatureList() {
  const { t } = useTranslation();

  return (
    <div className="fixed hidden right-0 mr-1 top-0 bottom-0 p-4 lg:grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto">
      <Feature
        title={t("features.contentAgeVerification.title")}
        description={t("features.contentAgeVerification.description")}
        IconClass="icon-[uil--18-plus]"
      />

      <Feature
        title={t("features.advancedPostPrivacy.title")}
        description={t("features.advancedPostPrivacy.description")}
        IconClass="icon-[material-symbols--visibility]"
      />
      <Feature
        title={t("features.livePostTranslation.title")}
        description={t("features.livePostTranslation.description")}
        IconClass="icon-[ph--translate]"
      />
      <Feature
        title={t("features.summarizeButton.title")}
        description={t("features.summarizeButton.description")}
        IconClass="icon-[material-symbols--short-text]"
      />
      <Feature
        title={t("features.ephemeralPosts.title")}
        description={t("features.ephemeralPosts.description")}
        IconClass="icon-[ic--outline-auto-delete]"
      />
      <Feature
        title={t("features.postOwnershipTransfer.title")}
        description={t("features.postOwnershipTransfer.description")}
        IconClass="icon-[tabler--transfer]"
      />
      <Feature
        title={t("features.noSpy.title")}
        description={t("features.noSpy.description")}
        IconClass="icon-[mdi--spy-off]"
      />
      <Feature
        title={t("features.shareNews.title")}
        description={t("features.shareNews.description")}
        IconClass="icon-[ri--news-line]"
      />
    </div>
  );
}
