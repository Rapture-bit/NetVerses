import React, { useState, useLayoutEffect, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import Cookies from "js-cookie";

import CookiesNotification from "@/components/modal/BottomMenu/CookiesNotification";
import TopBar from "@/components/navigation/TopBar";
import LeftBar from "@/components/navigation/LeftBar";
import RightBar from "@/components/navigation/RightBar";

import { AuthContext } from "@/context/AuthContext";

const GA_TRACKING_ID = "G-EDV3RGP46V";
const loadGA = () => {
  if (document.querySelector(`script[src*="${GA_TRACKING_ID}"]`)) return;

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.body.appendChild(script);

  const loadingScript = document.createElement("script");
  loadingScript.textContent = `
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-EDV3RGP46V");
`;
  document.body.appendChild(loadingScript);
};

export default function DefaultLayout() {
  const { isAuth } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState<string>("");
  const [cookiesVisibility, setCookiesVisibility] = useState<boolean | null>(
    null,
  );
  const [consentValue, setConsentValue] = useState<boolean>(false);

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

  useEffect(() => {
    if (consentValue) {
      Cookies.set("consentToCookies", "true", { expires: 365, path: "/" });
      loadGA();
    }
  }, [consentValue]);

  useEffect(() => {
    if (!Cookies.get("consentToCookies")) {
      setCookiesVisibility(true);
    } else {
      loadGA();
      setCookiesVisibility(false);
    }
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
      {currentPage !== "/privacy" && (
        <CookiesNotification
          showNotif={cookiesVisibility}
          agreedWithCookies={consentValue}
          setAgreedWithCookies={setConsentValue}
          setNotifVisibility={setCookiesVisibility}
        />
      )}

      <Outlet />
    </>
  );
}
