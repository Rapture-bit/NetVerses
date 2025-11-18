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

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import AnimationPlayer from "@/components/others/AnimationPlayer";

import CookiesConsent from "@/components/modal/BottomMenu/CookiesConsent";
import TopBar from "@/components/navigation/TopBar";
import LeftBar from "@/components/navigation/LeftBar";
import RightBar from "@/components/navigation/RightBar";
import PortableChat from "@/components/navigation/PortableChat";

import Loading from "@/components/others/Loading";

import { AnimateContext } from "@/context/AnimateContext";
import { UserContext } from "@/context/UserContext";

const GA_TRACKING_ID = "G-EDV3RGP46V"; // [!] GA_TRACKING_ID

export default function DefaultLayout() {
  const location = useLocation();

  const { userCache, updateCache } = useContext(UserContext);
  const { animSrc, setCurrentRef } = useContext(AnimateContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [animationSrc, setAnimationSrc] = useState<string | null>(null);
  const dotLottieRef = useRef(null);

  const [currentPage, setCurrentPage] = useState<string>("");
  const [cookiesVisibility, setCookiesVisibility] = useState<boolean | null>(
    null,
  );
  const [consentedToCookies, setConsentedToCookies] = useState<String[]>([]);
  const [nonce, setNonce] = useState<string | null>(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setAnimationSrc(animSrc);
    console.log(animSrc);
  }, [animSrc]);

  useEffect(() => {
    setCurrentRef(dotLottieRef?.current);
  }, [dotLottieRef]);

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

  useEffect(() => {
    let userDetails;

    userDetails = {
      success: true,
      user: null,
    };

    userDetails.user = userCache;
    if (!userDetails?.user) return;

    const profileData = {
      profile: {
        username: userDetails.user.username,
        profile_picture: userDetails.user.profile_picture,
        banner: userDetails.user.banner,
        career: userDetails.user.career,
        isVerified: userDetails.user.isVerified,
        bio: userDetails.user.bio,
      },
      analytics: {
        followers: userDetails.user.followers,
        following: userDetails.user.following,
      },
      userPreferences: {
        profileColor: userDetails.user.colorPreference,
      },
    };

    setUserData(profileData);
  }, [userCache]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {userCache !== null && !loading && <TopBar />}
          {userCache == null && !loading && currentPage !== "/" && <TopBar />}
          {userCache !== null &&
            currentPage !== "/privacy" &&
            currentPage !== "/my/messages" && <LeftBar userData={userData} />}
          {userCache !== null &&
            currentPage !== "/my/messages" &&
            currentPage !== "/privacy" && <PortableChat />}
          {userCache !== null &&
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
            <AnimationPlayer />
            <div className="relative">
              <Outlet />
            </div>
          </div>
        </>
      )}
    </>
  );
}
