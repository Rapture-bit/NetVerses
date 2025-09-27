import React, { useState, useLayoutEffect, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import Cookies from "js-cookie";

import CookiesNotification from "@/components/modal/BottomMenu/CookiesNotification";
import TopBar from "@/components/navigation/TopBar";
import LeftBar from "@/components/navigation/LeftBar";
import RightBar from "@/components/navigation/RightBar";

import { AuthContext } from "@/context/AuthContext";

const GA_TRACKING_ID = "G-EDV3RGP46V"; // [!] GA_TRACKING_ID

export default function DefaultLayout() {
  const { isAuth } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState<string>("");
  const [cookiesVisibility, setCookiesVisibility] = useState<boolean | null>(
    null,
  );
  const [consentValue, setConsentValue] = useState<boolean>(false);
  const [nonce, setNonce] = useState<string | null>(null);

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

  const loadGA = () => {
    if (!nonce) return;
    if (document.querySelector(`script[src*="${GA_TRACKING_ID}"]`)) return;
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    script.setAttribute("nonce", nonce);
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    const loadingScript = document.createElement("script");
    loadingScript.src = "https://assets.netverses.com/scripts/ga.js";
    loadingScript.setAttribute("nonce", nonce);
    loadingScript.type = "text/javascript";
    document.body.appendChild(loadingScript);
  };

  useLayoutEffect(() => {
    setCurrentPage(window.location.pathname);
  }, []);

  useEffect(() => {
    if ((document as any).querySelector(`meta[name="csp-nonce"]`)) {
      setNonce(
        (document as any).querySelector(`meta[name="csp-nonce"]`).content,
      );
    }
  }, []);

  useEffect(() => {
    if (consentValue) {
      if (nonce) {
        Cookies.set("consentToCookies", "true", { expires: 365, path: "/" });
        loadGA();
      }
    }
  }, [consentValue, nonce]);

  useEffect(() => {
    if (!Cookies.get("consentToCookies")) {
      setCookiesVisibility(true);
    } else {
      if (nonce) {
        loadGA();
      }
      setCookiesVisibility(false);
    }
  }, [nonce]);

  return (
    <>
      {isAuth && <TopBar />}
      {!isAuth && currentPage !== "/" && <TopBar />}
      {isAuth && currentPage !== "/privacy" && currentPage !== "/messages" && (
        <LeftBar />
      )}
      {isAuth && currentPage !== "/privacy" && currentPage !== "/messages" && (
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
