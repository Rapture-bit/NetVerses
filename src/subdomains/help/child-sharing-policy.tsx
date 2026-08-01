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

  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar doc={true} />
      <PageTitle title="NetVerses ~ Child Safety & Sharing Guidelines" />
      <div className="relative flex-grow pt-20 md:pt-24 pb-20 md:pb-24 flex flex-col items-center justify-center text-center space-y-4 md:space-y-5 px-4 md:px-10">
        {activeTab === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="w-full max-w-4xl">
              <div className="flex flex-col space-y-2 md:space-y-3 lg:space-y-4 p-4 md:p-6 lg:p-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold rubik tracking-wide">
                  <span>Net</span>
                  <span className="text-purple-600">Verses</span>
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl textColor font-semibold rubik tracking-tight">
                  Child Safety & <br />
                  Sharing Guidelines
                </h2>
                <h3 className="text-lg md:text-xl lg:text-2xl text-gray-500 font-medium rubik tracking-normal">
                  Effective: May 5th, 2026
                </h3>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}
