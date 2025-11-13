import React, { useState } from "react";
import BottomBar from "@/components/navigation/BottomBar";
import PageTitle from "@/components/others/PageTitle";
import SearchBar from "@/components/input/SearchBar";

import { Tooltip } from "antd";

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("constant");

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <>
      <PageTitle title="NetVerses ~ Explore" />
      <BottomBar />
      <div className="flex flex-col overflow-x-hidden justify-start items-center w-full h-full pt-24 bg-fixed bg-cover bg-center"></div>
    </>
  );
};

export default Explore;
