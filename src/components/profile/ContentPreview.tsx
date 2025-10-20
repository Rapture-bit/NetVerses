import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import Post from "../post/Post";

import { t } from "i18next";

import type { MenuProps } from "antd/es/menu";

import { Dropdown, ConfigProvider, Space } from "antd";
import DownOutlined from "@ant-design/icons";

interface Props {
  username: string;
}

const ContentPreview = ({ username }: Props) => {
  const [selectedContent, setSelectedContent] = useState<string>("Posts");
  const [selectedFilter, setSelectedFilter] = useState<string>("Popular");

  const [profileColor, setProfileColor] = useState<string>("blue"); // To be updated with API
  const [achievements, setAchievements] = useState<Object[]>([]); // To be updated with API

  const [isLoading, setLoading] = useState<boolean>(true);
  const [userPosts, setUserPosts] = useState<Object[]>([
    {
      id: 1842124855719629177,
      type: "default",
      isNSFW: false,
      description:
        "Explore the new platform where news meets innovation. Stay updated with the latest trends and join the conversation.",
      author: "xenon",
      date: "2024-09-16T05:30:00Z",
      interactions: {
        likes: 120,
        dislikes: 8,
        views: 1500,
        boosts: 50,
        comments: 2000,
      },
      comments: [
        { author: "TechEnthusiast", text: "This is exciting news!" },
        { author: "Innovator", text: "Can't wait to try this out!" },
      ],
    },
    {
      id: 2842124895619732178,
      type: "tech",
      isNSFW: false,
      description:
        "The future of AI is here. Discover how machine learning is transforming industries worldwide.",
      author: "xenon",
      date: "2024-10-01T10:15:00Z",
      interactions: {
        likes: 540,
        dislikes: 12,
        views: 6000,
        boosts: 200,
        comments: 150,
      },
      comments: [
        { author: "AI_Lover", text: "This tech is mind-blowing!" },
        { author: "Skeptic", text: "Will it really change everything?" },
      ],
    },
    {
      id: 4842125055719919180,
      type: "default",
      isNSFW: true,
      description:
        "Content warning: A deeper look into controversial technology trends that are dividing opinions.",
      author: "xenon",
      date: "2024-08-30T08:10:00Z",
      interactions: {
        likes: 320,
        dislikes: 90,
        views: 5000,
        boosts: 100,
        comments: 450,
      },
      comments: [
        { author: "Debater", text: "This is definitely a hot topic!" },
        { author: "NeutralView", text: "I see both sides of the argument." },
      ],
    },
    {
      id: 5842125155720223181,
      type: "default",
      isNSFW: false,
      description:
        "Join the conversation: How social media is evolving with blockchain technology.",
      author: "xenon",
      date: "2024-10-11T14:30:00Z",
      interactions: {
        likes: 430,
        dislikes: 20,
        views: 7000,
        boosts: 175,
        comments: 300,
      },
      comments: [
        {
          author: "CryptoFan",
          text: "Blockchain will revolutionize everything!",
        },
        { author: "Critic", text: "Still waiting for real-world impact." },
      ],
    },
  ]); // To be updated with API

  const [userAchievements, setUserAchievements] = useState<Object[]>([]); // To be updated with API
  const [userClubs, setUserClubs] = useState<Object[]>([]); // To be updated with API

  const [filteredPosts, setFilteredPosts] = useState<object[]>(userPosts);

  const items: MenuProps["items"] = [
    {
      label: (
        <button
          aria-label="Filter by Recent"
          onClick={() => setSelectedFilter("Recent")}
        >
          {t("home.filterOptions.recent")}
        </button>
      ),
      key: "0",
    },
    {
      label: (
        <button
          aria-label="Filter by Popular"
          onClick={() => setSelectedFilter("Popular")}
        >
          {t("home.filterOptions.popular")}
        </button>
      ),
      key: "1",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  });

  useEffect(() => {
    const filterPosts = () => {
      if (selectedFilter === "Popular") {
        const filtered = userPosts
          .filter(
            (post: any) =>
              (post.interactions.likes > 50 &&
                post.interactions.views > 1000) ||
              post.interactions.boosts > 5,
          )
          .sort((a: any, b: any) => {
            const likesDiff = b.interactions.likes - a.interactions.likes;
            if (likesDiff !== 0) return likesDiff;

            const viewsDiff = b.interactions.views - a.interactions.views;
            if (viewsDiff !== 0) return viewsDiff;

            return b.interactions.boosts - a.interactions.boosts;
          });

        setFilteredPosts(filtered);
      } else if (selectedFilter === "Recent") {
        setFilteredPosts(
          [...userPosts].sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        );
      }
    };

    filterPosts();
  }, [selectedFilter, userPosts]);

  return (
    <>
      <div className="relative flex flex-col p-4 sm:pl-5 sm:py-4 rounded-md mx-4 sm:mx-0 w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 darkerBackgroundColor">
        <div className="flex overflow-x-auto scrollbar-hide px-4 gap-5 justify-between items-center">
          <button
            aria-label="Access Posts"
            onClick={() => setSelectedContent("Posts")}
            className={`flex items-center ${selectedContent === "Posts" ? "dark:text-white text-black" : "dark:text-neutral-400 text-neutral-600"} hover:dark:text-white hover:text-black transition-colors duration-200`}
          >
            <span className="icon-[mingcute--grid-line] w-5 h-5 mr-2"></span>
            <span className="font-semibold">Posts</span>
          </button>
          <button
            aria-label="Access Pins"
            onClick={() => setSelectedContent("Pins")}
            className={`flex items-center ${selectedContent === "Pins" ? "dark:text-white text-black" : "dark:text-neutral-400 text-neutral-600"} hover:dark:text-white hover:text-black transition-colors duration-200`}
          >
            <span className="icon-[mynaui--pin] w-5 h-5 mr-2"></span>
            <span className="font-semibold">Pins</span>
          </button>
          <button
            aria-label="Access Followers-Only Posts"
            onClick={() => setSelectedContent("FollowersOnlyPosts")}
            className={`flex items-center ${selectedContent === "FollowersOnlyPosts" ? "dark:text-white text-black" : "dark:text-neutral-400 text-neutral-600"} hover:dark:text-white hover:text-black transition-colors duration-200`}
          >
            <span className="icon-[tabler--eye-star] w-5 h-5 mr-2"></span>
            <span className="font-semibold">Followers Only</span>
          </button>
          <button
            aria-label="Access Achievements"
            onClick={() => setSelectedContent("Achievements")}
            className={`flex items-center ${selectedContent === "Achievements" ? "dark:text-white text-black" : "dark:text-neutral-400 text-neutral-600"} hover:dark:text-white hover:text-black transition-colors duration-200`}
          >
            <span className="icon-[tabler--award] w-5 h-5 mr-2"></span>
            <span className="font-semibold">Achievements</span>
          </button>
          <button
            aria-label="Access Clubs"
            onClick={() => setSelectedContent("Clubs")}
            className={`flex items-center ${selectedContent === "Clubs" ? "dark:text-white text-black" : "dark:text-neutral-400 text-neutral-600"} hover:dark:text-white hover:text-black transition-colors duration-200`}
          >
            <span className="icon-[hugeicons--globe-02] w-5 h-5 mr-2"></span>
            <span className="font-semibold">Clubs</span>
          </button>
          <button
            aria-label="Access Emergencies"
            onClick={() => setSelectedContent("Emergencies")}
            className={`flex items-center ${selectedContent === "Emergencies" ? "dark:text-white text-black" : "dark:text-neutral-400 text-neutral-600"} hover:dark:text-white hover:text-black transition-colors duration-200`}
          >
            <span className="icon-[ph--siren] w-5 h-5 mr-2"></span>
            <span className="font-semibold">Emergencies</span>
          </button>
        </div>
      </div>

      {(selectedContent === "Posts" || selectedContent === "Pins") && (
        <div className="inline-flex items-center justify-between w-full sm:w-3/4 lg:w-3/4 xl:w-1/2 py-2 text-sm font-medium">
          <hr className="flex-1 border-t borderColor mx-2" />
          <div className="gap-2 flex flex-row">
            <span className="text-sm dark:text-neutral-400">Sort by:</span>
            <div className="flex flex-row gap-2">
              <ConfigProvider
                theme={{
                  token: {
                    colorBgBase: ThemeContext.darkerBackgroundColor,
                    colorText: ThemeContext.textColor,
                  },
                }}
              >
                <Dropdown
                  menu={{ items }}
                  className="text-sm font-bold"
                  trigger={["click"]}
                  placement="bottom"
                >
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <Space>
                      {selectedFilter}
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </ConfigProvider>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <span
          className={`icon-[eos-icons--loading] w-7 h-7 text-${profileColor}-500`}
        ></span>
      )}

      {!isLoading &&
        selectedContent === "Posts" &&
        filteredPosts.map((post, index) => (
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
            colorProfile={profileColor}
            comments={post.comments}
          />
        ))}
    </>
  );
};

export default ContentPreview;
