import React, { useState } from "react";
import PageTitle from "@/components/Others/PageTitle";
import TopBar from "@/components/Navigation/TopBar";
import LeftBar from "@/components/Navigation/LeftBar";
import RightBar from "@/components/Navigation/RightBar";
import BottomBar from "@/components/Navigation/BottomBar";

const Clubs = () => {
  const [topNews, setTopNews] = useState<object[]>([
    {
      title: "Breaking News 1",
      description: "This is the description for breaking news 1.",
      category: "Business",
    },
    {
      title: "Breaking News 2",
      description: "This is the description for breaking news 2.",
      category: "Technology",
    },
    {
      title: "Breaking News 3",
      description: "This is the description for breaking news 3.",
      category: "Health",
    },
  ]);

  return (
    <>
      <PageTitle title="NetVerse ~ Clubs" />
      <TopBar />
      <LeftBar />
      <RightBar news={topNews} />
      <BottomBar />
      <div className="flex flex-col">
        <div></div>
        <div className="flex flex-row"></div>
      </div>
    </>
  );
};

export default Clubs;
