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
import { useCSRFStore } from "@/context/CSRFStore";

import Loading from "@/ui/others/Loading";
import fetchCSRF from "./utils/fetchPageWithCSRFToken";

const UserSettings = React.lazy(() => import("@/pages/usersettings"));
const LandingPage = React.lazy(() => import("@/pages/landingpage"));
const ClubsPage = React.lazy(() => import("@/pages/my/clubs"));
const SettingsPage = React.lazy(() => import("@/pages/my/settings"));
const PostsPage = React.lazy(() => import("@/pages/postpage"));
const Home = React.lazy(() => import("@/pages/home"));
const PageNotFound = React.lazy(() => import("@/pages/pagenotfound"));
const PrivacyPage = React.lazy(() => import("@/subdomains/help/privacypolicy"));
const Messages = React.lazy(() => import("@/pages/messages"));
const RecoverPassword = React.lazy(() => import("@/pages/recover-pass"));
const ConnectAccount = React.lazy(() => import("@/pages/connect-existing-acc"));
const ProfilePage = React.lazy(() => import("@/pages/profilepage"));
const StarPlus = React.lazy(() => import("@/pages/starplus"));
const ExplorePage = React.lazy(() => import("@/pages/explore"));
const TOSPage = React.lazy(() => import("@/subdomains/help/tos"));
const ChildSharingSafetyPage = React.lazy(
  () => import("@/subdomains/help/child-sharing-policy"),
);
const HelpLandingPage = React.lazy(() => import("@/subdomains/help/landing"));

export default function SubdomainDivider() {
  const { userData } = useContext(UserContext)!;

  const [loading, setLoading] = useState<boolean>(true);
  const [isAuth, setAuth] = useState<boolean>(false);
  const { csrfToken, setCSRFToken } = useCSRFStore();
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useLayoutEffect(() => {
    setSubdomain(window.location.hostname.split(".")[0]);
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
    const updateTheme = (event: any) => {
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
    const authenticate = async () => {
      try {
        if (!userData || userData === null) {
          if (isMounted) setAuth(false);
          return;
        }

        if (isMounted && userData) {
          setAuth(true);
        }
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
  }, [csrfToken, attempt]);

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
            <Route path="/child-safety" element={<ChildSharingSafetyPage />} />
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
                userData === undefined ? (
                  <Loading />
                ) : userData !== null ? (
                  <Home />
                ) : (
                  <LandingPage />
                )
              }
            />
            <Route path="/u/:username/posts/:id" element={<PostsPage />} />
            // Add comments page
            <Route path="/u/:username" element={<ProfilePage />} />
            <Route path="/starplus" element={<StarPlus />} />
            <Route path="/my/settings" element={<UserSettings />} />
            <Route
              path="/my/messages"
              element={
                userData === undefined ? (
                  <Loading />
                ) : userData !== null ? (
                  <Messages />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/explore"
              element={
                userData === undefined ? (
                  <Loading />
                ) : userData !== null ? (
                  <ExplorePage />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route path="/auth/connect" element={<ConnectAccount />} />
            <Route
              path="/recover-password"
              element={
                userData === undefined ? (
                  <Loading />
                ) : userData === null ? (
                  <RecoverPassword />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/my/clubs"
              element={
                userData === undefined ? (
                  <Loading />
                ) : userData !== null ? (
                  <ClubsPage />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/my/settings"
              element={
                userData === undefined ? (
                  <Loading />
                ) : userData !== null ? (
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
