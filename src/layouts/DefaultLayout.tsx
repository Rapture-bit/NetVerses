import React, { useState, useLayoutEffect, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import Cookies from "js-cookie";

import CookiesConsent from "@/components/modal/BottomMenu/CookiesConsent";
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
  const [consentedToCookies, setConsentedToCookies] = useState<String[]>([]);
  const [nonce, setNonce] = useState<string | null>(null);

  const findElement = (cookieName: string): boolean => {
    return consentedToCookies.includes(cookieName);
  };

  const [topArticles, setTopArticles] = useState<object[]>([
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
    loadingScript.src = "https://cdn.netverses.com/scripts/ga.js";
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
    if (Cookies.get("cookiesConsent")) {
      const consentData = JSON.parse(Cookies.get("cookiesConsent"));
      const hasAdvertisingConsent =
        consentData.preferences.advertising === true;

      if (hasAdvertisingConsent) {
        return loadGA();
      }
    }

    const allCookies = Cookies.get();
    console.log(allCookies);
    Object.keys(allCookies).forEach((key) => {
      if (key.startsWith("_ga")) {
        console.log("Found1");
        Cookies.remove(key);
      }
    });
  }, [consentedToCookies, nonce]);

  useEffect(() => {
    if (!Cookies.get("cookiesConsent")) {
      setCookiesVisibility(true);
    } else {
      const consentData = JSON.parse(Cookies.get("cookiesConsent"));
      const hasFunctionalConsent = consentData.preferences.functional === true;
      const hasAdvertisingConsent =
        consentData.preferences.advertising === true;
      if (hasAdvertisingConsent) {
        console.log("Advertising consent found");
        setCookiesVisibility(false);
        return loadGA();
      }

      const allCookies = Cookies.get();
      console.log(allCookies);

      Object.keys(allCookies).forEach((key) => {
        if (key.startsWith("_ga")) {
          console.log("Found!");
          Cookies.remove(key);
        }
      });

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
        <RightBar articles={topArticles} />
      )}
      {currentPage !== "/privacy" && (
        <CookiesConsent
          showNotif={cookiesVisibility}
          setConsentedTo={setConsentedToCookies}
          setNotifVisibility={setCookiesVisibility}
        />
      )}
      <Outlet />
    </>
  );
}
