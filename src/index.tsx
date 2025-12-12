import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

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
import AnimateProvider from "@/context/AnimateContext";
import SubdomainDivider from "@/SubdomainDivider";
import CSRFProvider, { CSRFContext } from "@/context/CSRFContext";

import AnimationPlayer from "./components/others/AnimationPlayer";

import "@/libraries/i18n/i18n";

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "I") {
    event.preventDefault();
  }
});

const rootElement = document.getElementById("app") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

const App = () => {
  return (
    <CSRFProvider>
      <ThemeProvider>
        <LocaleProvider>
          <UserProvider>
            <AnimateProvider>
              <SubdomainDivider />
            </AnimateProvider>
          </UserProvider>
        </LocaleProvider>
      </ThemeProvider>
    </CSRFProvider>
  );
};

root.render(
  <Router>
    <App />
  </Router>,
);
