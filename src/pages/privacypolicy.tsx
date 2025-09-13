import React, { useState, useEffect, useLayoutEffect } from "react";
import PageTitle from "@/components/others/PageTitle";
import Footer from "@/components/navigation/Footer";
import DocTab from "@/components/others/document/DocTab";
import { motion } from "framer-motion";

interface Section {
  title: string;
  content: string[];
}

interface Tab {
  title: string;
  subtitles?: string[];
  descriptions?: string[];
  sections?: Section[];
}

export default function PrivacyPage() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const [colorTheme, setColorTheme] = useState<string>("");

  const [Tabs, setTabs] = useState<Tab[]>([
    {
      title: "Privacy Policy",
      subtitles: ["What is a Privacy Policy?"],
      descriptions: [
        `A Privacy Policy is a legal document that outlines how an 
        organization collects, uses, stores, and manages personal 
        information from its users or customers. In this context, 
        NetVerse operates as part of the Xenon Corporation ecosystem, 
        meaning that the practices described in this Privacy Policy 
        apply to all entities within our network.`,
        `This document explains how we collect, use, share, and 
        transfer information. We are committed to keeping you informed 
        about these practices.`,
      ],
    },
    {
      title: "Information We Collect",
      sections: [
        {
          title: "Personal Information",
          content: [
            `We only collect personal information that you voluntarily provide, such as a username, email address, and contact details, when you sign up or interact with specific features of NetVerse. We never ask for sensitive personal information unless it is essential to the service we provide. You control what personal data you share with us, and we keep it secure.`,
          ],
        },
        {
          title: "Usage Data",
          content: [
            `We collect data about your interactions with the platform, like pages you visit, features you use, and the time spent on NetVerse. This data helps us understand your preferences and improve the platform, but it never identifies you personally unless linked to your account. We aim to enhance your experience without compromising your privacy.`,
          ],
        },
        {
          title: "Device Data",
          content: [
            `To ensure the platform works smoothly across different devices, we gather technical information about the devices you use, such as the type of device, operating system, and browser version. This data is anonymous and only used to optimize your experience on NetVerse.`,
          ],
        },
        {
          title: "Location Data",
          content: [
            `If you choose to share your location with us, we will utilize this information to provide region-specific features, such as connecting you with relevant local news and events. You retain full control over your location-sharing preferences and may adjust or disable this functionality at any time through your device settings. We are committed to respecting your privacy and will use this data solely to improve and personalize your experience on our platform.`,
          ],
        },
      ],
    },
    {
      title: "How We Use the Information",
      sections: [
        {
          title: "Platform Improvement",
          content: [
            `The data we collect is used to improve the performance, reliability, and user experience of NetVerse. This includes fixing bugs, enhancing features, and ensuring the platform works efficiently for all users.`,
          ],
        },
        {
          title: "Personalization",
          content: [
            `Your data allows us to offer personalized content and recommendations based on your activity and preferences. This helps you discover relevant content, connections, and experiences tailored to you, ensuring your time on NetVerse is enjoyable and relevant.`,
          ],
        },
      ],
    },
    {
      title: "Data Sharing and Disclosure",
      sections: [
        {
          title: "Third-Party Service Providers",
          content: [
            `We partner with trusted third parties to assist in providing services such as payment processing, hosting, and analytics. These partners only receive the minimum data necessary to perform their functions and are contractually obligated to protect your privacy and security.`,
          ],
        },
        {
          title: "Legal Compliance",
          content: [
            `We may disclose your information if required by law or in response to valid requests by public authorities. In such cases, we are committed to notifying you when possible and ensuring that your rights are respected.`,
          ],
        },
      ],
    },
    {
      title: "Security Measures",
      sections: [
        {
          title: "Encryption and Safeguards",
          content: [
            `Protecting your data is our top priority. We use industry-leading encryption, secure server infrastructure, and regular security audits to safeguard your personal information. Your data is always protected against unauthorized access, breaches, and vulnerabilities.`,
          ],
        },
        {
          title: "Breach Response",
          content: [
            `In the unlikely event of a data breach, we will act quickly to inform you and take immediate action to protect your account. We will notify relevant authorities and work diligently to minimize any potential harm caused by the breach.`,
          ],
        },
      ],
    },
    {
      title: "User Rights and Choices",
      sections: [
        {
          title: "Access and Correction",
          content: [
            `You have the right to access and update the personal information you share with us. We make it easy for you to view, correct, or delete your data directly within your account settings, ensuring your information stays accurate and up-to-date.`,
          ],
        },
        {
          title: "Privacy Settings",
          content: [
            `Our platform provides robust privacy settings, allowing you to customize who can view your profile, share your content, and interact with you. You are in control of your privacy on NetVerse, ensuring a safe and secure social experience.`,
          ],
        },
      ],
    },
    {
      title: "Cookies Technology",
      descriptions: [
        `We use cookies and similar technologies to enhance your experience on our platform. Cookies are small text files stored on your device that allow us to remember your preferences, optimize site performance, and provide personalized content. These cookies may also be used for analytics purposes to help us understand how you interact with NetVerse, enabling us to improve our services and user experience.`,
        `You have the ability to manage or disable cookies through your browser settings at any time. However, please note that disabling cookies may affect the functionality and performance of certain features on our platform. We ensure that all cookies used comply with applicable privacy laws and are handled with the utmost care to safeguard your data.`,
      ],
      sections: [
        {
          title: "Why do we use cookies?",
          content: [
            `We utilize cookies primarily for the following purposes: authentication, security, application features, research, performance analysis, advertising, and integration with third-party websites and applications.`,
          ],
        },
      ],
    },
  ]);

  const maxTabs = Tabs.length;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowScrollButton(true);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  function handleScroll() {
    setActiveTab((prev) => (prev < maxTabs ? prev + 1 : 0));
  }

  useLayoutEffect(() => {
    const getCssVariable = (variable: string) => {
      const root = document.documentElement;
      return getComputedStyle(root).getPropertyValue(variable).trim();
    };

    setColorTheme(getCssVariable("--text-color"));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <PageTitle title="NetVerse ~ Privacy Policy" />
      <div className="relative flex-grow pt-20 md:pt-24 pb-20 md:pb-24 flex flex-col items-center justify-center text-center space-y-4 md:space-y-5 px-4 md:px-10">
        {activeTab === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="w-full max-w-4xl">
              <div className="flex flex-col space-y-2 md:space-y-3 lg:space-y-4 p-4 md:p-6 lg:p-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold rubik tracking-wide">
                  <span>Net</span>
                  <span className="text-purple-600">Verse</span>
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl textColor font-semibold rubik tracking-tight">
                  Privacy Policy
                </h2>
                <h3 className="text-lg md:text-xl lg:text-2xl text-gray-500 font-medium rubik tracking-normal">
                  Effective: August 29, 2024
                </h3>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab > 0 &&
          Tabs.map(
            (Tab, index) =>
              activeTab === index + 1 && (
                <motion.div
                  key={index + 1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  <DocTab
                    title={Tab.title}
                    subtitles={Tab.subtitles}
                    descriptions={Tab.descriptions}
                    sections={Tab.sections}
                  />
                </motion.div>
              ),
          )}
      </div>
      {showScrollButton && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
            <button onClick={handleScroll} className="text-purple-600 text-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
              >
                <g fill="none">
                  <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill={colorTheme}
                    d="M10.5 16.035L7.404 12.94a1.5 1.5 0 1 0-2.122 2.121l5.657 5.657a1.5 1.5 0 0 0 2.122 0l5.657-5.656a1.5 1.5 0 1 0-2.122-2.122L13.5 16.035V4.5a1.5 1.5 0 0 0-3 0z"
                  />
                </g>
              </svg>
            </button>
          </div>
        </motion.div>
      )}
      <Footer />
    </div>
  );
}
