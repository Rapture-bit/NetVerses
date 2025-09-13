import React, { useState, useLayoutEffect, useContext } from "react";
import { Outlet } from "react-router-dom";

import CookiesNotification from "@/components/modal/BottomMenu/CookiesNotification";
import TopBar from "@/components/navigation/TopBar";
import LeftBar from "@/components/navigation/LeftBar";
import RightBar from "@/components/navigation/RightBar";

import { AuthContext } from "@/context/AuthContext";

export default function DefaultLayout() {
  const { isAuth } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState<string>("");

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

  useLayoutEffect(() => {
    setCurrentPage(window.location.pathname);
  }, []);

  return (
    <>
      {currentPage !== "/" && <TopBar />}
      {isAuth && currentPage !== "/" && currentPage !== "/privacy" && (
        <LeftBar />
      )}
      {isAuth && currentPage !== "/" && currentPage !== "/privacy" && (
        <RightBar news={topNews} />
      )}
      <CookiesNotification visible={null} setIsOpen={null} />

      <Outlet />
    </>
  );
}
