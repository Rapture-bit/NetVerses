import { useState, useRef } from "react";

import { Link } from "react-router-dom";
import { Tooltip } from "antd";

import ClubCard from "@/ui/ClubCard";
import ChannelCard from "@/ui/ChannelCard";

import PageTitle from "@/ui/others/PageTitle";

export default function ClubsPage() {
  const toggleBack = () => {};

  const [channels, setChannels] = useState([
    {
      name: "Global Horizon News",
      genres: ["General"],
      leading_journalist: "Xenon",
      description: "Hello.",
      bannerAlt: "Banner",
      bannerUrl: "https://cdn.netverses.com/media/image_placeholder.jpg",
      channelId: "123456789",
    },

    {
      name: "Cosmic Pulse",
      genres: ["Science", "Space"],
      leading_journalist: "Dr. Vega",
      description: "Exploring the universe, one mystery at a time.",
      bannerAlt: "Space Banner",
      bannerUrl: "https://cdn.netverses.com/media/image_placeholder.jpg",
      channelId: "456321987",
    },

    {
      name: "MetroBeat Live",
      genres: ["Local", "Politics"],
      leading_journalist: "Amina Othman",
      description: "The heart of the city, the pulse of the people.",
      bannerAlt: "City Banner",
      bannerUrl: "https://cdn.netverses.com/media/image_placeholder.jpg",
      channelId: "998877665",
    },

    {
      name: "TechNova Daily",
      genres: ["Technology"],
      leading_journalist: "Ethan Sparks",
      description: "Your daily guide into the future of innovation.",
      bannerAlt: "Tech Banner",
      bannerUrl: "https://cdn.netverses.com/media/image_placeholder.jpg",
      channelId: "112233445",
    },

    {
      name: "WorldSport Network",
      genres: ["Sports"],
      leading_journalist: "Carlos Mendes",
      description: "Live scores, global games, and nonstop excitement.",
      bannerAlt: "Sports Banner",
      bannerUrl: "https://cdn.netverses.com/media/image_placeholder.jpg",
      channelId: "889900112",
    },

    {
      name: "Heritage Lens",
      genres: ["Culture", "History"],
      leading_journalist: "Sofia Darwish",
      description: "Bringing the past to life through powerful storytelling.",
      bannerAlt: "History Banner",
      bannerUrl: "https://cdn.netverses.com/media/image_placeholder.jpg",
      channelId: "774411229",
    },

    {
      name: "EcoSphere 24",
      genres: ["Environment"],
      leading_journalist: "Leo Sun",
      description: "Updates and insights on our changing planet.",
      bannerAlt: "Nature Banner",
      bannerUrl: "https://cdn.netverses.com/media/image_placeholder.jpg",
      channelId: "556677889",
    },

    {
      name: "MarketMind TV",
      genres: ["Business", "Economy"],
      leading_journalist: "Helena Brooks",
      description: "Tracking the numbers shaping tomorrow.",
      bannerAlt: "Finance Banner",
      bannerUrl: "https://cdn.netverses.com/media/image_placeholder.jpg",
      channelId: "145632789",
    },

    {
      name: "CineWave Network",
      genres: ["Entertainment", "Movies"],
      leading_journalist: "Max Renner",
      description: "Your front-row seat to all things cinema.",
      bannerAlt: "Cinema Banner",
      bannerUrl: "https://cdn.netverses.com/media/image_placeholder.jpg",
      channelId: "202122232",
    },

    {
      name: "HealthLine Now",
      genres: ["Health"],
      leading_journalist: "Dr. Layla Morgan",
      description:
        "Well-being news, medical breakthroughs, and expert guidance.",
      bannerAlt: "Health Banner",
      bannerUrl: "https://cdn.netverses.com/media/image_placeholder.jpg",
      channelId: "900112233",
    },
  ]);
  const [clubs, setClubs] = useState([
    // API DATA
    {
      name: "Socialist Union Party",
      badges: ["Politics", "Community"],
      members_count: 200,
      online_members: 10,
      clubId: "1234567890",
      description:
        "We work to empower citizens, strengthen public services, and ensure that every member of society can live with dignity and opportunity.",
      bannerUrl: "https://netverses.com/images/soviet.webp",
      logoUrl: "",
    },
    {
      name: "Technocracy Alliance",
      badges: ["Technology", "Science"],
      members_count: 200,
      online_members: 15,
      clubId: "1234567890",
      description:
        "We are a collective of innovators, scientists, engineers, and critical thinkers united by a shared vision: a society guided by human data, and knowledge.",
      bannerUrl: "https://netverses.com/images/technocracy2.webp",
      logoUrl: "",
    },
    {
      name: "Divided's Epic Community",
      badges: ["Sports", "Gaming"],
      members_count: 200,
      online_members: 100,
      clubId: "1234567890",
      description: "This is a cool community.",
      bannerUrl: "https://cdn.netverses.com/media/image_placeholder.jpg",
      logoUrl: "",
    },
    {
      name: "Astronomy Enthusiasts",
      badges: ["Science", "Community"],
      members_count: 120,
      online_members: 50,
      clubId: "1234567891",
      description: "Exploring the universe, one star at a time.",
      bannerUrl: "https://cdn.netverses.com/media/image_placeholder.jpg",
      logoUrl: "",
    },
    {
      name: "Writers & Literature Circle",
      badges: ["Literature", "Community", "Art"],
      members_count: 80,
      online_members: 40,
      clubId: "1234567892",
      description: "A place for aspiring writers and literature lovers.",
      bannerUrl: "https://cdn.netverses.com/media/image_placeholder.jpg",
      logoUrl: "",
    },
    {
      name: "Green Earth Alliance",
      badges: ["Environment", "Community"],
      members_count: 150,
      online_members: 17,
      clubId: "1234567893",
      description: "Promoting sustainability and environmental awareness.",
      bannerUrl: "https://cdn.netverses.com/media/image_placeholder.jpg",
      logoUrl: "",
    },
    {
      name: "Music & Arts Society",
      badges: ["Music", "Art"],
      members_count: 90,
      online_members: 42,
      clubId: "1234567894",
      description: "Celebrating creativity through music and art.",
      bannerUrl: "https://cdn.netverses.com/media/image_placeholder.jpg",
      logoUrl: "",
    },
  ]);

  return (
    <>
      <PageTitle title="NetVerses ~ Clubs" />
      <div className="flex flex-col overflow-x-hidden justify-start items-center w-full h-full pt-24 bg-fixed bg-cover bg-center">
        <div className="flex flex-col overflow-x-hidden space-y-5 items-center w-full roboto">
          <div className="flex flex-row border borderColor justify-between gap-5 p-4 sm:pl-5 sm:py-4 rounded-md mx-auto sm:mx-0 w-1/2 darkerBackgroundColor">
            <Tooltip mouseLeaveDelay={0} title={"Back"} placement={"bottom"}>
              <button
                aria-label="Go Back"
                onClick={toggleBack}
                className="w-5 h-5"
              >
                <span className="icon-[eva--arrow-back-outline] w-5 h-5"></span>
              </button>
            </Tooltip>
            <span className="font-medium">Clubs</span>
          </div>

          <div className="flex flex-col w-1/2 gap-10 relative">
            <div className="flex flex-col">
              <div className="flex flex-row justify-between items-center w-full">
                <span className="font-semibold text-base sm:text-lg">
                  Discover
                </span>
                <Link to={"/my/clubs/search"}>
                  <div className="inline-flex text-sm text-violet-500 hover:underline items-center gap-1">
                    <span>Learn more</span>
                    <span className="icon-[tabler--arrow-right] w-4 h-4"></span>
                  </div>
                </Link>
              </div>

              <div className="relative w-full">
                <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l dark:from-[#111827] from-[#cfcfcf] to-transparent z-10"></div>

                <div className="flex flex-row snap-start snap-mandatory overscroll-x-contain gap-5 overflow-x-auto hide-scrollbar py-2 scroll-smooth relative">
                  {clubs.map((element, index) => (
                    <ClubCard
                      key={index}
                      name={element.name}
                      online_members={element.online_members}
                      badges={element.badges}
                      clubId={element.clubId}
                      members_count={element.members_count}
                      description={element.description}
                      bannerUrl={element.bannerUrl}
                      logoUrl={element.logoUrl}
                    />
                  ))}
                </div>
              </div>
            </div>

            <hr className="borderColor my-0.5" />

            <div className="flex flex-col">
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="font-semibold text-base sm:text-lg">
                    Channels
                  </span>
                  <span className="px-1.5 py-0.5 mb-0.5 rounded-md select-none bg-red-600 text-xs font-medium text-white">
                    NEW
                  </span>
                </div>
                <Link to={"/my/clubs/search"}>
                  <div className="inline-flex text-sm text-violet-500 hover:underline items-center gap-1">
                    <span>Learn more</span>
                    <span className="icon-[tabler--arrow-right] w-4 h-4"></span>
                  </div>
                </Link>
              </div>

              <div className="relative w-full">
                <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l dark:from-[#111827] from-[#cfcfcf] to-transparent z-10"></div>

                <div className="flex flex-row gap-5 overflow-x-auto hide-scrollbar py-2 scroll-smooth relative">
                  {channels.map((element, index) => (
                    <ChannelCard
                      name={element.name}
                      genres={element.genres}
                      leading_journalist={element.leading_journalist}
                      description={element.description}
                      bannerUrl={element.bannerUrl}
                      bannerAlt="Banner"
                      channelId={element.channelId}
                      key={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
