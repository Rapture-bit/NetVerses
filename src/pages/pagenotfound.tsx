import React, { useState } from "react";
import PageTitle from "@/components/Others/PageTitle";
import TopBar from "@/components/Navigation/TopBar";
import Footer from "@/components/Navigation/Footer";

export default function PageNotFound() {
  const [notFoundDescriptions] = useState([
    "Oops! It seems the page you're looking for has been spaghettified by a cosmic black hole. Try checking the URL or head back to the previous page.",
    "404 Error: This page has vanished into the void. Please check the URL or return to the previous page.",
    "Looks like you've entered a wormhole! The page you're searching for doesn't exist. Go back or try a different URL.",
    "Uh-oh! The page you're seeking has drifted away. Please verify the URL or navigate back.",
    "This page appears to have gone rogue. Double-check the URL or head back to safety.",
    "Behold! It appears you've entered a black hole of lost data. The page you seek has been devoured by the cosmos. Check the URL and try again!",
    "Warning: Your requested page has been sucked into a supernova! The explosion may have scattered it across the universe. Verify the link and see if it survived!",
    "Uh-oh! The page you're trying to reach has been obliterated by a rogue asteroid. The cosmos can be unforgiving—please double-check the URL!",
    "Caution! You've wandered into a nebula of missing pages. The one you’re searching for has either disintegrated or ventured too far into the unknown.",
    "Oops! It looks like the page you wanted has been swallowed by a space-time vortex. Time travel might help, but we recommend checking the URL instead!",
    "Attention! The page you're seeking has been ensnared by a gravitational anomaly. Its fate remains uncertain, please check the URL for accuracy!",
    "Warning: The page has ventured into the dark side of the moon and is now unreachable. Consult your cosmic map or return to safety!",
  ]);

  const getRandomDescription = () => {
    const randomIndex = Math.floor(Math.random() * notFoundDescriptions.length);
    return notFoundDescriptions[randomIndex];
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageTitle title="NetVerse ~ Not Found" />

      <TopBar />

      <div className="flex-grow pt-20 md:pt-24 pb-20 md:pb-24 flex flex-col items-center justify-center text-center space-y-4 md:space-y-5 px-4 md:px-10">
        <span className="bg-gradient-to-b p-2 from-purple-500 to-purple-900 text-transparent bg-clip-text font-bold text-3xl md:text-5xl">
          Page Not Found
        </span>
        <p className="text-sm md:text-base w-full md:w-1/2">
          {getRandomDescription()}
        </p>
        <button
          aria-label="Go Back"
          onClick={() => {
            if (window.history.length > 1) {
              const previousUrl = document.referrer;
              if (previousUrl.startsWith(window.location.origin)) {
                window.history.back();
              } else {
                window.location.href = "/";
              }
            } else {
              window.location.href = "/";
            }
          }}
          className="relative overflow-hidden bg-transparent textColor hover:text-white border-purple-800 border-b-2 py-2 px-6 md:py-1.5 md:px-8 text-white transition-all duration-300 before:absolute before:top-0 before:right-0 before:bottom-0 before:left-full before:bg-purple-800 before:transition-all before:duration-300 hover:before:left-0"
        >
          <span className="relative z-10">Go back</span>
        </button>
      </div>

      <Footer />
    </div>
  );
}
