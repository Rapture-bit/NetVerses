import React, { useState } from "react";
import PageTitle from "@/ui/others/PageTitle";

import TopBar from "@/ui/navigation/TopBar";

export default function HelpLandingPage() {
  return (
    <>
      <PageTitle title="NetVerses ~ Help Center" />
      <div className="flex flex-col ml-4 items-center justify-center min-h-screen p-4 z-10 roboto">
        <TopBar doc={true} />
      </div>
    </>
  );
}
