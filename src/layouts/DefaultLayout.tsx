import { useLocation } from "react-router-dom";
import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useContext,
} from "react";
import { Outlet } from "react-router-dom";
import Cookies from "js-cookie";

import CookiesConsent from "@/ui/modal/BottomMenu/CookiesConsent";
import TopBar from "@/ui/navigation/TopBar";
import LeftBar from "@/ui/navigation/LeftBar";
import RightBar from "@/ui/navigation/RightBar";
import PortableChat from "@/ui/navigation/PortableChat";

import Loading from "@/ui/others/Loading";

import { UserContext } from "@/context/UserContext";

const GA_TRACKING_ID = "G-EDV3RGP46V"; // [!] GA_TRACKING_ID

export default function DefaultLayout() {
  const location = useLocation();

  const { userData } = useContext(UserContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [animationSrc, setAnimationSrc] = useState<string | null>(null);
  const dotLottieRef = useRef(null);

  const [currentPage, setCurrentPage] = useState<string>("");
  const [cookiesVisibility, setCookiesVisibility] = useState<boolean | null>(
    null,
  );
  const [consentedToCookies, setConsentedToCookies] = useState<String[]>([]);
  const [nonce, setNonce] = useState<string | null>(null);

  const findElement = (cookieName: string): boolean => {
    return consentedToCookies.includes(cookieName);
  };

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
    setCurrentPage(location.pathname);
  }, [location]);

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
      {loading ? (
        <Loading />
      ) : (
        <>
          {userData !== null && !loading && <TopBar />}
          {userData == null && !loading && currentPage !== "/" && <TopBar />}
          {userData !== null &&
            currentPage !== "/privacy" &&
            currentPage !== "/my/messages" && <LeftBar userData={userData} />}
          {userData !== null &&
            currentPage !== "/my/messages" &&
            currentPage !== "/privacy" && <PortableChat />}
          {userData !== null &&
            currentPage !== "/privacy" &&
            currentPage !== "/my/messages" && <RightBar />}
          {currentPage !== "/privacy" && (
            <CookiesConsent
              showNotif={cookiesVisibility}
              setConsentedTo={setConsentedToCookies}
              setNotifVisibility={setCookiesVisibility}
            />
          )}
          <div className="relative min-h-screen">
            <div className="relative">
              <Outlet />
            </div>
          </div>
        </>
      )}
    </>
  );
}
