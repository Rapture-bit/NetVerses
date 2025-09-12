import React, { useState } from "react";
import TopBar from "@/components/Navigation/TopBar";
import LeftBar from "@/components/Navigation/LeftBar";
import RightBar from "@/components/Navigation/RightBar";
import BottomBar from "@/components/Navigation/BottomBar";
import PageTitle from "@/components/Others/PageTitle";
import SearchBar from "@/components/Input/SearchBar";
import CategoriesContainer from "@/components/Others/CategoriesContainer";
import Category from "@/components/Others/Category";

import { Tooltip } from "antd";

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("constant");

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

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <>
      <PageTitle title="NetVerse ~ Explore" />
      <TopBar />
      <RightBar news={topNews} />
      <LeftBar />
      <BottomBar />
      <div className="flex flex-col overflow-x-hidden justify-start items-center w-full h-full pt-24 bg-fixed bg-cover bg-center">
        <div className="flex flex-col overflow-x-hidden space-y-5 items-center w-full roboto">
          <div className="relative flex flex-col p-4 sm:p-4 rounded-md mx-4 sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor">
            <div className="flex flex-row gap-3 justify-between items-center">
              <div className="relative flex-1">
                <SearchBar aria-label="Search" />
                <span
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-[ic--sharp-search] w-5 h-5 text-gray-500"
                  aria-hidden="true"
                ></span>
              </div>
              <Tooltip placement="bottom" title="Filter">
                <button
                  className="flex justify-center items-center p-2"
                  aria-label="Filter results"
                  type="button"
                >
                  <span
                    className="icon-[mdi--filter-outline] w-5 h-5"
                    aria-hidden="true"
                  ></span>
                </button>
              </Tooltip>
            </div>
          </div>
          <CategoriesContainer
            onSelect={handleSelectCategory}
            selected={selectedCategory}
          >
            <Category
              categoryName={"All"}
              selected={selectedCategory}
              onSelect={handleSelectCategory}
              categoryId={"constant"}
            />
            <Category
              categoryName={"Category I"}
              selected={selectedCategory}
              onSelect={handleSelectCategory}
              categoryId={"1"}
            />
            <Category
              categoryName={"Category II"}
              selected={selectedCategory}
              onSelect={handleSelectCategory}
              categoryId={"2"}
            />
            <Category
              categoryName={"Category III"}
              selected={selectedCategory}
              onSelect={handleSelectCategory}
              categoryId={"3"}
            />
            <Category
              categoryName={"Category IV"}
              selected={selectedCategory}
              onSelect={handleSelectCategory}
              categoryId={"4"}
            />
            <Category
              categoryName={"Category V"}
              selected={selectedCategory}
              onSelect={handleSelectCategory}
              categoryId={"5"}
            />
          </CategoriesContainer>
        </div>
      </div>
    </>
  );
};

export default Explore;
