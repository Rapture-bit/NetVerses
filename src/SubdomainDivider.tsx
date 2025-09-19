import React, { useState, useLayoutEffect } from "react";
import { Route, Routes } from "react-router-dom";

import DefaultLayout from "@/layouts/DefaultLayout";
import DocumentationLayout from "@/layouts/DocumentationLayout";

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

const HelpLandingPage = React.lazy(() => import("@/subdomains/help/landing"));

export default function SubdomainDivider({ isAuth }) {
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useLayoutEffect(() => {
    setSubdomain(window.location.hostname.split(".")[0]);
  }, []);

  if (subdomain === null) {
    return null;
  }

  return (
    <>
      {subdomain === "help" ? (
        <Routes>
          <Route element={<DocumentationLayout />}>
            <Route path="/" element={<HelpLandingPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={isAuth ? <Home /> : <LandingPage />} />
            <Route path="/starplus" element={<StarPlus />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/:username/posts/:id" element={<PostsPage />} />
            <Route path="/:username" element={<ProfilePage />} />
            <Route
              path="/messages"
              element={isAuth ? <Messages /> : <PageNotFound />}
            />
            <Route
              path="/explore"
              element={isAuth ? <ExplorePage /> : <PageNotFound />}
            />
            <Route
              path="/my/*"
              element={isAuth ? <ClubsPage /> : <PageNotFound />}
            />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      )}
    </>
  );
}
