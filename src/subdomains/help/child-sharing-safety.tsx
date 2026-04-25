import React, { useState, useEffect, useLayoutEffect, useContext } from "react";

import TopBar from "@/ui/navigation/TopBar";
import { ThemeContext } from "@/context/ThemeContext";
import PageTitle from "@/ui/others/PageTitle";
import Footer from "@/ui/navigation/Footer";
import DocTab from "@/ui/others/document/DocTab";
import { motion } from "framer-motion";

interface Section {
  title: string;
  content: string[];
}

interface Tab {
  title: string;
  subtitles?: string[];
  descriptions?: string[];
  sections?: Section[];
}

export default function childSharingSafety() {
  const [colorTheme, setColorTheme] = useState<string>("");
  const { colorProperties } = useContext(ThemeContext);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <PageTitle title="NetVerses ~ Child Safety & Sharing Guidelines" />
      <div className="relative flex-grow pt-20 md:pt-24 pb-20 md:pb-24 flex flex-row items-center justify-center text-center space-y-4 md:space-y-5 px-4 md:px-10">
        <div className="fixed left-0 top-0 bottom-0 flex border-r-2 borderColor flex-col darkerBackgroundColor h-screen w-1/8 items-start pl-10 pt-20">
          <span>Hello</span>
        </div>
      </div>
      <Footer />
    </div>
  );
}
