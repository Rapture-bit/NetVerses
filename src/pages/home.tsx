import React, { useEffect, useState, useContext } from "react";
import BottomBar from "@/components/navigation/BottomBar";
import Verse from "@/components/post/Verse";
import Post from "@/components/post/Post";
import Articles from "@/components/post/Articles";
import TodaySummary from "@/components/others/TodaySummary";
import FeedSelection from "@/components/others/FeedSelection";
import BottomPageComponent from "@/components/post/BottomPageComponent";
import type { MenuProps } from "antd/es/menu";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Dropdown, Space, ConfigProvider } from "antd";
import PageTitle from "@/components/others/PageTitle";
import { useTranslation } from "react-i18next";

import { ThemeContext } from "@/context/ThemeContext";

export default function Home() {
  const { t } = useTranslation();
  const { colorProperties } = useContext(ThemeContext);
  const [selectedFilter, setFilter] = useState<string>(
    localStorage.getItem("selectedFilter") || "Popular",
  );
  const [selectedFeed, setSelectedFeed] = useState<string>(
    localStorage.getItem("selectedFeed") || "MyFeed",
  );
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isDropdownOpened, setDropdownOpened] = useState<boolean>(true);
  const [reachedBottom, setReachedBottom] = useState<boolean>(false);
  const [isFeedLoading, setFeedLoading] = useState<boolean>(false);
  const [switchedFeeds, setSwitchedFeeds] = useState<boolean>(false);
  const [topArticles, setTopArticles] = useState<object>([
    {
      title: "Breaking News 1",
      description: "This is the description for breaking news 1.",
      category: "Business",
    },
    {
      title: "Breaking News 2",
      description: "This is the description for breaking news 2.",
      category: "Technology",
    },
    {
      title: "Breaking News 3",
      description: "This is the description for breaking news 3.",
      category: "Health",
    },
  ]); // API
  const [articlesData, setArticlesData] = useState<object[]>([
    {
      id: 1842121242719629177,
      type: "long",
      title: "The Rise of AI: Transforming Industries",
      description:
        "Artificial Intelligence (AI) is rapidly changing industries across the globe. From healthcare to finance, AI is revolutionizing how businesses operate and how we interact with technology. In healthcare, AI-driven tools are now able to analyze medical data and even assist in diagnosing diseases with greater precision than ever before. Meanwhile, in the finance industry, AI is helping to predict market trends, automate trades, and improve risk management strategies. However, with all the benefits AI brings, there are also concerns about its impact on jobs, privacy, and security. As AI continues to evolve, governments and organizations must consider the ethical implications and regulatory measures necessary to ensure its responsible use.",
      date: "2024-09-16T05:30:00Z",
      channel: "Xenon",
      interactions: {
        views: 1500,
        boosts: 50,
      },
    },
    {
      id: 1842121322113221177,
      type: "short",
      title: "Breaking: Meteor Shower Expected Tonight",
      description:
        "A rare meteor shower is expected to light up the sky tonight.",
      date: "2024-09-20T05:30:00Z",
      channel: "Xenon",
      interactions: {
        views: 1500,
        boosts: 100,
      },
    },
    {
      id: 1842121322113221190,
      type: "emergency",
      title: "Emergency: Flood Warning in Coastal Regions",
      regions: [
        "United States (Atlantic Ocean)",
        "Canada (Atlantic Ocean)",
        "Brazil (Atlantic Ocean)",
        "United Kingdom (Atlantic Ocean)",
        "France (Atlantic Ocean)",
        "Spain (Atlantic and Mediterranean Seas)",
        "Portugal (Atlantic Ocean)",
        "South Africa (Atlantic and Indian Oceans)",
        "Nigeria (Atlantic Ocean)",
        "Australia (Pacific and Indian Oceans)",
        "Japan (Pacific Ocean)",
        "India (Indian Ocean)",
        "Egypt (Mediterranean and Red Seas)",
        "Australia (Coral Sea and Pacific Ocean)",
        "Chile (Pacific Ocean)",
        "Mexico (Pacific and Atlantic Oceans)",
        "Argentina (Atlantic Ocean)",
      ],
      description:
        "A flood warning has been issued for several coastal regions due to heavy rainfall. Authorities advise residents to evacuate immediately and seek higher ground. This warning is expected to last for the next 24 hours.",
      date: "2024-09-21T07:00:00Z",
      channel: "Emergency Services",
      interactions: {
        views: 20000,
        boosts: 500,
      },
      emergencySettings: {
        emergencyLevel: 5,
      },
    },
  ]);
  const [versesData, setVersesData] = useState<object[]>([
    {
      id: 1842124855719629177,
      type: "default",
      isNSFW: false,
      description:
        "Explore the new platform where news meets innovation. Stay updated with the latest trends and join the conversation.",
      author: "Xenon",
      date: "2024-09-16T05:30:00Z",
      emergencySettings: {
        emergencyLevel: 3,
      },
      interactions: {
        likes: 120,
        dislikes: 8,
        views: 1500,
        boosts: 50,
        comments: 2000,
      },
      comments: [
        { author: "TechEnthusiast", text: "This is exciting news!" },
        { author: "TechEnthusiast", text: "This is exciting news!" },
        { author: "TechEnthusiast", text: "This is exciting news!" },
        { author: "TechEnthusiast", text: "This is exciting news!" },
        { author: "TechEnthusiast", text: "This is exciting news!" },
        { author: "TechEnthusiast", text: "This is exciting news!" },
        { author: "TechEnthusiast", text: "This is exciting news!" },
      ],
    },
    {
      id: 1842124855719629178,
      title: "Top Features of NetVerses",
      type: "Blog",
      description:
        "Discover the top features of NetVerses that set it apart from other news platforms. Personalized feeds, real-time updates, and more!",
      author: "Xenon",
      date: "2024-09-16T09:30:00Z",
      interactions: {
        likes: 95,
        dislikes: 4,
        views: 800,
        boosts: 35,
        comments: 18,
      },
      comments: [
        { author: "FeatureFan", text: "Loving the personalized feeds!" },
      ],
      isNSFW: false,
    },
    {
      id: 1842124855719629179,
      title: "NetVerses User Tips",
      type: "Blog",
      description:
        "Get the most out of NetVerses with these tips and tricks. Enhance your user experience and stay informed more effectively.",
      author: "NetVersesGuide",
      date: "2024-09-16T09:30:00Z",
      interactions: {
        likes: 85,
        dislikes: 3,
        views: 600,
        boosts: 25,
        comments: 15,
      },
      comments: [
        { author: "PowerUser", text: "These tips are really helpful!" },
      ],
      isNSFW: false,
    },
    {
      id: 1842124855719629180,
      title: "Upcoming Updates on NetVerses",
      type: "Blog",
      description:
        "Stay tuned for exciting updates coming to NetVerses. We’re constantly improving and adding new features to enhance your experience.",
      author: "NetVersesDev",
      date: "2024-09-16T09:30:00Z",
      interactions: {
        likes: 110,
        dislikes: 7,
        views: 1000,
        boosts: 40,
        comments: 20,
      },
      comments: [
        { author: "UpdateFollower", text: "Can’t wait for the new features!" },
      ],
      isNSFW: false,
    },
    {
      id: 1842124855719629181,
      title: "How NetVerses Ensures Privacy",
      type: "Blog",
      description:
        "Learn how NetVerses protects your privacy with advanced security measures and data protection protocols.",
      author: "NetVersesSecurity",
      date: "2024-09-16T09:30:00Z",
      interactions: {
        likes: 130,
        dislikes: 2,
        views: 1300,
        boosts: 45,
        comments: 30,
      },
      comments: [
        { author: "PrivacyAdvocate", text: "Good to know my data is secure." },
      ],
      isNSFW: false,
    },
    {
      id: 1842124855719629182,
      title: "The Future of News on NetVerses",
      type: "Blog",
      description:
        "Explore how NetVerses is shaping the future of news consumption and what you can expect from the platform in the coming years.",
      author: "NetVersesVisionary",
      date: "2024-09-16T09:30:00Z",
      interactions: {
        likes: 140,
        dislikes: 5,
        views: 1400,
        boosts: 55,
        comments: 28,
      },
      comments: [
        {
          author: "FutureReader",
          text: "The future looks bright for NetVerses!",
        },
      ],
      isNSFW: true,
    },
  ]); // API

  const [filteredVerses, setFilteredVerses] = useState<object[]>(versesData);
  const [filteredArticles, setFilteredArticles] =
    useState<object[]>(articlesData);

  useEffect(() => {
    const loadData = () => {
      setTimeout(() => {
        setLoading(false);
      }, 700);
    };
    loadData();
  }, []);

  useEffect(() => {
    const filterPosts = () => {
      let filtered = [];

      if (selectedFilter === "Popular") {
        const data = selectedFeed === "MyFeed" ? versesData : articlesData;

        filtered = data
          .filter(
            (post: any) =>
              ((selectedFeed === "MyFeed"
                ? post.interactions.likes > 100
                : true) &&
                post.interactions.views > 1000) ||
              post.interactions.boosts > 5,
          )
          .sort((a: any, b: any) => {
            if (selectedFeed === "MyFeed") {
              const likesDiff = b.interactions.likes - a.interactions.likes;
              if (likesDiff !== 0) return likesDiff;
            }

            const viewsDiff = b.interactions.views - a.interactions.views;
            if (viewsDiff !== 0) return viewsDiff;

            return b.interactions.boosts - a.interactions.boosts;
          });
      } else if (selectedFilter === "Recent") {
        const data = selectedFeed === "MyFeed" ? versesData : articlesData;
        filtered = data.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
      }

      setFilteredVerses(filtered);
    };

    filterPosts();
  }, [selectedFilter, selectedFeed, versesData, articlesData]);

  const handleFilterChange = (filter: string) => {
    setFilter(filter);
    localStorage.setItem("selectedFilter", filter);
  };

  const handleFeedChange = (selectedfeed: string) => {
    setFeedLoading(true);
    setSelectedFeed(selectedfeed);
    localStorage.setItem("selectedFeed", selectedfeed);
    setTimeout(() => {
      setFeedLoading(false);
    }, 1000);
  };

  const items: MenuProps["items"] = [
    {
      key: "0",
      label: t("home.filterOptions.recent"),
      onClick: () => {
        handleFilterChange("Recent");
      },
    },
    {
      key: "1",
      label: t("home.filterOptions.popular"),
      onClick: () => handleFilterChange("Popular"),
    },
  ];

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setReachedBottom(true);
      } else {
        setReachedBottom(false);
      }
    });
  }, []);

  useEffect(() => {
    setSwitchedFeeds(true);
    setInterval(() => {
      setSwitchedFeeds(false);
    }, 2000);
  }, [selectedFeed]);

  return (
    <>
      <PageTitle title="NetVerses ~ Home" />
      <BottomBar />
      <div className="flex flex-col overflow-x-hidden justify-start items-center w-full h-full pt-24 bg-fixed bg-cover bg-center">
        <div className="flex flex-col overflow-x-hidden space-y-5 items-center w-full roboto">
          <FeedSelection onChange={handleFeedChange} />
          {selectedFeed !== "Articles" && <Verse isComment={false} />}
          {selectedFeed !== "Articles" && (
            <div className="inline-flex items-center justify-between w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 py-2 text-sm font-medium">
              <hr className="flex-1 borderColor border-t mx-2" />
              <div className="gap-2 flex flex-row">
                <span className="text-sm dark:text-neutral-400">
                  {t("home.sortLabel")}
                </span>
                <div className="flex flex-row gap-2">
                  <ConfigProvider
                    theme={{
                      token: {
                        colorBgBase: colorProperties.darkerBackgroundColor,
                        colorText: colorProperties.textColor,
                      },
                    }}
                  >
                    <Dropdown
                      menu={{ items }}
                      className="text-sm font-bold"
                      trigger={["click"]}
                      placement="bottom"
                      onOpenChange={(open) => {
                        setDropdownOpened(open);
                      }}
                    >
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        <Space>
                          {t(
                            `home.filterOptions.${selectedFilter.toLowerCase()}`,
                          )}
                          {isDropdownOpened ? <UpOutlined /> : <DownOutlined />}
                        </Space>
                      </a>
                    </Dropdown>
                  </ConfigProvider>
                </div>
              </div>
            </div>
          )}
          {(isLoading || isFeedLoading) && (
            <span className="icon-[eos-icons--loading] w-7 h-7 text-purple-600"></span>
          )}
          {!isLoading && !isFeedLoading && selectedFeed === "Articles" && (
            <TodaySummary />
          )}
          {!isLoading &&
            !isFeedLoading &&
            (selectedFeed === "Articles"
              ? filteredArticles.map((articles, index) => (
                  <Articles
                    id={articles.id}
                    type={articles.type}
                    key={index}
                    title={articles.title}
                    date={articles.date}
                    description={articles.description}
                    channel={articles.channel}
                    interactions={articles.interactions}
                    isNSFW={articles.isNSFW}
                    emergencySettings={articles.emergencySettings}
                  />
                ))
              : selectedFeed === "MyFeed"
                ? filteredVerses.map((post, index) => (
                    <Post
                      id={post.id}
                      type={post.type}
                      key={index}
                      title={post.title}
                      date={post.date}
                      description={post.description}
                      author={post.author}
                      interactions={post.interactions}
                      isNSFW={post.isNSFW}
                      comments={post.comments}
                    />
                  ))
                : null)}
        </div>
        {!switchedFeeds && (
          <BottomPageComponent
            selectedFeed={selectedFeed}
            bottomReached={reachedBottom}
          />
        )}
      </div>
    </>
  );
}
