import React, { useState } from "react";
import SignUpModal from "@/components/Modal/SignUp";
import SignInModal from "@/components/Modal/SignIn";
import FeatureList from "@/components/Others/FeatureList";
import PageTitle from "@/components/Others/PageTitle";

export default function Page() {
  const [isSignUpVisible, setSignUpVisible] = useState<boolean>(false);
  const [isSignInVisible, setSignInVisible] = useState<boolean>(false);

  const toggleSignUpVisibility = () => {
    setSignUpVisible((prevVisible) => !prevVisible);
  };

  const toggleSignInVisibility = () => {
    setSignInVisible((prevVisible) => !prevVisible);
  };

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

        <div className="flex flex-col space-y-2 justify-center items-center mt-4">
          <div className="flex lg:flex-row space-x-3 lg:space-y-0">
            <button
              aria-label="Register"
              onClick={toggleSignUpVisibility}
              className="bg-violet-600 font-medium text-white py-2 sm:px-16 px-12 rounded-full shadow-sm hover:bg-opacity-85 transition duration-300 text-sm"
            >
              Register
            </button>
            <SignUpModal
              visible={isSignUpVisible}
              setIsOpen={setSignUpVisible}
            />
            <button
              aria-label="Sign In"
              onClick={toggleSignInVisibility}
              className="bg-violet-900 font-medium text-white py-2 sm:px-16 px-12 rounded-full shadow-sm hover:bg-opacity-85 transition duration-300 text-sm"
            >
              Sign In
            </button>
            <SignInModal
              visible={isSignInVisible}
              setIsOpen={setSignInVisible}
            />
          </div>

          <p className="text-xs textColor mt-2">
            By continuing, you agree to our{" "}
            <a href="/tos" className="textColor transition duration-300">
              <u>Terms of Service</u>
            </a>{" "}
            and{" "}
            <a href="/privacy" className="textColor transition duration-300">
              <u>Privacy Policy</u>
            </a>
            .
          </p>
        </div>

        <FeatureList />
      </div>
    </>
  );
}
