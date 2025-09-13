import React, { useState, useLayoutEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import CookiesNotification from "@/components/modal/BottomMenu/CookiesNotification";
import TopBar from "@/components/navigation/TopBar";
import LeftBar from "@/components/navigation/LeftBar";
import { AuthContext } from "@/context/AuthContext";

export default function DefaultLayout() {
  const { isAuth } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState<string>("");

  useLayoutEffect(() => {
    setCurrentPage(window.location.pathname);
  }, []);

  return (
    <>
      {currentPage !== "/" && <TopBar />}
      {isAuth && currentPage !== "/" && currentPage !== "/privacy" && (
        <LeftBar />
      )}
      <CookiesNotification visible={null} setIsOpen={null} />

      <Outlet />
    </>
  );
}
