import React, { useState, useEffect, Suspense, useLayoutEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import Cookies from "js-cookie";

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
import LocaleProvider from "@/context/LocaleContext";
import SubdomainDivider from "@/SubdomainDivider";

import "@/libraries/i18n/i18n";

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

  useEffect(() => {
    let isMounted = true;

    const authenticate = async () => {
      try {
        const refreshRes = await fetch(
          "https://api.netverses.com/v1/auth/refresh",
          {
            method: "POST",
            credentials: "include",
          },
        );

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.success && isMounted) {
            setAuth(true);
          }
        }

        const res = await fetch("https://api.netverses.com/v1/self", {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) setAuth(data.success && data.user);
        } else if (isMounted) {
          setAuth(false);
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
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <Suspense fallback={<Loading />}>
            <SubdomainDivider isAuth={isAuth} />
          </Suspense>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
};

root.render(
  <Router>
    <App />
  </Router>,
);
