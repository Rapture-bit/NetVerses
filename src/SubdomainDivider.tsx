import React, {
  useState,
  useEffect,
  useRef,
  Suspense,
  useContext,
  useLayoutEffect,
} from "react";
import { Route, Routes } from "react-router-dom";

import DefaultLayout from "@/layouts/DefaultLayout";
import DocumentationLayout from "@/layouts/DocumentationLayout";

import { UserContext } from "@/context/UserContext";
import { CSRFContext } from "@/context/CSRFContext";

import Loading from "@/components/others/Loading";
import fetchCSRFPost from "./utils/fetchPostPage";

const LandingPage = React.lazy(() => import("@/pages/landingpage"));
const ClubsPage = React.lazy(() => import("@/pages/my/clubs"));
const SettingsPage = React.lazy(() => import("@/pages/my/settings"));
const PostsPage = React.lazy(() => import("@/pages/postpage"));
const Home = React.lazy(() => import("@/pages/home"));
const PageNotFound = React.lazy(() => import("@/pages/pagenotfound"));
const PrivacyPage = React.lazy(() => import("@/subdomains/help/privacypolicy"));
const Messages = React.lazy(() => import("@/pages/messages"));
const ProfilePage = React.lazy(() => import("@/pages/profilepage"));
const ExplorePage = React.lazy(() => import("@/pages/explore"));
const TOSPage = React.lazy(() => import("@/subdomains/help/tos"));

const HelpLandingPage = React.lazy(() => import("@/subdomains/help/landing"));

export default function SubdomainDivider() {
  const { updateCache } = useContext(UserContext);
  const { setCSRFToken } = useContext(CSRFContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuth, setAuth] = useState<boolean>(false);
  const [userCache, setUserCache] = useState<Object[] | null | undefined>(
    undefined,
  );
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useLayoutEffect(() => {
    setSubdomain(window.location.hostname.split(".")[0]);

    const setValue = async () => {
      const cacheValue = await updateCache();
      setUserCache(cacheValue);
    };

    if (!userCache) {
      setValue();
    }
  }, []);

  // Check theme
  useLayoutEffect(() => {
    const setTheme = () => {
      const mode = document.documentElement.getAttribute("data-mode");

      if (mode) {
        document.documentElement.setAttribute("data-mode", mode);
      } else {
        const isDarkMode = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        document.documentElement.setAttribute(
          "data-mode",
          isDarkMode ? "dark" : "light",
        );
      }
    };

    setTheme();

    const mediaQueryListener = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );
    const updateTheme = (event) => {
      document.documentElement.setAttribute(
        "data-mode",
        event.matches ? "dark" : "light",
      );
    };

    mediaQueryListener.addEventListener("change", updateTheme);
    return () => {
      mediaQueryListener.removeEventListener("change", updateTheme);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    let csrfToken = null;

    const csrfElement = document.getElementsByName("csrf")[0];
    if (csrfElement) {
      const csrfContent = csrfElement.getAttribute("content");
      setCSRFToken(csrfContent);
      csrfToken = csrfContent;

      console.log(csrfToken, csrfContent);
    }

    const authenticate = async () => {
      try {
        const refreshData = await fetchCSRFPost(
          "https://api.netverses.com/v1/auth/refresh",
          csrfToken,
        );

        if (
          refreshData.response === "User already authenticated." &&
          isMounted
        ) {
          setAuth(true);
        }

        console.log(csrfToken);

        const selfData = await fetchCSRFPost(
          "https://api.netverses.com/v1/self",
          csrfToken,
        );

        console.log(isMounted, selfData.success, selfData.user);
        if (isMounted) setAuth(selfData.success && selfData.user);
      } catch (err) {
        console.error(err);
        if (isMounted) setAuth(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    authenticate();

    return () => {
      isMounted = false;
    };
  }, []);

  // Check feed
  useEffect(() => {
    if (!isAuth) {
      return;
    }

    if (!localStorage.getItem("selectedFeed")) {
      localStorage.setItem("selectedFeed", "MyFeed");
    }

    if (!localStorage.getItem("selectedFilter")) {
      localStorage.setItem("selectedFilter", "Popular");
    }
  }, [isAuth]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      {subdomain === "help" ? (
        <Routes>
          <Route element={<DocumentationLayout />}>
            <Route path="/" element={<HelpLandingPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/tos" element={<TOSPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route
              path="/"
              element={
                userCache === undefined ? (
                  <Loading />
                ) : userCache !== null ? (
                  <Home />
                ) : (
                  <LandingPage />
                )
              }
            />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/:username/posts/:id" element={<PostsPage />} />
            <Route path="/:username" element={<ProfilePage />} />
            <Route
              path="/my/messages"
              element={
                userCache === undefined ? (
                  <Loading />
                ) : userCache !== null ? (
                  <Messages />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/explore"
              element={
                userCache === undefined ? (
                  <Loading />
                ) : userCache !== null ? (
                  <ExplorePage />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/my/clubs"
              element={
                userCache === undefined ? (
                  <Loading />
                ) : userCache !== null ? (
                  <ClubsPage />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/my/settings"
              element={
                userCache === undefined ? (
                  <Loading />
                ) : userCache !== null ? (
                  <SettingsPage />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      )}
    </Suspense>
  );
}
