import { Link } from "react-router-dom";
import React from "react";

export default function Footer() {
  return (
    <footer className="textColor py-4">
      <div className="px-4 flex flex-row justify-center items-center">
        <div className="flex flex-row space-x-3 md:space-x-6 text-sm md:text-base">
          <Link
            to="https://help.netverses.com/privacy"
            className="hover:underline"
          >
            Privacy Policy
          </Link>
          <Link to="https://help.netverses.com/tos" className="hover:underline">
            Terms of Service
          </Link>
          <Link
            to="https://help.netverses.com/support"
            className="hover:underline"
          >
            Support
          </Link>
          <Link to="https://help.netverses.com/api" className="hover:underline">
            API
          </Link>
        </div>
      </div>
    </footer>
  );
}
