import React, { useState, useEffect, Suspense, useLayoutEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "@/styles/tailwind.css";
import "@/styles/theme.css";
import "@/styles/global.css";
import "@/styles/accessories.css";

import "@/fonts/lato.css";
import "@/fonts/open-sans.css";
import "@/fonts/roboto.css";
import "@/fonts/poppins.css";
import "@/fonts/inter.css";
import "@/fonts/rubik.css";
import "@/fonts/jost.css";

import Loading from "@/components/others/Loading";
import ThemeProvider from "@/context/ThemeContext";
import AuthProvider from "@/context/AuthContext";
import DefaultLayout from "@/layouts/DefaultLayout";

const LandingPage = React.lazy(() => import("@/pages/landingpage"));
const ClubsPage = React.lazy(() => import("@/pages/my/clubs"));
const PostsPage = React.lazy(() => import("@/pages/postpage"));
const Home = React.lazy(() => import("@/pages/home"));
const PageNotFound = React.lazy(() => import("@/pages/pagenotfound"));
const PrivacyPage = React.lazy(() => import("@/pages/privacypolicy"));
const Messages = React.lazy(() => import("@/pages/messages"));
const StarPlus = React.lazy(() => import("@/pages/starplus"));
const ProfilePage = React.lazy(() => import("@/pages/profilepage"));
const ExplorePage = React.lazy(() => import("@/pages/explore"));

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "I") {
    event.preventDefault();
  }
});

const rootElement = document.getElementById("app") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuth, setAuth] = useState<boolean>(false);

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

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const fetchAPI = await fetch(
          "https://api.netverses.com/v1/auth/status",
          {
            method: "POST",
            credentials: "include",
          },
        );

        if (!fetchAPI.ok) {
          setAuth(false);
          return;
        }

        const fetchResponse = await fetchAPI.json();
        setAuth(fetchResponse.success && fetchResponse.isAuthenticated);
      } catch (error) {
        console.error("Error:", error);
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Check feed
  useEffect(() => {
    console.log(isAuth);
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
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<DefaultLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/starplus" element={<StarPlus />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/:username/posts/:id" element={<PostsPage />} />
              <Route path="/:username" element={<ProfilePage />} />
              {isAuth && (
                <Route path="/messages" element={<Messages />} />
              )}: {<Route path="/messages" element={<PageNotFound />} />}
              {isAuth && (
                <Route path="/explore" element={<ExplorePage />} />
              )}: {<Route path="/explore" element={<PageNotFound />} />}
              {isAuth && <Route path="/my/*" element={<ClubsPage />} />}:{" "}
              {<Route path="/my/*" element={<PageNotFound />} />}
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
};

root.render(
  <Router>
    <App />
  </Router>,
);
