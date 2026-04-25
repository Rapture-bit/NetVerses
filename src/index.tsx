import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { useEffect } from "react";

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

import ThemeProvider from "@/context/ThemeContext";
import UserProvider from "@/context/UserContext";
import LocaleProvider from "@/context/LocaleContext";
import SubdomainDivider from "@/SubdomainDivider";

import { useCSRFStore } from "@/context/CSRFStore";

import "@/libraries/i18n/i18n";

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "I") {
    event.preventDefault();
  }
});

const rootElement = document.getElementById("app") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

const App = () => {
  const { initCSRFToken, csrfToken, setCSRFToken } = useCSRFStore();

  useEffect(() => {
    const runAsync = async () => {
      const token = await initCSRFToken();
      if (token) {
        setCSRFToken(token);
      }
    };

    runAsync();
  }, [initCSRFToken, setCSRFToken]);

  useEffect(() => {
    console.log(csrfToken);
  }, [csrfToken]);

  return (
    <ThemeProvider>
      <LocaleProvider>
        <UserProvider>
          <SubdomainDivider />
        </UserProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
};

root.render(
  <Router>
    <App />
  </Router>,
);
