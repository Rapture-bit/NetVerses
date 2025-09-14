import React, { useState } from "react";
import PageTitle from "@/components/others/PageTitle";

export default function HelpLandingPage() {
  return (
    <>
      <PageTitle title="NetVerse" />
      <div className="flex flex-col ml-4 items-start justify-center min-h-screen p-4 z-10 roboto">
        <div className="flex flex-col items-start space-y-4 w-full">
          <h1 className="text-4xl md:text-5xl font-bold dark:text-violet-100">
            Welcome to NetVerse
          </h1>
          <div className="w-full md:w-3/4 lg:w-1/2 border-l-2 border-violet-300 pl-3">
            <blockquote className="text-base font-medium dark:text-violet-300 italic">
              “Transforming the way you discover and engage with news.” — CEO of
              NetVerse
            </blockquote>
          </div>
          <div className="w-full md:w-3/4 lg:w-1/2">
            <p className="text-base font-normal">
              NetVerse is your new platform for sharing and discovering news.
              Whether you're a journalist, blogger, or simply interested in
              staying updated, you can post and access news for free. Get
              real-time updates and be informed about breaking news as it
              happens.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
